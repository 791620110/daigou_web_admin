<template>
  <div>
    <Breadcrumb>
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>运单管理</BreadcrumbItem>
      <BreadcrumbItem>通知取件</BreadcrumbItem>
    </Breadcrumb>
    <h3 class="box-title" slot="header" style="width: 100%; padding-top: 10px;">
    	<Form :model="formWaybillSearch" :label-width="100" style="margin-top: 20px" ref="formWaybillSearch">
        <Row>
          <Col span="20">
          <Col span="8">
          <FormItem label="运单编号">
            <Input v-model="formWaybillSearch.deliveryId" placeholder="请输入运单编号"></Input>
          </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="物流公司" >
              <Select v-model="formWaybillSearch.vendor" >
                <Option value="jingdong">京东快递</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="出库单编号">
            <Input v-model="formWaybillSearch.invoiceCode" placeholder="请输入出库单编号"></Input>
          </FormItem>
          </Col>
          </Col>
          <Col span="4">
          <Button type="ghost" style="float:right;margin:4px;" @click="doSearchReset('formWaybillSearch')">重置</Button>
          <Button type="primary" style="float:right;margin:4px;" @click="doSearch()">查询</Button>
          </Col>
        </Row>
        <Row>
          <Col span="20">
          <Col span="16">
          <FormItem label="下单日期">
            <DatePicker v-model="formWaybillSearch.startDate" type="date" placeholder="开始日期"  style="width:135px"></DatePicker>
            ~
            <DatePicker v-model="formWaybillSearch.endDate" type="date" placeholder="结束日期"  style="width:135px"></DatePicker>
          </FormItem>
          </Col>
          </Col>
        </Row>
      </Form>
    </h3>
    <div slot="body">
      <!--Table border ref="selection" :columns="memberList" :data="userData"
             @on-select="selectOneItem"
             @on-select-change="selectionChange"
             @on-select-all="selectAllItems"></Table-->
      <edit-table :columns-list="memberList" v-model="waybillList" :sendNotice="sendNotice"></edit-table>
      <Page :total="total" :page-size="pageSize" size="small"  show-elevator show-sizer show-total style="float: right;margin-top: 10px" @on-change="doPageChange"></Page>
      <Modal
        v-model="sendPickupOrder"
        title="取件描述"
        :mask-closable="false"
        :loading="true"
        width="460px">
        <Form :model="formPickupSend" label-position="top" ref="formPickupSend" :rules="ruleValidate">
         <Row :gutter="10">
            <Col span="26">
            <FormItem label="取件联系人" prop="pickupContact">
    		  <Select v-model="formPickupSend.pickupContact" style="width:180px;">
        		<Option v-for="item in pickupList" :value="item.pickupId" :key="item.pickupName">{{ item.pickupName }}</Option>
      		  </Select>
            </FormItem>
            </Col>
          </Row>
         <Row :gutter="10">
            <Col span="26">
            <FormItem label="取件描述" prop="pickupDesc">
              <Input type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入取件描述" v-model="formPickupSend.pickupDesc" :rules="ruleValidate"></Input>
            </FormItem>
            </Col>
          </Row>
        </Form>
        <div slot="footer">
          <Button type="text" size="large" @click="modalCancel">取消</Button>
          <Button type="primary" size="large" @click="doSendNotice('formPickupSend')">确定</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
  import Vue from "vue";
  import panel from "../../components/panel.vue"
  import * as api from "../../api/index"
  import apiConfig from "../../api/apiConfig.js"
  import swal from 'sweetalert2'
  import editTable from './editTable-SentOut.vue'
  import waybillExpand from './waybill-expand.vue';

  export default {
  	props: {
            row: Object
        },
    components: {
      editTable,
      'imp-panel': panel,
      waybillExpand
    },
    data(){
      const pickupContactCheck = (rule, value, callback) => {
    		if(this.formPickupSend.pickupContact === ''){    			
    			callback(new Error('请选择取件联系人'));
    			return false;            
            }
            callback();
        };
      return {
        formWaybillSearch:{deliveryId:'',invoiceCode:'',vendor:'jingdong',status:'02',startDate:'',endDate:''},
        total:0, pageSize:10, initStartIndex:0, initEndIndex:10,
        sendPickupOrder: false,
        formPickupSend: {pickupDesc: '', pickupContact: ''},
		memberList: [
		  {
			type: 'expand',
			title: '',
			width: 65,
			align: 'center',
			render: (h, params) => {
				return h(waybillExpand, {
					props: {
						row: params.row
					}
				})
			}
          },
          {title: '运单编号',key: 'waybillCode',align: 'center'},
          {title: '物流公司',key: 'vendorLabel',align: 'center'},
          {title: '出库单编号',key: 'wmsStockoutCode',align: 'center'},
          {title: '运单生成日期',key: 'orderSendTime',align: 'center', width: 150},
          {title: '收货人',key: 'receiveName',align: 'center'},
          {title: '包裹数量',key: 'packageCount',align: 'center', editable: true},
          {title: '操作',key: 'handle', width: 120, align: 'center', handle: ['edit', 'delete', 'send']
          },
        ],
        waybillList: [],
        pickupList: [],
        ruleValidate: {
          pickupContact:[{validator:pickupContactCheck,trigger:'blur'}],
          pickupDesc: [
            { required: true, message: '请填写取件描述', trigger: 'blur' },
            { type: 'string', max: 380, message: '取件描述不能多于400个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      doPageChange(pagenumber){
		let startIdx = ( pagenumber - 1 ) * this.pageSize;
		let endIdx = pagenumber * this.pageSize;
		this.doWaybillList(startIdx,endIdx);
	  },
      loadData(){
      	this.getPickupList();
        this.doWaybillList(this.initStartIndex,this.initEndIndex);
      },
      getPickupList(){
		let params = {
			startIndex:0,
			endIndex:99999
		}
		this.$api.getPickupList(params).then(res => {
			if(res.status == "S"){
			  this.pickupList = [];
			  for(let record of res.result){
				this.pickupList.push(record);
			  }
			}else{
			  swal({text: '获取取件单失败',type: 'error',showCancelButton: false,width:300});
			}
		})
      },
      doSearch(target){
        this.loadData();
      },
      doSearchReset(){
		for(let field in this.formWaybillSearch){
			if(field =='vendor'){
                this.formWaybillSearch.vendor='jingdong'
            }else{
                this.formWaybillSearch[field] = '';
            }
		}
		var now = new Date() , nowTime = now.getTime() ,day = now.getDay();
		var oneDayTime = 24*60*60*1000 ; 
		var MondayTime = nowTime - (day-1)*oneDayTime ; 
		var SundayTime =  nowTime + (7-day)*oneDayTime ;

		this.formWaybillSearch.startDate = new Date(MondayTime)
		this.formWaybillSearch.endDate = new Date(SundayTime)
	  },
      doWaybillList(startIndex,endIndex){
		let lStartIndex = startIndex,lEndIndex = endIndex;
			let params = {
			  startIndex:lStartIndex,
                  endIndex:lEndIndex,
                  startDate:this.formWaybillSearch.startDate==''?'':this.formWaybillSearch.startDate.getTime(),
                  endDate:this.formWaybillSearch.endDate==''?'':this.formWaybillSearch.endDate.getTime(),
                  status:'02',
                  waybillCode:this.formWaybillSearch.deliveryId,
                  vendor:this.formWaybillSearch.vendor,
                  invoiceCode:this.formWaybillSearch.invoiceCode
			}
			this.$api.doWaybillList(params).then(res => {
			if(res.status == "S"){
			  this.total = res.result.total;
			  this.waybillList = [];
			  for(let record of res.result.records){
			  	if(record){
			  		if("jingdong"==record.vendor){
                	  	record.vendorLabel = "京东物流";
                	}
                }
				this.waybillList.push(record);
			  }
			}else{
			  swal({text: '获取运单列表失败',type: 'error',showCancelButton: false,width:300});
			}
		})
      },
      selectAllItems(items){
//        for(let i = 0; i < this.userData.length; i++){
//          if(!this.totalSelections.includes(this.userData[i].userId)){
//            this.totalSelections.push(this.userData[i].userId);
//          }
//        }
//        console.log(this.totalSelections);
      },
      selectOneItem(selection){
//        if(!this.totalSelections.includes(selection[0].userId)){
//          this.totalSelections.push(selection[0].userId);
//        }
//        console.log(this.totalSelections);
      },
      doEditSave(index){
        console.log('edit row -- ' + index);
      },
      sendNotice(index){
        this.$refs['formPickupSend'].resetFields();
      	this.waybillCode = this.waybillList[index].waybillCode;
      	this.vendor = this.waybillList[index].vendor;
      	this.sendPickupOrder = true;
      },
      modalCancel(){
      	this.sendPickupOrder = false;
      },
      doSendNotice(name){
      	this.$refs[name].validate((valid) => {
			if (valid) {
				let params = {
				pickupId:this.formPickupSend.pickupContact,
				waybillCode:this.waybillCode,
				vendor:this.vendor,
				desc:this.formPickupSend.pickupDesc
				}
				this.$api.doPickupOrder(params).then(res => {
					if(res.status == "S"){
					  this.sendPickupOrder = false;
					  swal({text: '操作成功!',type: 'success',showCancelButton: false,width:300}).then((isConfirm)=>{this.loadData();});
					}else{
					  swal({text: '操作失败',type: 'error',showCancelButton: false,width:300});
					}
				})
			}
		})
      }
    },
    //init page data
    created(){
      this.doSearchReset();
      this.loadData();
    }
  }
</script>
<style>
  .el-pagination {
    float: right;
    margin-top: 15px;
  }
</style>
