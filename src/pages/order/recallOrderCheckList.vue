<template>
  <div>
    <Breadcrumb>
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>订单管理</BreadcrumbItem>
      <BreadcrumbItem>订单取消审核</BreadcrumbItem>
    </Breadcrumb>
    <Form :model="formSearch" :label-width="100" style="margin-top: 20px">
      <Row>
        <Col span="20">
        <Col span="8">
        <FormItem label="取消订单编号">
          <Input v-model="formSearch.extOrderCode" placeholder="请输入取消订单编号"></Input>
        </FormItem>
        </Col>
        <Col span="7">
        <FormItem label="收件方名称">
          <Input v-model="formSearch.receiverName" placeholder="请输入收件方名称"></Input>
        </FormItem>
        </Col>
        <Col span="8">
        <FormItem label="订单来源">
          <Select v-model="formSearch.orderSource" placeholder="请选择订单来源">
            <Option v-for="item in orderSourceList" :value="item.refKey" :key="item.refValue">{{ item.refValue }}</Option>
          </Select>
        </FormItem>
        </Col>
        
        </Col>
        <Col span="3">
        <Button type="ghost" style="float:right;margin-left:10px;" @click="doSearchReset()">重置</Button>
        <Button type="primary" style="float:right;" @click="search()">查询</Button>
        </Col>
        <Col span="20">
        <Col span="8">
        <FormItem label="申请状态">
          <Select v-model="formSearch.cancelledStatus" placeholder="请选择申请状态">
                <Option value="0000">全部</Option>
            	  <Option value="00">申请中</Option>
              	<Option value="01">同意取消</Option>
              	<Option value="02">拒绝取消</Option>
          </Select>
        </FormItem>
        </Col>     
        <Col span="16">
        <FormItem label="订单取消日期">
          <DatePicker type="date" placeholder="开始日期" v-model="formSearch.orderStartDate" format="yyyy-MM-dd" style="width:135px"></DatePicker>
          ~
          <DatePicker type="date" placeholder="结束日期" v-model="formSearch.orderEndDate" format="yyyy-MM-dd"  style="width:135px"></DatePicker>
        </FormItem>
        </Col>   

        </Col>
      </Row>
    </Form>
    <Table border :columns="recallOrderCheckList" :data="recallOrderCheckListData"></Table>
    <Page :total="total" ref="pager" :page-size="pageSize" size="small" show-elevator show-sizer  @on-change="doPageChange" style="float:right;margin-top: 10px"></Page>



    <Modal
      title="订单取消申请审核"
      v-model="showCancellOrderRequest"
      :mask-closable="false"
      :loading="true" width="360px" @on-cancel="cancelCheckRecallRequest()">

        <Form :model="formRecallOrderCheck" label-position="top"  ref="formRecallOrderCheck" :rules="ruleValidate">
        	<Row>
	        	<Col span="24">
			        <FormItem label="审核意见">
			          	<RadioGroup v-model="formRecallOrderCheck.checkResult" type="button" size="large">
					        <Radio style="width:130px;text-align:center" label="Y">同意取消</Radio>
					        <Radio style="width:130px;text-align:center" label="N">拒绝取消</Radio>
					    </RadioGroup>
			        </FormItem>
		        </Col>		        
	        </Row>
	        <Row>
	        	<Col span="24">
			        <FormItem label="备注"  prop="remark">
			          <Input v-model="formRecallOrderCheck.remark" type="textarea" :autosize="{minRows:8,maxRows:8}" placeholder="请输入审批备注信息"></Input>
			        </FormItem>
		        </Col>		        
	        </Row>
		</Form>
        <div slot="footer">          
          <Button type="text" size="large" @click="cancelCheckRecallRequest()">关闭</Button>
          <Button type="primary" size="large" @click="confirmCheckRecallRequest()">确认</Button>
        </div>
    </Modal>
    
  </div>
</template>
<script>
  import orderDeliveryList from './recallorder-delivery-list.vue';
  import dateUtil from 'iview/src/utils/date'
  import swal from 'sweetalert2'
  export default {
    components:{orderDeliveryList},
    data () {
      return {
        orderSourceList:[],total:0,pageSize:10,showCancellOrderRequest:false,
        formSearch:{ extOrderCode:'',receiverName:'',orderStartDate:'',orderEndDate:'',orderSource:'',cancelledStatus:''},	formRecallOrderCheck:{distributionId:'',remark:'',checkResult:'N',showLoading:'Y'},
        recallOrderCheckList: [
          {type: 'expand', width:25, render: (h, params) => {
          			return h(orderDeliveryList, {props: { row: params.row }})} 
          },
          {title: '订单编号', key: 'extOrderCode',align: 'center'},
          {title: '订单来源', key: 'orderSourceValue',align: 'center',width: 85},
          {title: '创建时间', key: 'createdDate',align: 'center', width: 148},
          {title: '仓库', key: 'warehouseName',align: 'center' , render: (h, params) => {
          		return params.row.warehouseName == null ? ' -/- ' : params.row.warehouseName;
          }},
          {title: '货主', key: 'whOwnerName' ,align: 'center' , render: (h, params) => {
          		return params.row.whOwnerName == null ? ' -/- ' : params.row.whOwnerName;
          }},
          {title: '收件方名称', key: 'receiverName' ,align: 'center'},
          {title: '申请状态', width: 120 ,align: 'center',render: (h, params) => {
          		if(params.row.cancelledStatus == '00'){
          			return h('Tag', {props:{color: 'yellow'}},"申请中")
          		}else if(params.row.cancelledStatus == '01'){
          			return h('Tag', {props:{color: 'green'}},"同意")
          		}else if(params.row.cancelledStatus == '02'){
          			return h('Tag', {props:{color: 'red'}},"拒绝")
          		}
          }},
          {title: '操作', width: 100 ,align: 'center',render: (h, params) => {
          	if(params.row.cancelledStatus == '00'){
          		return h('div', [              	
	                h('Button', {props:{type: 'primary',size: 'small'},style: {margin: '2px'},on: {click: () => {this.checkCancellOrderRequest(params.row)}}},'审核')
	            ]);
	        }else{
	            return h('div', [              	
	                h('Button', {props:{type: 'primary',size: 'small', disabled:true},style: {margin: '2px'},on: {click: () => {this.checkCancellOrderRequest(params.row)}}},'审核')
	            ]);
	        }
          }}
        ],recallOrderCheckListData: [],
        ruleValidate: {
          	remark: [{ type:'string',max:400,message:'备注必须少于400个字符',trigger:'blur'}]
        }
      }
    },
    methods: {

        doPageChange(pagenumber){
              let startIndex = ( pagenumber - 1 ) * this.pageSize;
              let endIndex = pagenumber * this.pageSize;
              this.search(startIndex,endIndex);
        },
      	doSearchReset(){
        	for(var field in this.formSearch){
        		  this.formSearch[field] = '';
        	}
          this.formSearch.orderSource = '0000'
          this.formSearch.cancelledStatus = '0000'
        	var now = new Date() , nowTime = now.getTime() ,day = now.getDay();
	        var oneDayTime = 24*60*60*1000 ; 
	        var MondayTime = nowTime - (day-1)*oneDayTime ; 
	        var SundayTime =  nowTime + (7-day)*oneDayTime ;
	        this.formSearch.orderStartDate = new Date(MondayTime)
	        this.formSearch.orderEndDate = new Date(SundayTime)
      	},
      	cancelCheckRecallRequest(){
      		this.showCancellOrderRequest=false;
      		this.formRecallOrderCheck={distributionId:'',remark:'',checkResult:'N',showLoading:'Y'};
      	},
      	checkCancellOrderRequest(row){
	        this.showCancellOrderRequest = true   ;
	        this.formRecallOrderCheck.distributionId = row.distributionId
    	},
    	confirmCheckRecallRequest(){
    		this.$api.saveDistributionCheckResult(this.formRecallOrderCheck).then(res => {
            	if(res.status == "S"){
            		swal({text: '订单取消申请审核成功!',type: 'success',showCancelButton: false,width:300}).then((isConfirm)=>{
            			this.search();
            			this.cancelCheckRecallRequest();
					});
            	}else{
                  	swal('订单取消申请审核失败', res.result.message, 'error');
                }
		    })
    	},
    	search(startIndex , endIndex){
	        if(!startIndex) startIndex = this.$table.INIT_START_INDEX;
	        if(!endIndex)endIndex = this.$table.INIT_END_INDEX
	        let lStartIndex = startIndex;
	        let lEndIndex = endIndex;
	        let params = {
	            startIndex:lStartIndex,
	            endIndex:lEndIndex,
	            orderSource:this.formSearch.orderSource === '0000' ? '' : this.formSearch.orderSource,
	            extOrderCode:this.formSearch.extOrderCode,
	            orderStartDate:dateUtil.format(this.formSearch.orderStartDate,'yyyy-MM-dd'),
	            orderEndDate:dateUtil.format(this.formSearch.orderEndDate,'yyyy-MM-dd'),
	            receiverName:this.formSearch.receiverName,
	            cancelledStatus:this.formSearch.cancelledStatus === '0000' ? '' : this.formSearch.cancelledStatus
	        }
          if(startIndex*1 == 0 && this.$refs['pager'])this.$refs['pager'].currentPage  = 1;
	        this.$api.doCancellRequestOrderDistrbutionList(params).then(res => {
	            if(res.status == "S"){
	                this.total = res.result.total;
	                this.transportData = [];
	                this.recallOrderCheckListData = res.result.records;
	            }else{
	              swal('获取订单取消申请列表失败', res.message, 'error');
	            }
	        })
        }
      
    },
    created(){
    	let ordersourceparams = {category:'SYS_ORDER_SOURCE'};
        this.$api.getParamCategory(ordersourceparams).then(res => {
            if(res.status == "S"){
              this.orderSourceList.push({"refKey":"0000","refValue":"全部"});
              for(let record of res.result){                
                this.orderSourceList.push(record);
              }
            }else{
              swal('获取参数列表失败', res.result.error, 'error');
            }
        })        
        this.doSearchReset()
        this.search()
    }
  }
</script>
