<template>
  <div>
    <Breadcrumb>
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>订单管理</BreadcrumbItem>
      <BreadcrumbItem>订单新增</BreadcrumbItem>
    </Breadcrumb>
    <Form :model="formOrder" label-position="top"  style="margin-top: 20px">        
        <Row :gutter="10">
	        <Col span="24">
		        <Tabs :animated="false" :value="selectedTab" @on-click=tabsClickFunc>
		        	<TabPane label="订单基本信息" name="basic">
		        	    <Form :model="formOrder" ref="formOrder1" :rules="ruleValidate1">  
			        		<Row :gutter="10">
					          <Col span="8">
					          <FormItem label="发货方名称" prop="senderName">
					            <Input type="text" v-model="formOrder.senderName"></Input>
					          </FormItem>
					          </Col>
					          <Col span="8">
					          <FormItem label="发货方联系电话" prop="senderMobile">
					            <Input type="text" v-model="formOrder.senderMobile"></Input>
					          </FormItem>
					          </Col>
					          <Col span="8">
					          <FormItem label="发货方联系人" prop="senderPerson">
					            <Input type="text" v-model="formOrder.senderPerson"></Input>
					          </FormItem>
					          </Col>
					        </Row>  
					        <Row :gutter="10">
					          <Col span="8" >
					          <FormItem label="发货方系统订单编号(必须唯一)" prop="extOrderCode">
					            <Input type="text" v-model="formOrder.extOrderCode" placeholder="请输入发货方系统订单编号"></Input>
					          </FormItem>
					          </Col>
					          <Col span="4" >
					          <FormItem label="是否保价" prop="insurance">
					            <RadioGroup v-model="formOrder.insurance" type="button">
					                <Radio label="Y">保价</Radio>
					                <Radio label="N">不保价</Radio>
					            </RadioGroup>
					          </FormItem>
					          </Col>
					          <Col span="4" v-show="formOrder.insurance == 'Y'">
					          <FormItem label="保价金额(元)" prop="insuranceAmount" :required="true">
					            <Input type="text" v-model="formOrder.insuranceAmount" :number="true" placeholder="保价款金额(元)"></Input>
					          </FormItem>
					          </Col>
					          <Col span="4" >
					          <FormItem label="是否代收款" prop="collectPayment">
					            <RadioGroup v-model="formOrder.collectPayment" type="button" @on-change="collectPaymentChanged">
					                <Radio label="Y">代收</Radio>
					                <Radio label="N">不代收</Radio>
					            </RadioGroup>
					          </FormItem>
					          </Col>
					          <Col span="4" v-show="formOrder.collectPayment == 'Y'">
					          <FormItem label="代收款金额(元)" prop="paymentAmount" :required="true">
					            <Input type="text" v-model="formOrder.paymentAmount" :number="true" placeholder="代收款金额(元)"></Input>
					          </FormItem>
					          </Col>
					        </Row> 
					        <Row :gutter="10">
					          <Col span="24" >
					          <FormItem label="备注" prop="remarks">
					            <Input v-model="formOrder.remarks" type="textarea" :autosize="{minRows: 5,maxRows: 5}" placeholder="请输入备注信息(系统默认使用先进先出发货 ,  如您对发货有特殊要求，请在备注中标识)"></Input>
					          </FormItem>
					          </Col>
					        </Row>
					        <Row :gutter="10">
					            <Alert style="margin-top:4px">
							        <template slot="desc"><B>系统默认使用先进先出发货 ,  如您对发货有特殊要求，请在备注中标识</B></template>
							   </Alert>
					        </Row>
				        </Form>
		        	</TabPane>
			        <TabPane label="订单地址(收货)详情" name="address">
			        	<Form :model="formOrder" ref="formOrder2" :rules="ruleValidate2">			        		
				        	<Row :gutter="10">
					          <Col span="12">
					           <FormItem label="">
					            <RadioGroup v-model="formOrder.newAddress" type="button">
					                <Radio label="Y">使用新的收货地址</Radio>
					                <Radio label="N">使用已有收货地址</Radio>
					            </RadioGroup>
					           </FormItem> 
					          </Col>					          
					        </Row>
					        <Row :gutter="10" v-show="formOrder.newAddress=='Y'">
					          <Col span="8">
					          <FormItem label="收货方名称" prop="receiverName">
					            <Input type="text" v-model="formOrder.receiverName" placeholder="请输入收货方名称"></Input>
					          </FormItem>
					          </Col>
					          <Col span="16">
					            <FormItem label="收货地址 -- 省 / 市 / 区" :required="true" prop="areaSelectProp">
					              <areaselect :level="2" type="text" v-model='distpicker' placeholder="请选择省/市/区"></areaselect>
					            </FormItem>
					           </Col>
					        </Row>
					        <Row :gutter="10" v-show="formOrder.newAddress=='Y'">
					          <Col span="4">
					          <FormItem label="联系人" prop="receiverPerson">
					            <Input type="text" v-model="formOrder.receiverPerson" placeholder="请输入联系人"></Input>
					          </FormItem>
					          </Col>
					          <Col span="4">
					          <FormItem label="联系电话" prop="receiverMobile">
					            <Input type="text" v-model="formOrder.receiverMobile" placeholder="请输入联系电话"></Input>
					          </FormItem>
					          </Col>
					          <Col span="11">
					            <FormItem label="收货地址 -- 街区地址" prop="receiverAddress">
					              <Input v-model="formOrder.receiverAddress"  placeholder="请输入街区地址"></Input>
					            </FormItem>
					          </Col>
					          <Col span="4">
					          <FormItem label="邮编" prop="receiverPostcode">
					            <Input type="text" v-model="formOrder.receiverPostcode" placeholder="请输入邮编号码"></Input>
					          </FormItem>
					          </Col>
					        </Row>
					        <Row :gutter="10" v-show="formOrder.newAddress=='N'" style="height:300px">
					          <Col span="23">
					          <FormItem label="收货地址 (收件人名称 - 联系人 - 联系电话 - 地址  - 邮编)"  prop="receiverAddrId" :required="true">
						          <Select v-model="formOrder.receiverAddrId" filterable @on-change="receiverAddressChanged" placeholder="请选择收货方地址">
						          	  <Option value="">&nbsp;</Option>
						              <Option v-for="item in reciverAddressList" :value="item.addrId" :key="item.addrId">{{item.lableValue}}</Option>
						            </Select>
						      </FormItem>
					          </Col>
					        </Row>
			        	</Form>
			        </TabPane>
			        <TabPane :label="label" name="order">
			        <Alert type="error" v-if="orderDetailCheckFail" show-icon>订单明细不能为空</Alert>
			        <Row>
			        	<Col span="24" style="margin-bottom:4px">
					   	 <Button type="primary" style="float:right" @click="addOrderMedicine()" icon="plus-round">新增订单药品</Button>
					   	 </Col>
					    <Col span="24">
          				<Table border :columns="medicineList" :data="medicineListData"></Table>
          				</Col>
			        </Row>
			        </TabPane>

			        <Button type="primary" slot="extra" style="margin:4px" @click="confirmOrder()">提交订单</Button>
			    </Tabs>
		    </Col>
        </Row>  
      </Form>
      
      
      <Modal
        title="订单药品信息"
        v-model="showMedicineInfo"
        :mask-closable="false"
        :loading="true"
        width="960px">
        <Form :model="formMedicine" label-position="top" ref="formMedicine" :rules="ruleValidateOfFormMedicine">
	      <Row :gutter="10">   
	          <Col span="24">
	          	<FormItem label="云仓药品(药品名称 - 规格 - 批准文号 - 单位 - 剂型 - 生产厂家 - 批号)" prop="lableValue">
		            <Select v-model="formMedicine.lableValue"  @on-change="getMedicineStock" label-in-value placeholder="请选择云仓药品" :filterable="true">
		              <Option v-for="item in orderMedicineList" :key="item.lableValue" :value="item.lableValue">{{item.lableValue}}</Option>
		            </Select>
		         </FormItem>	
		    </Col>			
			<Col span="24">
		         <Alert type="error" v-if="ordernumberLtZero" show-icon>各个仓库批号配送数量之和必须为大于零</Alert>
				 <Alert type="warning" v-for="msg in warningmessage" show-icon>{{msg}}</Alert>
		      	 <Table border :columns="stockList" :data="stockListData" v-show="showStock"></Table>
		    </Col>  
		    <Col span="24" v-if="showStock"  style="text-align:right;margin:3px">
		      	 <font style="font-size:125%;"><B>小计</B></font>:&nbsp;&nbsp;
		      	 总配送数量&nbsp;:&nbsp;<B>{{orderNumber}}</B>&nbsp;&nbsp;,&nbsp;&nbsp;
		      	 单价&nbsp;:&nbsp;<InputNumber :min="0.01" :step="0.02" v-model="formMedicine.medicinePrice" :precision="2" placeholder="请输入销售单价" style="width:70px"></InputNumber>&nbsp;&nbsp;,&nbsp;&nbsp;
		      	 药品总价&nbsp;:&nbsp;<B>{{orderAUM}}</B>
			</Col>
	      </Row>
	      <Row :gutter="10">
	          <Col span="24" >
	            <Alert style="margin-top:4px">
			        <template slot="desc">
			        <span><B>已订货数量</B>:已经分仓的订单，但是仓库还没有出库，所以没有反馈到仓库库存数量</span>
			        </template>
			   </Alert>
	          </Col>
	        </Row>
        </Form>
        <div slot="footer">
          <Button type="text" size="large" @click="medicineInfoModalCancel">取消</Button>
          <Button type="primary" size="large" @click="saveOrderMedicineInfo">确定</Button>
      	</div>
      </Modal>



      <Modal
        title="订单药品信息"
        v-model="viewMedicineInfo"
        :mask-closable="false"
        :loading="true"
        width="980px">
        <Form :model="formMedicine" label-position="top">
		    <Row :gutter="10">   
	          <Col span="24">
	          	<FormItem label="云仓药品(药品名称 - 规格 - 批准文号 - 单位 - 剂型 - 生产厂家 - 批号)" prop="lableValue">
		            <Select v-model="formMedicine.lableValue"  @on-change="getMedicineStock" label-in-value placeholder="请选择云仓药品" :filterable="true">
		              <Option v-for="item in orderMedicineList" :key="item.lableValue" :value="item.lableValue">{{item.lableValue}}</Option>
		            </Select>
		         </FormItem>	
		    </Col>			
			<Col span="24">
		         <Alert type="error" v-if="ordernumberLtZero" show-icon>各个仓库批号配送数量之和必须为大于零</Alert>
				 <Alert type="warning" v-for="msg in warningmessage" show-icon>{{msg}}</Alert>
		      	 <Table border :columns="stockList" :data="stockListData" v-show="showStock"></Table>
		    </Col>  
		    <Col span="24" v-if="showStock"  style="text-align:right;margin:3px">
		      	 <font style="font-size:125%;"><B>小计</B></font>:&nbsp;&nbsp;
		      	 总配送数量&nbsp;:&nbsp;<B>{{orderNumber}}</B>&nbsp;&nbsp;,&nbsp;&nbsp;
		      	 单价&nbsp;:&nbsp;<InputNumber :min="0.01" :step="0.02" v-model="formMedicine.medicinePrice" :precision="2" placeholder="请输入销售单价" style="width:70px"></InputNumber>&nbsp;&nbsp;,&nbsp;&nbsp;
		      	 药品总价&nbsp;:&nbsp;<B>{{orderAUM}}</B>
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
          <Button type="text" size="large" @click="medicineInfoModalCancel2">取消</Button>
          <Button type="primary" size="large" @click="saveViewOrderMedicineInfo">确定</Button>
      	</div>
      </Modal>
    
		<Modal
	        v-model="delOrderMedicine"
	        title="提示信息"
	        @on-ok="doDelOrderMedicineInfo">
	        <p style="font-size:15px">您确定要从订单中删除此药品信息<br/>(<span style="font-size:14px">{{delMedicine}}</span>)吗？</p>
		</Modal>


    	<Modal
        v-model="showConfirmInfo"
        title="提示信息"
        @on-ok="doOrderConfirm">
        <p style="font-size:15px">您确定要提交此订单吗？</p>
    	</Modal>
      
  </div>
</template>
<script>
  import medicineexpand from './medicine-export-expand.vue';
  import areaselect from '../../components/area-select.vue';
  import swal from 'sweetalert2'

  export default {
    components: {medicineexpand,areaselect},
    computed : {
            "orderNumber" : function() {
            	let currentOrderNumber = 0;
            	if(this.stockListData.length == 0){this.ordernumberLtZero=false;return 0;}
            	else{
            		for(var i in this.stockListData){
            			currentOrderNumber += this.stockListData[i].totalNumber
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
    	const insuranceAmount = (rule, value, callback) => {
    		if(this.formOrder.insurance === 'Y'){    			
    			var reg = new RegExp("^[0-9]+(.[0-9]{0,2})?$");
	          	if (!reg.test(value) || value<=0) {
	                callback(new Error('保价金额不能为空，且为大于零的、最多为两位小数的正数'));
	            }else{callback();}
            }
            callback();
        };
    	const paymentAmountCheck = (rule, value, callback) => {
    		if(this.formOrder.collectPayment === 'Y'){    			
    			var reg = new RegExp("^[0-9]+(.[0-9]{0,2})?$");
	          	if (!reg.test(value) || value<=0) {
	                callback(new Error('代收款金额不能为空，且为大于零的、最多为两位小数的正数'));
	            }else{callback();}
            }
            callback();
        };
        const areaSelectCheck = (rule, value, callback) => {
    		if(this.formOrder.newAddress === 'N'){    			
    			callback(new Error('请选择收货地址 -- 省 / 市 / 区'));	            
            }
            callback();
        };
        const receiverAddrIdCheck = (rule, value, callback) => {
    		if(this.formOrder.newAddress === 'N' && value === ''){    			
    			callback(new Error('请选择收货地址'));
    			return false;            
            }
            callback();
        };
        const extOrderCodeChecker = (rule, value, callback) => {
          	if(this.$api.checkExtOrderCode(value)){
				callback();
          	}else{
          		callback(new Error('发货方系统订单编号已经存在'));
    			return false; 
          	}
        };
      return {
        //发货地址列表
      	reciverAddressList:[],distpicker:[],showMedicineInfo:false,orderMedicineList:[],selectedOrderMedicineList:[],
      	selectedTab:'basic',showStock:false, paymentAmountShow:false,showConfirmInfo:false,orderDetailCheckFail:false,
		delOrderMedicine:false,delMedicine:'',delMedicineCode:'',viewMedicineInfo:false, ordernumberLtZero:false,
        showDeliveryOrder:false,delDeliveryOrderInfo:false,warningmessage:[],
      	label: (h) => {  return h('div', [  h('span', ' 订单药品详情  '),  h('Badge', {  props: { 'count': this.medicineListData.length} })  ]) }, 

      	formMedicine:{medicineCode:'',medicineName:'',licenseCode:'',medicineSpec:'',totalNumber:'',medicineFactory:'',medicineUnit:'',medicinePackages:'',medicineBarCode:'',medicineShape:'' , lableValue:'',medicinePrice:0,totalAUM:'',batchNo:'',medicineShape:''}, 
		
		formOrder:{extOrderCode:'',orderSource:'usr',customerCode:'',senderName:'',senderMobile:'', senderPerson:'',
			remarks:'',insurance:'N',insuranceAmount:'0',collectPayment:'N',paymentAmount:'0', newAddress:'N',receiverAddrId:'',
			receiverName:'',receiverPerson:'',receiverMobile:'',receiverPostcode:'',
			receiverAddress:'',receiverDistrict:'',receiverCity:'',receiverProvince:'',	cancelledStatus:'N',	
			details : [ ]
		},
        ruleValidate1: {
          extOrderCode: [
            {required: true, message: '订单编号不能为空', trigger: 'blur'},
            {type:'string', max: 50, message: '订单编号必须少于50个字符', trigger: 'blur'},
            {validator:extOrderCodeChecker,trigger:'blur'}
          ],
          senderName: [
            { required: true, message: '发货方名称不能为空', trigger: 'blur' },
            { type: 'string', max: 200, message: '发货方名称必须少于200个字符', trigger: 'blur'}
          ],
          senderMobile: [
            { required: true, message: '发货方联系电话不能为空', trigger: 'blur' },
            { type: 'string', max: 50, message: '发货方联系电话必须少于50个字符', trigger: 'blur'}
          ],
          senderPerson: [
            { required: true, message: '发货方联系人不能为空', trigger: 'blur' },
            { type: 'string', max: 50, message: '发货方联系人必须少于50个字符', trigger: 'blur'}
          ],
          paymentAmount: [{validator:paymentAmountCheck,trigger:'blur'}],
          insuranceAmount: [{validator:insuranceAmount,trigger:'blur'}],
          remarks: [{ type:'string',max:400,message:'备注必须少于400个字符',trigger:'blur'}]
        },        
        ruleValidate2: {
          receiverName: [
            { required: true, message: '收货方名称不能为空', trigger: 'blur'},
            { type: 'string', max: 200, message: '收货方名称必须少于200个字符', trigger: 'blur'}
          ],
          areaSelectProp:[{validator:areaSelectCheck,trigger:'blur'}],
          receiverPerson: [
            { required: true, message: '联系人不能为空', trigger: 'blur'},
            { type: 'string', max: 50, message: '联系人必须少于50个字符', trigger: 'blur'}
          ],
          receiverMobile: [
            { required: true, message: '联系电话不能为空', trigger: 'blur' },
            { type: 'string', max: 50, message: '联系电话必须少于50个字符', trigger: 'blur'}
          ],
          receiverAddress: [
            { required: true, message: '收货地址 -- 街区地址不能为空', trigger: 'blur'},
            { type: 'string', max: 200, message: '收货地址 -- 街区地址必须少于200个字符', trigger: 'blur'}
          ],
          receiverPostcode:[{type:'string',max:10,message:'邮编必须少于10个字符',trigger:'blur'}],
          receiverAddrId:[{validator:receiverAddrIdCheck,trigger:'blur'}]
        },
        ruleValidateOfFormMedicine:{
        	lableValue:[{required: true, message: '请选择云仓药品', trigger:'blur'}]
        },
        medicineList: [
          {type: 'expand', width: 30, render: (h, params) => { 
          return h( medicineexpand, {props: { row: params.row }, on: { resultChange: ( actionAndData ) => { 
          	if(actionAndData && actionAndData.action == "edit"){
          		this.editDeliveryOrder(actionAndData.data) 
          	}else if(actionAndData && actionAndData.action == "del"){
          		this.delDeliveryOrder(actionAndData.data) 
          	}          
          } }})} },
          {title: '药品编码 - 药品名称 - 规格 - 批准文号 - 单位 - 剂型 - 生产厂家', key: 'medicineCode', align: 'center', width:'50%',render: (h, params) => {
          	return params.row.medicineCode+" - "+params.row.medicineName+" - "+params.row.medicineSpec+" - "+
          	params.row.licenseCode+" - "+params.row.medicineUnit+" - "+params.row.medicineShape+" - "+params.row.medicineFactory;
          } },
          {title: '批号', key: 'batchNo',  align: 'center'} ,
          {title: '单价', key: 'medicinePrice',  align: 'center'} ,
          {title: '数量', key: 'totalNumber',  align: 'center'} ,
          {title: '总价', key: 'totalAUM',  align: 'center'} ,  
          {title: '操作', key: 'action', width: 130, align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', { props: {  type: 'primary', size: 'small' }, style: { marginRight: '5px' },
                  on: { click: () => { this.viewOrderMedicine(params.row) } } }, '修改'),
                h('Button', { props: { type: 'error', size: 'small' },
                  on: { click: () => { this.delOrderMedicineInfo(params.row) } } }, '删除')
              ]);
            }
          }
        ],
        medicineListData: [],        
        stockList: [
          {title: '云仓编号', key: 'warehouseCode',width: 110, align: 'center' },
          {title: '云仓名称', key: 'warehouseName', align: 'center' ,width: 140},
          {title: '批号', key: 'batchNo', align: 'center' },
          {title: '仓库库存',key: 'wmsStockNumber',align: 'center'},
          {title: '已订数量', key: 'bookedTotalNumber',  align: 'center'},
          {title: '参考药品单价', key: 'medicinePrice',  align: 'center'},
          {title: '配送数量', key: 'totalNumber', align: 'center',
            render: (h, params) => {
              return h('div', [h('Input',
                   { props: {type:'text',value:this.stockListData[params.index].totalNumber,number:true },
                on:{'on-blur':(event) => {
                	event.target.value = event.target.value.replace(/[^\d.]/g,"");
                	if(event.target.value == '')event.target.value=0
					
					var totalNumber = this.stockListData[params.index].wmsStockNumber*1
					var inputTotalNumber = event.target.value*1;
                	var bookedTotalNumber = this.stockListData[params.index].bookedTotalNumber*1
               		this.stockListData[params.index].totalNumber = inputTotalNumber;
               		let message = this.stockListData[params.index].warehouseName+" - "
               			/**+this.stockListData[params.index].medicine**/+" 配送数量和已订数量之和大于仓库库存,请确认配送数量";
               		if(totalNumber < (inputTotalNumber+bookedTotalNumber)){
               			this.warningmessage.pop(message)
               			this.warningmessage.push(message)
               		}else{
               			this.warningmessage.pop(message)
               		}
               		}
               		,'on-focus':()=>{
               			if(event.target.value == '0')event.target.value=""
               		}
               	} })]);
            }
          }
        ],stockListData: []
      }
    },
    methods: {
    	receiverAddressChanged(selectedKey){
    		
    	},
    	collectPaymentChanged(selectedKey){//选择不代收后，恢复代收金额为零， 去掉校验失败的效果
    		if(this.formOrder.collectPayment === 'N') {
    			this.formOrder.paymentAmount = '0'
    			this.$refs['formOrder1'].validateField('paymentAmount');
    		}
    	},
    	tabsClickFunc(tabIndex){this.selectedTab = tabIndex},
      	medicineInfoModalCancel(){this.showMedicineInfo = false;this.$refs['formMedicine'].resetFields();this.stockListData = [];this.warningmessage = [];this.orderpriceNotValid = []},
      	medicineInfoModalCancel2(){this.viewMedicineInfo=false;this.stockListData = [];this.warningmessage = [];this.orderpriceNotValid = []},
	  	clearStock(){ this.showStock = false;},
	  	clearFormMedicine(){	    
	  		this.formMedicine={medicineCode:'',medicineName:'',licenseCode:'',medicineSpec:'',totalNumber:'',medicineFactory:'',medicineUnit:'',medicinePackages:'',medicineBarCode:'',medicineShape:'',medicinePrice:0,totalAUM:'',batchNo:'',medicineShape:''}
	  	},
	  	getMedicineInfo(record){
	  		return record.medicineName +" - "+ record.medicineSpec+" - "+ record.licenseCode+" - "
			       +record.medicineUnit+" - "+record.medicineShape+" - "+ record.medicineFactory + " - " + record.batchNo
	  	},
      	addOrderMedicine(){
      		this.ordernumberLtZero=false
      		this.warningmessage = [];
      		this.orderpriceNotValid = []
      	    this.clearFormMedicine()
      		this.orderMedicineList = [] ;
      		let recordMedicineList = [];      		
      		this.$api.getAllMedicineList().then(
				response => {
					if(response.status == "S"){
						this.orderMedicineList = [];
			            for(let index in response.result){
			            	let record = response.result[index]
			            	let isAlreadyDone = false;
			            	let lableValue = this.getMedicineInfo(record);
			            	//按照labelkey显示 ， 重复的不显示
			            	let duplicateCheck = false;
			            	for(var ii in recordMedicineList){
			            		if(recordMedicineList[ii] == lableValue){
			            			duplicateCheck = true;
			            			break;
			            		}
			            	}
			            	if(duplicateCheck)continue;
			            	recordMedicineList.push(lableValue);  	
			            	//已经选过的药品不显示
			            	for(var index in this.medicineListData){
			            		var ele = this.medicineListData[index];
			            		if(lableValue == this.getMedicineInfo(ele)){ 
			            			isAlreadyDone = true;
			            			break;
			            		}
			            	}
			            	if(!isAlreadyDone){
				            	record.lableValue = lableValue
				              	this.orderMedicineList.push(record);
			              	}
			            }
					}else{
			            swal('获取药品信息列表失败，请刷新重试', res.message, 'error');
			        }
			})
	      	this.showMedicineInfo = true;
	      	//取消药品库存列表的显示
	      	this.showStock = false;
	      	//清空使用云仓药品编码或者自有编码
	      	this.clearStock();
	      	this.clearFormMedicine();
	    },
	    viewOrderMedicine(row){
	    	this.warningmessage = [];
	    	this.orderpriceNotValid = []
	        this.clearFormMedicine();
	      	this.viewMedicineInfo = true;
	      	this.formMedicine.medicineCode = row.medicineCode;
	      	this.formMedicine.medicineName = row.medicineName;
	      	this.formMedicine.medicineSpec = row.medicineSpec;
	      	this.formMedicine.licenseCode = row.licenseCode;
	      	this.formMedicine.medicineFactory = row.medicineFactory;
	      	this.formMedicine.medicineUnit = row.medicineUnit;
	      	this.formMedicine.medicinePackages = row.medicinePackages;
	      	this.formMedicine.medicineBarCode = row.medicineBarCode;
	      	this.formMedicine.medicineShape = row.medicineShape;
	      	this.formMedicine.batchNo = row.batchNo;
	      	this.formMedicine.medicinePrice = row.medicinePrice;
            this.formMedicine.lableValue = this.getMedicineInfo(row)

	      	this.selectedOrderMedicineList.push(this.formMedicine)
	      	this.stockListData = [];
      		this.$api.searchMedicineStock({showLoading:'Y',
      			medicineCode:this.formMedicine.medicineCode,
	      		medicineName:this.formMedicine.medicineName,
	      		medicineSpec:this.formMedicine.medicineSpec,
	      		licenseCode:this.formMedicine.licenseCode,batchNo:this.formMedicine.batchNo,
	      		medicineFactory:this.formMedicine.medicineFactory}).then(
				response => {
					if(response.status == "S"){					
			            for(let record of response.result){
			            	record.medicine = this.getMedicineInfo(record)
			            	record.totalNumber = 0
			            	if(row.deliveryList){
			            		for(let i in row.deliveryList){
			            			if(row.deliveryList[i].warehouseCode == record.warehouseCode){
			            				record.totalNumber = row.deliveryList[i].deliveryTotalNumber
			            			}
			            		}
			            	}
			                this.stockListData.push(record)
			            }
					}else{
			            swal('获取药品库存信息列表失败，请刷新重试', res.message, 'error');
			        }
				}
			)
	    },
	    getMedicineStock(selectedAndValue){
	    	if(!this.showMedicineInfo)return;
	      	if( selectedAndValue.value == '' ){
				this.showStock = false;
				return;
	      	}
	      	this.$refs['formMedicine'].resetFields();

	      	for(var i in this.orderMedicineList){
	      		var option = this.orderMedicineList[i];
	      		var key = this.getMedicineInfo(option)
	      		if(key == selectedAndValue.value){
	      			this.formMedicine.medicineCode = option.medicineCode;
			      	this.formMedicine.medicineName = option.medicineName;
			      	this.formMedicine.medicineSpec = option.medicineSpec;
			      	this.formMedicine.medicineUnit = option.medicineUnit;
			      	this.formMedicine.licenseCode = option.licenseCode;
			      	this.formMedicine.medicineFactory = option.medicineFactory;
			      	this.formMedicine.medicineBarCode = option.medicineBarCode;			      	
			      	this.formMedicine.medicinePackages = option.medicinePackages;
			      	this.formMedicine.medicineShape = option.medicineShape;
			      	this.formMedicine.batchNo = option.batchNo;
			      	this.formMedicine.lableValue = option.lableValue
			      	break;
	      		}
	      	}      	
	      	this.stockListData = [];	      	
	      	this.$api.searchMedicineStock({showLoading:'Y',
	      		medicineName:this.formMedicine.medicineName,medicineSpec:this.formMedicine.medicineSpec,
	      		licenseCode:this.formMedicine.licenseCode,medicineFactory:this.formMedicine.medicineFactory,
	      		batchNo:this.formMedicine.batchNo}).then(
				response => {
					if(response.status == "S"){
						this.showStock = true
						let medicinePrice = 0.0;
			            for(let record of response.result){
			            	record.totalNumber = 0
			            	if(record.medicinePrice*1 > medicinePrice*1){
			            		medicinePrice = record.medicinePrice;
			            	}         
			            }
			            this.formMedicine.medicinePrice = 	medicinePrice   
			            this.stockListData = response.result
					}else{
			            swal('获取药品库存信息列表失败，请刷新重试', res.message, 'error');
			        }
				}
			)
	    },

        saveOrderMedicineInfo(){
        	let validResult = false
        	if(this.showMedicineInfo){//新增页面打开->标识当前是新增状态
		      	this.$refs['formMedicine'].validate((valid) => {validResult = valid;});
		      	if(!validResult)return false;
	      	}else{
				validResult = true;
	      	}
	      	let orNumber = 0;
			for(var i in this.stockListData){
				var row = this.stockListData[i];
	      		orNumber += row.totalNumber*1;
			} 
			if(!orNumber>0){
				this.ordernumberLtZero = true;
				validResult = false;
			}else{
				this.ordernumberLtZero = false
			}
			

			if(!validResult)return false;
	        var medicineinfo = { 
		          medicineCode:this.formMedicine.medicineCode,
		          medicineName:this.formMedicine.medicineName , 
		          medicineSpec:this.formMedicine.medicineSpec,
		          totalNumber:this.formMedicine.totalNumber,
		          totalAUM:this.formMedicine.totalAUM,
		          licenseCode:this.formMedicine.licenseCode,
		          medicineUnit:this.formMedicine.medicineUnit,
		          medicineBarCode:this.formMedicine.medicineBarCode,
		          medicinePackages:this.formMedicine.medicinePackages,
		          medicineFactory:this.formMedicine.medicineFactory,
		          medicinePrice:this.formMedicine.medicinePrice,
		          medicineShape:this.formMedicine.medicineShape,
		          batchNo:this.formMedicine.batchNo,
		          deliveryList:[]
	        }
			let totalNumber = 0 , totalAUM = 0.00;
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
				        medicineShape:row.medicineShape,
				        medicineUnit:row.medicineUnit,
				        medicineBarCode:row.medicineBarCode,
				        medicinePackages:row.medicinePackages,
				        medicineFactory:row.medicineFactory
	      			}	      			
					totalNumber += row.totalNumber*1;
					totalAUM += row.totalNumber*1*medicineinfo.medicinePrice
	      			medicineinfo.deliveryList.push(data);
	      		}
	      	}
			medicineinfo.totalNumber = totalNumber;
			medicineinfo.totalAUM = new Number(totalAUM).toFixed(2);
			if(this.showMedicineInfo){
				this.showMedicineInfo = false;				
			}else{
				this.viewMedicineInfo = false;
				for(var index  in this.medicineListData){
					if( this.medicineListData[index].medicineCode == medicineinfo.medicineCode){
						this.medicineListData.pop(this.medicineListData[index]);
						break;
					}
				}
			}
			this.medicineListData.push(medicineinfo);
			this.orderDetailCheckFail = false;
			this.clearFormMedicine();
			this.stockListData = [];
			this.warningmessage = [];		
        },
        saveViewOrderMedicineInfo(){
	        this.saveOrderMedicineInfo()
        },
     
        delOrderMedicineInfo(row){
      		this.delOrderMedicine = true;
      		this.delMedicine = row.medicineCode+" - "+row.medicineName+" - "
      		+row.medicineSpec+" - "+row.medicineUnit+" - "+row.licenseCode+" - "+row.medicineFactory
      		this.delMedicineCode = row.medicineCode
        },
      
        doDelOrderMedicineInfo(){
        	for(let index in this.medicineListData){
        		let row = this.medicineListData[index]
        		let delmmm = row.medicineCode+" - "+row.medicineName+" - "
      		+row.medicineSpec+" - "+row.medicineUnit+" - "+row.licenseCode+" - "+row.medicineFactory;
      			if(this.delMedicine == delmmm){
					this.medicineListData.splice(index,1);
					this.delMedicine = "";
					break;
				}
        	}        	
        },
	    
		confirmOrder(){

			let formorder1ValidationResult = true , formorder2ValidationResult = true,
				formorder3ValidationResult = true;
	      	this.$refs['formOrder1'].validate( (valid) => {
	              if (!valid) {formorder1ValidationResult = false;
	                  this.selectedTab = 'basic'
	                  this.$Message.error('订单基本信息填写错误');
	                  return
	        }});
	        if(formorder1ValidationResult){
	        	if(this.formOrder.newAddress === 'Y'){
			        this.$refs['formOrder2'].validate( (valid) => {
			              if (!valid) {formorder2ValidationResult = false;
			                  this.selectedTab = 'address'
			                  this.$Message.error('订单地址(收货)详情填写错误');
			                  return
			        } })
			    }else{
			    	this.$refs['formOrder2'].validateField('receiverAddrId');
			    	if(this.formOrder.newAddress === 'N' && this.formOrder.receiverAddrId === ''){
			    		this.selectedTab = 'address';
			    		this.$Message.error('订单地址(收货)详情填写错误');
			    		formorder2ValidationResult = false;
			    	}
			    }
			}
			if(formorder1ValidationResult&&formorder2ValidationResult){
				if(this.medicineListData.length == 0){
					this.orderDetailCheckFail = true;
					this.$Message.error('订单药品详情填写错误');
					this.selectedTab = 'order';
					formorder3ValidationResult = false;
				}
			}
			if(formorder1ValidationResult && formorder2ValidationResult&&formorder3ValidationResult){
				this.showConfirmInfo = true;
			}
	    },
	    doOrderConfirm(){
	    	//订单状态
	    	this.formOrder.status = "02";//已确定并且分仓，待仓库配货
	    	//配送地址信息
	    	if(this.formOrder.newAddress === 'N'){ 
				for(var index in this.reciverAddressList){
	    			let addr = this.reciverAddressList[index];
	    			if(addr.addrId == this.formOrder.receiverAddrId){
	    				this.formOrder.receiverName = addr.addrName;
	    				this.formOrder.receiverPerson = addr.contactPerson;
	    				this.formOrder.receiverMobile = addr.contactMobile;
	    				this.formOrder.receiverPostcode = addr.postcode;
	    				this.formOrder.receiverAddress = addr.address;
	    				this.formOrder.receiverDistrict = addr.district;
	    				this.formOrder.receiverCity = addr.city;
	    				this.formOrder.receiverProvince = addr.province;
	    				break;
	    			}
	    		}
    		}else{
    			this.formOrder.receiverProvince = this.distpicker[0]
		        this.formOrder.receiverCity = this.distpicker[1]
		        this.formOrder.receiverDistrict = this.distpicker[2]
    		}
    		//订单详情
    		this.formOrder.details = this.medicineListData;


			this.$api.doOrderSave(this.formOrder).then(
				response => {
					if(response.status == "S"){
						swal({text: '订单提交成功!',type: 'success',showCancelButton: false,width:300}).then((isConfirm)=>{
							this.$router.push('/order/orderList')
						});
					}else{
			            swal('操作失败', response.message, 'error');
			        }
				}
			)

	    }
	},
    
    created(){
		this.$Message.config({ top:100,  duration:2 });
    	let orderId = this.$route.query.orderId
    	
    	if(!orderId){//新增    		
			this.$api.getBizProfile().then(
				response => {
					if(response.status == "S"){
						//if(response.result.isSystem != "Y"){
							this.formOrder.customerCode = response.result.customer.customerCode
							this.formOrder.senderName = response.result.customer.customerName
							this.formOrder.senderPerson = response.result.customer.customerPerson
							this.formOrder.senderMobile = response.result.customer.customerPhone

							if(response.result.member){
								this.formOrder.senderPerson = response.result.member.memberName
								this.formOrder.senderMobile = response.result.member.memberPhone
							}

						//}
					}else{
			            swal('获取发货人基本信息失败，请刷新重试', res.message, 'error');
			        }
				}
			)
    	}else{//查看

    		//this.$api.prepareNewOrder();
    	}
		//获取发货地址列表
      	this.$api.doReceiverAddressList({showLoading:"N"}).then(res => {
	          if(res.status == "S"){
	            this.reciverAddressList = [];
	            for(let record of res.result){
	            	record.lableValue = record.addrName +" - "+ record.contactPerson+" - "
	            		+ record.contactPhone+" - "+record.address+" - "+record.postcode
	              this.reciverAddressList.push(record)
	            }
	          }else{
	            swal('获取发货地址列表失败', res.message, 'error');
	          }
	    })
    }
  }
</script>
