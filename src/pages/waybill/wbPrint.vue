<style>
    .ivu-table .demo-table-info-row td{
        background-color: #2db7f5;
        color: #fff;
    }
    .ivu-table .demo-table-error-row td{
        background-color: #ff6600;
        color: #fff;
    }
    .ivu-table td.demo-table-info-column{
        background-color: #187;
        color: #fff;
    }
    .ivu-table .demo-table-info-cell-name {
        background-color: #2db7f5;
        color: #fff;
    }
    .ivu-table .demo-table-info-cell-age {
        background-color: #ff6600;
        color: #fff;
    }
    .ivu-table .demo-table-info-cell-address {
        background-color: #187;
        color: #fff;
    }
</style>
<template>
 <div>
    <Breadcrumb>
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>运单管理</BreadcrumbItem>
      <BreadcrumbItem>打印面单</BreadcrumbItem>
    </Breadcrumb>
    <h3 class="box-title" slot="header" style="width: 100%;">
    <Form :model="formPrintSearch" :label-width="100" style="margin-top: 20px" ref="formPrintSearch">
 		   <Row>
          <Col span="20">
            <Col span="8">
              <FormItem label="运单编号">
                <Input v-model="formPrintSearch.waybillCode" placeholder="请输入运单编号"></Input>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="物流公司" >
                <Select v-model="formPrintSearch.vendor" >
                  <Option value="jingdong">京东快递</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="出库单编号">
                <Input v-model="formPrintSearch.invoiceCode" placeholder="请输入出库单编号"></Input>
              </FormItem>
          </Col>
          </Col>
          <Col span="4">
          <Button type="ghost" style="float:right;margin:4px;" @click="doSearchReset('formPrintSearch')">重置</Button>
          <Button type="primary" style="float:right;margin:4px;" @click="doSearch()">查询</Button>
          </Col>
        </Row>
        <Row>
          <Col span="20">
          <Col span="8">
            <FormItem label="打印状态">
            <RadioGroup style="" v-model="formPrintSearch.status" @on-change="printSwitch()">
        		<Radio value="true" label="待打印"></Radio>
        		<Radio label="已打印"></Radio>
    		    </RadioGroup>
            </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="下单日期">
            <DatePicker v-model="formPrintSearch.startDate" type="date" placeholder="开始日期"   style="width:135px"></DatePicker>
            ~
            <DatePicker v-model="formPrintSearch.endDate" format="yyyy-MM-dd" type="date" placeholder="开始日期"   style="width:135px"></DatePicker>
          </FormItem>
          </Col>
          </Col>
          
        </Row>
      </Form>

    </h3>
   <div class="edittable-table-height-con">
    <can-edit-table border ref="table" :columns-list="columns10" v-model="toPrintList" :saveEdit="saveEdit" :generationPDF="generationPDF"></can-edit-table>
   </div>
   <Page :total="total" :page-size="pageSize" size="small"  show-elevator show-sizer show-total style="float: right;margin-top: 10px" @on-change="doPageChange"></Page>
     <Modal v-model="generModal" width="460">
       <p slot="header" style="color:#f60;text-align:left">
         <Icon type="information-circled"></Icon>
         <span>提示信息</span>
       </p>
       <div style="padding-left:1px">
         <!--label class="ivu-btn ivu-btn-primary ivu-btn-large" for="xFile">请选择电子面单保存目录</label>
		 <input type="file" id="xFile" webkitdirectory directory style="position:absolute;clip:rect(0 0 0 0);">
		 <Input v-model="saveDirectory" placeholder="请输入文件保存目录"></Input-->
		 <span>请确认包裹数量正确，再生成电子面单</span>
       </div>
       <div slot="footer">
          <Button type="text" size="large" @click="modalCancel">取消</Button>
          <Button type="primary" size="large" @click="doGenerationPDF">确定</Button>
        </div>
     </Modal>
    </div>
</template>

<script>
	import Vue from "vue";
    import panel from "../../components/panel.vue";
    import * as api from "../../api";
    import apiConfig from "../../api/apiConfig.js";
    import swal from 'sweetalert2';
    import wbprintExpand from './wbprint-expand.vue';
    import canEditTable from './canEditTable.vue';
    export default {
        components: { wbprintExpand, canEditTable },
        watch: {'$route': 'fetchData'},
        data () {
            return {
              lowNetSpeed: false,
              generModal: false,
              selectedRowNumber: -1,
            	formPrintSearch:{waybillCode:'',invoiceCode:'',vendor:'jingdong',status:'待打印',startDate:'',endDate:''},
            	total:0, pageSize:10, initStartIndex:0, initEndIndex:10,
                columns10: [
                    {
                        type: 'expand',
                        title: '',
                        width: 65,
                        align: 'center',
                        render: (h, params) => {
                            return h(wbprintExpand, {
                                props: {
                                    row: params.row
                                }
                            })
                        }
                    },
                    {
                        title: '运单编号',
                        key: 'waybillCode',
                        align: 'center',
                        width:150
                    },
                    {
                        title: '物流公司',
                        key: 'vendorLabel',
                        width:100,
                        align: 'center'
                    },
                    {
                        title: '出库单编号',
                        key: 'wmsStockoutCode',
                        align: 'center'
                    },
                    {
                      title: '运单生成日期',
                      key: 'orderSendTime',
                      width:150,
                      align: 'center'
                    },
                    {
                        title: '收件人',
                        key: 'receiveName',
                        align: 'center'
                    },
                    {
                        title: '包裹数',
                        key: 'packageCount',
                        align: 'center',
                        editable: true
                    },
                    {
                      title: '操作',
                      key: 'handle',
                      width: 230,
                      align: 'center',
                      handle: ['edit', 'delete']
                    }
                ],
                toPrintList: [],
            }
        },
 		methods:{
 		doSearchReset(){
          for(let field in this.formPrintSearch){
          	if(field =='status'){
          		this.formPrintSearch.status='待打印';
          	}else if(field =='vendor'){
                this.formPrintSearch.vendor='jingdong';
            }else{
            	this.formPrintSearch[field] = '';
            }
          }
          var now = new Date() , nowTime = now.getTime() ,day = now.getDay();
          var oneDayTime = 24*60*60*1000 ; 
          var MondayTime = nowTime - (day-1)*oneDayTime ; 
          var SundayTime =  nowTime + (7-day)*oneDayTime ;

          this.formPrintSearch.startDate = new Date(MondayTime)
          this.formPrintSearch.endDate = new Date(SundayTime)
        },
        doSearch(target){
            this.loadData();
        },
        loadData(){
            this.doWaybillList(this.initStartIndex,this.initEndIndex);
        },
        //change page number
        doPageChange(pagenumber){
            let startIdx = ( pagenumber - 1 ) * this.pageSize;
            let endIdx = pagenumber * this.pageSize;
            this.doWaybillList(startIdx,endIdx);
        },
        doWaybillList(startIndex,endIndex){
            let lStartIndex = startIndex,lEndIndex = endIndex;
            let params = {
              startIndex:lStartIndex,
              endIndex:lEndIndex,
              startDate:this.formPrintSearch.startDate==''?'':this.formPrintSearch.startDate.getTime(),
              endDate:this.formPrintSearch.endDate==''?'':this.formPrintSearch.endDate.getTime(),
              status:this.formPrintSearch.status=='待打印'?'01':'02',
              waybillCode:this.formPrintSearch.waybillCode,
              vendor:this.formPrintSearch.vendor,
              invoiceCode:this.formPrintSearch.invoiceCode
            }
            this.$api.doWaybillList(params).then(res => {
            if(res.status == "S"){
              this.total = res.result.total;
              this.toPrintList = [];
              for(let record of res.result.records){
                if(record){
                  if("01"==record.status){
                    record.statusLabel = "待打印";
                  }
                  if("02"==record.status){
                    record.statusLabel = "已打印";
                  }
                  if("jingdong"==record.vendor){
                	record.vendorLabel = "京东物流";
                  }
                }
                this.toPrintList.push(record);
              }
            }else{
              swal({text: '获取运单信息失败',type: 'error',showCancelButton: false,width:300});
            }
          })
        },
        show (index) {
          console.log(index.packageCount);
          this.$Modal.info({
            title: '提醒',
            content: '请确认包裹数量是否正确，如无需修改将直接生成电子面单？'
          })
        },
        saveEdit (index, success, fail, waybillCode) {
          let delay = 0;
          if (this.lowNetSpeed) {
            delay = 5000;
          }
          setTimeout(() => {
            if (this.breakConnect) {
              fail(() => {
                swal({text: '服务器嫌弃你的网络，所以保存失败,请稍后再试',type: 'error',showCancelButton: false,width:300});
              });
            } else {
              success(() => {
                let params = {
                  waybillCode:this.toPrintList[index].waybillCode,
                  packageNumber:this.toPrintList[index].packageCount,
                  vendor:this.toPrintList[index].vendor
                }
                let reg = new RegExp("^[0-9]*[1-9][0-9]*$");
                let packageNumber = this.toPrintList[index].packageCount;
				if (!reg.test(packageNumber) || packageNumber<=0) {
					swal({text: '包裹数必须大于零',type: 'error',showCancelButton: false,width:300});
				}else{
					this.$api.updatePackageNumber(params).then(res => {
                  		if(res.status == "S"){
                  			swal({text: '修改成功!',type: 'success',showCancelButton: false,width:300}).then((s)=>{this.doSearch();});
                  		}else{
                    		swal({text: '修改失败',type: 'error',showCancelButton: false,width:300});
                  		}
                	})
				}
              });
            }
          }, delay);
        },
        modalCancel(){
      	  this.generModal = false;
        },
        generationPDF (index) {
        
        	let params = {
				waybillCode:this.toPrintList[index].waybillCode,
				vendor:this.toPrintList[index].vendor
			}
			this.$api.generatePdf(params).then(res => {
				if(res.status == "S"){
					swal({text: res.message,type: 'success',showCancelButton: false,width:300}).then((isConfirm)=>{this.loadData();});
				}else{
					swal({text: res.message,type: 'error',showCancelButton: false,width:300});
				}
			})
        },
        printSwitch(){
        	this.loadData();
        }
      },
      created(){this.doSearchReset();this.loadData();}
    }
</script>

