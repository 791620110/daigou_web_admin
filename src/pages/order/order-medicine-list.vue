<style>
    .badge-alone{
        background: #19be6b !important;
    }
</style>
<template>
  <div>
    <Table :columns="medicineList" :data="medicineListData"></Table>
    <Modal
        title="订单药品信息"
        v-model="viewMedicineInfo"
        :mask-closable="false"
        :loading="true"
        width="960px">
        <Form :model="formMedicine" label-position="top">
	      <Row :gutter="10">   
	          <Col span="24">
	          	<FormItem label="B2B药品(药品编号 - 药品名称 - 规格 - 批准文号 - 单位 - 剂型 - 生产厂家)">
		            <Input type="text"  v-model="selectedOrderMedicine.lableValue" :readonly="true"></Input>
		        </FormItem>
		         
		        <FormItem label="云仓仓库药品(请输入药品名称|规格|批准文号|生产厂家进行查询)">
				    <AutoComplete
				        v-model.trim="selectedOrderMedicineName" 
				        @on-search="searchMedicineStockForOptionList" icon="ios-search"
				        @on-select="searchMedicineStock"
				        placeholder="请输入药品名称|规格|批准文号|生产厂家" element-id="AutoCompleteSearch">
				        <Option v-for="item in medicineOptionList" :value="item.labelValue2" :key="item.labelValue">{{item.labelValue}}</Option>
				    </AutoComplete>
		        </FormItem>


		        <Alert type="error" v-if="ordernumberLtZero" show-icon>各个仓库配送数量之和必须为大于零</Alert>
		        <Alert type="warning" v-if="orderNumber != formMedicine.totalNumber" show-icon>配货数量 ( {{orderNumber}} ) 和订单数量 ( {{formMedicine.totalNumber}} ) 不一致，请确认配货数量</Alert>
		        <Alert type="warning" v-for="msg in warningmessage" show-icon>{{msg}}</Alert>



		        <Col span="24" v-if="batchNoArray.length>0" v-for="item in batchNoArray">
		        <Breadcrumb><BreadcrumbItem>
		        <Icon v-show="item.showdown" type="chevron-down" @click.native="item.showdown=false;item.showright=true"/>
		        <Icon v-show="item.showright" type="chevron-right" @click.native="item.showdown=true;item.showright=false"/>&nbsp;
		        批号:{{item.batchno}}</BreadcrumbItem></Breadcrumb>

		      	<Table border :columns="stockList" :data="item.list" v-show="item.showdown"></Table>		      	
				</Col>
				<Col span="24" style="text-align:right;margin:3px" v-if="batchNoArray.length>0" >
		      	 <font style="font-size:125%;"><B>小计</B></font>:&nbsp;&nbsp;
		      	 总配送数量&nbsp;:&nbsp;<B>{{orderNumber}}</B>&nbsp;&nbsp;,&nbsp;&nbsp;
		      	 单价&nbsp;:&nbsp;<InputNumber :min="0.01" :step="0.02" v-model="formMedicine.medicinePrice" :precision="2" placeholder="请输入销售单价" style="width:70px"></InputNumber>&nbsp;&nbsp;,&nbsp;&nbsp;
		      	 药品总价&nbsp;:&nbsp;<B>{{orderAUM}}</B>
		      	</Col>
			  </Col>
	      </Row>

	      <Row :gutter="10">
	          <Col span="24" >
	            <Alert style="margin-top:4px">
			        <template slot="desc">
			        <span><B>已订货数量</B>:已经分仓的订单，但是仓库还没有出库，所以没有反馈到仓库库存数量</span>
			        </template>
			   </Alert>
	          </FormItem>
	          </Col>
	        </Row>
        </Form>
        <div slot="footer">
          <Button type="text" size="large" @click=" viewMedicineInfo = false;">取消</Button>
          <Button type="primary" size="large" @click="saveViewOrderMedicineInfo">确定</Button>
      	</div>
      </Modal>


      <Modal
        v-model="showDoAgainConfirmInfo"
        title="提示信息" @on-ok="doAgain">
        <p style="font-size:15px">药品已经存在分仓信息，您确认要重新分仓吗？</p>
    	</Modal>

  </div>
</template>
<script>
import swal from 'sweetalert2';
  export default {
        props: { row: Object },
        computed : {
            "orderNumber" : function() {
            	let currentOrderNumber = 0;
            	if(this.stockListData.length == 0){this.ordernumberLtZero=false;return 0;}
            	else{
            		for(let record of this.stockListData){
            			currentOrderNumber += record.totalNumber
            		}
            		if(currentOrderNumber>0)this.ordernumberLtZero=false;
            		return currentOrderNumber;
            	}
            },
            "orderAUM" : function() {
            	return new Number(this.orderNumber*this.formMedicine.medicinePrice).toFixed(2);
            }
        },
        data () {
            return {
            	formMedicine:{orderId:'',extOrderCode:'',orderDtlId:'',medicineCode:'',medicineName:'',licenseCode:'',medicineSpec:'',totalNumber:'',medicineFactory:'',medicineUnit:'',medicinePackages:'',medicineBarCode:'',medicineShape:'',medicinePrice:0.00,batchNo:''}, searchForMedicine : true,orderMedicineList:[],
            	batchNoArray:[],
            	selectedOrderMedicineName:'',selectedRow:null,showDoAgainConfirmInfo:false,
            	warningmessage:[], medicineOptionList:[],selectedOrderMedicine:{},viewMedicineInfo:false ,ordernumberLtZero:false, 

                medicineList: [		          
		            {title: '药品编码 - 药品名称 - 规格 - 批准文号 - 单位 - 剂型 - 生产厂家', key: 'medicineCode', align: 'center', width: '48%' , render: (h, params) => {
			          	return params.row.medicineCode+" - "+params.row.medicineName+" - "+params.row.medicineSpec+" - "+
			          	params.row.licenseCode+" - "+params.row.medicineUnit+" - "+params.row.medicineShape+" - "+params.row.medicineFactory;} 
			        },
                    {title: '批号',key: 'batchNo',align: 'center',
                    	render:(h,params)=>{
                    		if(params.row.deliveryList&&params.row.deliveryList.length>0){
                    			var array = [] , arrayh = [];
			          			for(let row of params.row.deliveryList){if(!row.batchNo)break;
			          				let duplicated = false;
			          				for(let bn of array){
			          					if(bn==row.batchNo){
			          						duplicated = true;break;
			          					}
			          				}
			          				if(duplicated)continue;
			          				array.push(row.batchNo)
			          				arrayh.push(h('div',{style: {
                                        marginRight:'2px','white-space':'nowrap'
                                    }}, row.batchNo));
			          			}
			          			if(array.length == 0)return "-/-"
			          			return h('div', arrayh);
		          			}else{
		          				return "-/-"
		          			}
                    	}
                    },
                    {title: '单价',key: 'medicinePrice',align: 'center',
                    	render: (h, params) => {
                    	return params.row.medicinePrice?new Number(params.row.medicinePrice).toFixed(2):'-/-'}},
		            {title: '数量', key: 'totalNumber',  align: 'center'},  
		            {title: '出货数量', key: 'doneNumber',  align: 'center', width:'150px',
		          	render: (h, params) => {	
		          		var array = [] , datamap = {};
		          		for(let i in params.row.deliveryList){
		          			let warehouseCode = params.row.deliveryList[i].warehouseCode;
		          			let warehouseName = params.row.deliveryList[i].warehouseName;
		          			let batchNo = params.row.deliveryList[i].batchNo
		          			let deliveryTotalNumber = params.row.deliveryList[i].deliveryTotalNumber;
		          			if(warehouseCode){
		          				
		          				if(!datamap[warehouseName]){
		          					datamap[warehouseName] = []
		          				}
		          				datamap[warehouseName].push(deliveryTotalNumber)
		          			}
		          		}

		          		for(let item in datamap){
							let arr = datamap[item]
							let deliveryTotalNumber = 0;
							for(let dtn of arr){
								deliveryTotalNumber += dtn;
							}
		          			array.push(h('div',[h('Badge',{props:{'count':item+'('+deliveryTotalNumber+')','class-name':'badge-alone'}})]))
		          		}
		          		
		          		if(array.length == 0){
		          			return "-/-"
		          		}else{
		              		return h('div', array);
		              	}
		            }
		          },    
		          {title: '操作', key: 'action', width: 90, align: 'center',
		            render: (h, params) => {

		                let distribution = h('Button', { props: {  type: 'primary', size: 'small' , style:'margin:2px'}, 
		                  on: { click: () => { this.selectWarehouse(params.row) } } }, '分仓');


		              return h('div',[distribution]);
		            }
		          }
		        ],
		        medicineListData: [],
		        stockList: [
		          {title: '云仓编号', key: 'warehouseCode',align: 'center' },
		          {title: '云仓名称', key: 'warehouseName', align: 'center' },
		          {title: '批号', key: 'batchNo', align: 'center'},
		          {title: '仓库库存',key: 'wmsStockNumber',align: 'center'},
		          {title: '已订货数量', key: 'bookedTotalNumber',  align: 'center'},
		          {title: '参考药品单价', key: 'medicinePrice',  align: 'center'},
		          {title: '配送数量', key: 'totalNumber', align: 'center',
		            render: (h, params) => {
		              return h('div', [h('Input',
		                   { props: {type:'text',value:params.row.totalNumber,number:true },
		                on:{'on-blur':(event) => {
		                	event.target.value = event.target.value.replace(/[^\d.]/g,"");
		                	if(event.target.value == '')event.target.value=0
		               		params.row.totalNumber = event.target.value*1;
		               		var totalNumber = params.row.wmsStockNumber*1
							var inputTotalNumber = event.target.value*1
		                	var bookedTotalNumber = params.row.bookedTotalNumber*1
		               		params.row.totalNumber = event.target.value*1;
		               		let message = params.row.warehouseName+"-"
		               			+params.row.medicine+" 配送数量和已订数量之和大于仓库库存,请确认配送数量";
		               		if(totalNumber < (inputTotalNumber+bookedTotalNumber)){
		               			this.warningmessage.pop(message)
		               			this.warningmessage.push(message)
		               		}else{
		               			this.warningmessage.pop(message)
		               		}
		               		this.updateTotalNumber(params.row)
		               	}} })]);
		            }
		          }
		        ],stockListData: [],distributionListData: []
            }
        },
        methods:{
        	getMedicineInfo1(row, split){
        		return 	row.medicineCode +split+ row.medicineName+split
	            		+ row.medicineSpec+ split+ row.licenseCode+split
	            		+row.medicineUnit+split+row.medicineShape+split+row.medicineFactory
        	},
        	getMedicineInfo2(row, split){
        		return 	row.medicineName+split+ row.medicineSpec+ split+ row.licenseCode+split
	            		+row.medicineUnit+split+row.medicineShape+split+row.medicineFactory+split+row.batchNo
        	},
        	updateTotalNumber(input){

        		for( let record of this.stockListData){
        			if(input.batchNo == record.batchNo && input.warehouseCode == record.warehouseCode){
        				record.totalNumber = input.totalNumber
        			}

        		}
        	},
        	selectWarehouse(row){this.stockListData=[];this.batchNoArray=[]
        		this.formMedicine.orderId = row.orderId;
        		this.formMedicine.extOrderCode = row.extOrderCode;
        		this.formMedicine.orderDtlId = row.orderDtlId;
        		this.formMedicine.medicineCode = row.medicineCode;
		      	this.formMedicine.medicineName = row.medicineName;
		      	this.formMedicine.medicineSpec = row.medicineSpec;
		      	this.formMedicine.licenseCode = row.licenseCode;
		      	this.formMedicine.medicineFactory = row.medicineFactory;
		      	this.formMedicine.medicineUnit = row.medicineUnit;
		      	this.formMedicine.medicinePackages = row.medicinePackages;
		      	this.formMedicine.medicineBarCode = row.medicineBarCode;
		      	this.formMedicine.medicineShape = row.medicineShape;
		      	this.formMedicine.totalNumber = row.totalNumber;
		      	this.formMedicine.batchNo = row.batchNo;
		      	this.formMedicine.medicinePrice = row.medicinePrice?new Number(row.medicinePrice):null;
		      	//显示云仓药品信息
				this.formMedicine.lableValue = this.getMedicineInfo1(row , ' - ')

        		this.selectedOrderMedicine = (this.formMedicine)
        		this.selectedOrderMedicineName = row.medicineName;
        		this.selectedRow = row;
				this.stockListData = [];

				let hasDone = false;
				if(row.deliveryList.length > 0){
					for(var i in row.deliveryList){
						if( row.deliveryList[i].warehouseCode != null && row.deliveryList[i].warehouseCode != ''){
							hasDone = true;
						}
					}
				}
				if(!hasDone){
					this.searchForMedicine = true;
					this.viewMedicineInfo = true;
				}else{
					this.searchForMedicine = false;
					this.distributionListData = row.deliveryList;
					this.showDoAgainConfirmInfo = true;
					this.viewMedicineInfo = false;
				}       		
        	},
        	doAgain(){        		     		
				let record = this.selectedRow.deliveryList[0];
				this.selectedOrderMedicineName = record.medicineName +"|"+ record.medicineSpec+"|"
				            	+ record.licenseCode+"|"+ record.medicineFactory;
				this.searchMedicineStock(this.selectedOrderMedicineName)
				this.viewMedicineInfo = true;
        	},

        	searchMedicineStockForOptionList(){
        		if(!this.searchForMedicine)return;
        		this.medicineOptionList = [];
        		if(this.selectedOrderMedicineName==''){
        			this.medicineOptionList = [{"labelValue":"请输入查询的药品信息","labelValue2":""}]
        			return false;
        		}
        		let array = this.selectedOrderMedicineName.split("|");
			    let params = {"showLoading":"N"};
			    var keys = ["medicineName","medicineSpec","licenseCode","medicineFactory","batchNo"]
			    for(let index = 0 ; index < array.length ; index ++){
					params[keys[index]] = array[index];
			    }
			    this.medicineOptionList = [{"labelValue":"查询中......","labelValue2":""}]
        		this.$api.searchMedicineStock(params).then(
					response => {
						if(response.status == "S"){
							let selectedMedicineNameList = [] , selectedMedicineList = [];
				            for(let record of response.result){
				            	
				            	let lableValue2 = record.medicineName +"|"+ record.medicineSpec+"|"
				            	+ record.licenseCode+"|"+ record.medicineFactory;
				            	let lableValue = lableValue2;
								let duplicateCheck = false;
				            	for(var ii in selectedMedicineNameList){
				            		if(selectedMedicineNameList[ii] == lableValue){
				            			duplicateCheck = true;break;
				            		}
				            	}
				            	if(duplicateCheck)continue;
				            	selectedMedicineNameList.push(lableValue);
				            	record.labelValue = lableValue
				            	record.labelValue2 = lableValue2
				            	selectedMedicineList.push(record)				            	
				            }
				            if(selectedMedicineNameList.length == 0){
				            	this.medicineOptionList = [{"labelValue":"很抱歉，没有找到符合的药品!","labelValue2":""}]
				            }else{
				            	this.medicineOptionList = selectedMedicineList;
				            }
				            document.getElementById("AutoCompleteSearch").blur();
				            document.getElementById("AutoCompleteSearch").focus();
						}else{
				            swal('获取药品信息列表失败，请刷新重试', res.message, 'error');
				        }
					}
				)
        	},

        	searchMedicineStock(val){
        		
			    let array = val.split("|");
			    let medicineName = array[0] , medicineSpec=array[1],licenseCode=array[2],medicineFactory=array[3],    	batchNo=array[4]
			    this.formMedicine.batchNo = batchNo;
        		this.stockListData = [];this.batchNoArray=[]
        		if(this.selectedOrderMedicineName=='')return false;				
        		this.$api.searchMedicineStock(
	        		{medicineName:medicineName,"showLoading":"N",medicineSpec:medicineSpec,licenseCode:licenseCode,
	        		medicineFactory:medicineFactory}
	        	).then(
					response => {
						if(response.status == "S"){
							let lengthofstock = response.result.length , maxMedicinePrice = 0.00;						
				           
				            for(let record of response.result){		
				            	record.totalNumber = lengthofstock > 1 ? 0 : this.selectedRow.totalNumber
				            	if(this.selectedRow.deliveryList){
				            		for(var i in this.selectedRow.deliveryList){
				            			if(this.selectedRow.deliveryList[i].warehouseCode == record.warehouseCode
				            				&& this.selectedRow.deliveryList[i].batchNo == record.batchNo){
				            				record.totalNumber = this.selectedRow.deliveryList[i].deliveryTotalNumber
				            			}
				            		}
				            	}				            	
				            }
				            this.stockListData = response.result

				            let datamap = {};
							for(let record of this.stockListData){				            	
				            	if(record.medicinePrice*1 > maxMedicinePrice*1){
				            		maxMedicinePrice = record.medicinePrice
				            	}
				            	if(!datamap[record.batchNo]){
				            		datamap[record.batchNo] = []
				            	}
				            	if(!record.totalNumber)
				            	record.totalNumber = 0;
				            	datamap[record.batchNo].push(record);
				            }
				            for(let key in datamap){
				            	let data = {"batchno":key , "list":datamap[key],"showright":false , "showdown":true};
				            	this.batchNoArray.push(data);
				            }
				            this.searchForMedicine = true;
				            if(this.formMedicine.medicinePrice==null){
			            		this.formMedicine.medicinePrice = maxMedicinePrice;
			            	}
						}else{
				            swal('获取药品库存信息列表失败，请刷新重试', res.message, 'error');
				            this.searchForMedicine = true;
				        }
					}
				)
        	},
        	saveViewOrderMedicineInfo(){
        		let validResult = false , orNumber = 0;
				for(var i in this.stockListData){
		      		orNumber += this.stockListData[i].totalNumber*1;
				} 
				if(!orNumber>0){
					this.ordernumberLtZero = true;
					validResult = false;
				}else{
					validResult = true;
					this.ordernumberLtZero = false
				}
				if(!validResult)return false;
		        var medicineinfo = { 
		              orderId:this.formMedicine.orderId,
		              extOrderCode:this.formMedicine.extOrderCode,
        		      orderDtlId:this.formMedicine.orderDtlId,
			          medicineCode:this.formMedicine.medicineCode,
			          medicineName:this.formMedicine.medicineName , 
			          medicineSpec:this.formMedicine.medicineSpec,
			          totalNumber:this.formMedicine.totalNumber,
			          licenseCode:this.formMedicine.licenseCode,
			          medicineUnit:this.formMedicine.medicineUnit,
			          medicineBarCode:this.formMedicine.medicineBarCode,
			          medicinePackages:this.formMedicine.medicinePackages,
			          medicineFactory:this.formMedicine.medicineFactory,
			          medicinePrice:this.formMedicine.medicinePrice,
			          medicineShape:this.formMedicine.medicineShape,
			          //batchNo:this.formMedicine.batchNo,//BatchNo在分仓完成时补全
			          deliveryList:[]
		        }
		      	for(var i in this.stockListData){
		      		var row = this.stockListData[i];
		      		if(row.totalNumber*1 > 0){
		      			var data = {
		      				warehouseCode:row.warehouseCode , 
		      				warehouseName : row.warehouseName , 
		      				deliveryTotalNumber:row.totalNumber,
		      				medicineCode:row.medicineCode,
					        medicineName:row.medicineName , 
					        medicineSpec:row.medicineSpec,
					        licenseCode:row.licenseCode,
					        medicineUnit:row.medicineUnit,
					        medicineBarCode:row.medicineBarCode,
					        medicinePackages:row.medicinePackages,
					        medicineFactory:row.medicineFactory,
					        medicinePrice:this.formMedicine.medicinePrice,
			          		medicineShape:row.medicineShape,
					        batchNo:row.batchNo
		      			}
						medicineinfo.deliveryList.push(data);
		      		}
		      	}				
				this.$api.doOrderDetailsDistributionSave(medicineinfo).then(res => {
	                if(res.status == "S"){
	                    swal({text: '保存成功!',type: 'success',showCancelButton: false,width:300}).then((isConfirm)=>{
							this.init();
							this.viewMedicineInfo = false;
						});
	                }else{
	                  swal('操作失败', res.result.message, 'error');
	                }
	            })
        	},
        	init(){
	        	this.$api.doOrderDetailsDistributionInfo({"orderId":this._props.row.orderId,"showLoading":"Y"}).then(res => {
	                if(res.status == "S"){
	                    this.medicineListData = res.result
	                }else{
	                  swal('获取订单明细失败', res.message, 'error');
	                }
	            })
        	}
        },
        created(){
        	this.init();
        	this.orderTotalNumber = this._props.row.totalNumber

        	this.$Loading.config({
			    color: '#2d8cf0',
			    failedColor: '#f0ad4e',
			    height: 5
			});
        },
        updated(){
        	//document.getElementById("AutoCompleteSearch").click(); 
        }
    };
</script>
