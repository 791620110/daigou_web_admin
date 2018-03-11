<template>
  <div>
    <Breadcrumb>
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>订单管理</BreadcrumbItem>
      <BreadcrumbItem>订单取消申请</BreadcrumbItem>
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
        <Col span="3">
          <Button type="primary" style="float:right;margin-bottom: 10px;" @click="requestRecall()" >申请取消订单</Button>
        </Col>
      </Row>
    </Form>
    <Table border :columns="recallOrderList" :data="recallOrderListData"></Table>
    <Page :total="total" ref="pager" :page-size="pageSize" size="small" show-elevator show-sizer  @on-change="doPageChange" style="float:right;margin-top: 10px"></Page>



    <Modal
      title="订单取消申请"
      v-model="showRequestRecall"
      :mask-closable="false"
      :loading="true" width="960px" @on-cancel="cancelRecallRequest()">

        <Form :model="formRecallOrder" label-position="left" :label-width=100 ref="formRecallOrder" :rules="ruleValidate">
	        <Row>
	        	<Col span="10">
			        <FormItem label="客户订单编号" prop="extOrderCode">
			          <Input v-model="formRecallOrder.extOrderCode" placeholder="请输入申请取消客户订单编号"></Input>
			        </FormItem>
		        </Col>
		        <Col span="3">
		        	<Button type="primary" style="float:right;" @click="doDistributionSearch()">检索分仓信息</Button>
		        </Col>
	        </Row>
			<Row>
	        	<Col span="24">
			        <Table border :columns="transportList" :data="transportData"></Table>
		        </Col>
	        </Row>
		</Form>
        <div slot="footer">
          <Button type="text" size="large" @click="cancelRecallRequest()">关闭</Button>
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
        orderStatusList:[],orderSourceList:[],total:0,pageSize:10,
        showRequestRecall:false,showRecallAll:false,
        formSearch:{ extOrderCode:'',receiverName:'',orderStartDate:'',orderEndDate:'',orderSource:'',cancelledStatus:''},	formRecallOrder:{extOrderCode:''},
        transportList: [
          {type: 'expand', width:25, render: (h, params) => {
          		return h(orderDeliveryList, {props: { row: params.row , request:true }})} 
          },
          {title: '订单状态', key: 'statusValue',align: 'center',width: 85},
          {title: '订单来源', key: 'orderSourceValue',align: 'center',width: 85},
          {title: '订单创建时间', key: 'createdDate',align: 'center', width: 150},
          {title: '仓库', key: 'whName',align: 'center'},
          {title: '货主', key: 'whOwnerName' ,align: 'center'},
          {title: '收件方名称', key: 'receiverName' ,align: 'center'},
          {title: '分仓单状态', width: 100 ,align: 'center',render: (h, params) => {
          		return params.row.status == '-/-' ? ' -/- ' : (params.row.status=='00' ?  "未处理" : "已处理");
          }},
          {title: '操作',key: 'action',width: 95,align: 'center',
            render: (h, params) => {

            	if(params.row.status=='已取消'||params.row.status=='待送达'){
            		return h('div', [              	
	                h('Button', {props:{type: 'ghost',size: 'small',disabled:true},style: {margin: '2px'}},'申请取消'),
	              ]);
              	}else{ 
	              return h('div', [              	
	                h('Button', {props:{type: 'error',size: 'small'},style: {margin: '2px'},on: {click: () => {this.cancelDistribution(params.row)}} }, '申请取消'),
	              ]);
	            }
            }
          }
        ],transportData: [],

        recallOrderList: [
          {type: 'expand', width:25, render: (h, params) => {
          			return h(orderDeliveryList, {props: { row: params.row }})} 
          },
          {title: '订单编号', key: 'extOrderCode',align: 'center'},
          {title: '订单来源', key: 'orderSourceValue',align: 'center',width: 85},
          {title: '订单创建时间', key: 'createdDate',align: 'center', width: 148},
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
          			return h('Tag', {props:{color: 'green'}},"同意取消")
          		}else if(params.row.cancelledStatus == '02'){
          			return h('Tag', {props:{color: 'red'}},"拒绝取消")
          		}
          }}
        ],recallOrderListData: [],

        ruleValidate: {
          extOrderCode: [
            { required: true, message: '申请取消客户订单编号不能为空', trigger: 'blur' }
          ]
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
      	cancelRecallRequest(){
      		this.showRequestRecall=false;
      		this.formRecallOrder={extOrderCode:''};
      		this.transportData = [];
      		this.$refs['formRecallOrder'].resetFields();
      		this.search()
      	},
      	requestRecall(){
	        this.showRequestRecall = true   
    	},
    	doCancellDistribution(distributionId){
    		this.$api.doCancellDistributionInfo({distributionId:distributionId,showLoading:'Y'}).then(res => {
            	if(res.status == "S"){
            		swal({text: '申请取消成功!',type: 'success',showCancelButton: false,width:300}).then((isConfirm)=>{
						this.doDistributionSearch()
					});
            	}else{
                  	swal('申请取消失败', res.result.message, 'error');
                }
	        })
    	},
    	cancelDistribution(row){
    		let distributionId = row.distributionId;
			let orderId = row.orderId;
    		if(distributionId == null){//待分仓订单， 还没有分库单， 先创建分库单
    			this.$api.addDistributionInfoByOrderId({orderId:orderId,showLoading:'N'}).then(res => {
	            	if(res.status == "S"){
	            		swal({text: '申请取消成功!',type: 'success',showCancelButton: false,width:300}).then((isConfirm)=>{
	            			for(var i in res.result)
								this.doCancellDistribution(res.result[i].distributionId);
						});
	            	}else{
	                  	swal('申请取消失败', res.result.message, 'error');
	                }
		        })
    		}else{
				this.doCancellDistribution(distributionId);
    		}
    	},
    	doDistributionSearch(){
    		this.$refs['formRecallOrder'].validate((valid) => {if (valid) { 
	    	let params = {orderCode:this.formRecallOrder.extOrderCode,"showLoading":"Y"}
          	this.$api.doOrderInfoByCode(params).then(res => {
	            if(res.status == "S"){
	            	let orderId = res.result.orderId;
	            	//还没有分仓， 可以直接取消
	                if(res.result.status == '00'||res.result.status == '01'){

	                	if(res.result.cancelledStatus == null || res.result.cancelledStatus == 'N')
		                	this.transportData = [
		                		{distributionId:null,orderId:orderId,statusValue:res.result.statusValue,
		                		orderSourceValue:res.result.orderSourceValue,createdDate:res.result.createdDate,
		                		whName:'--',whOwnerName:'--',receiverName:res.result.receiverName,status:'--',
		                		details : res.result.details,orderStatus:status}
		                	]
		                else{
		                	this.transportData = [];
		                	swal({text: '没有可以取消的分仓单!',type: 'success',showCancelButton: false,width:300});
		                }

	                }else{//获取分仓信息
	                	this.$api.doOrderDistributionInfo({"orderId":orderId,"showLoading":"N"}).then(res2 => {
			                if(res2.status == "S"){
			                    this.transportData = []
			                    var farray = new Array();
			                    for(var i in res2.result){
			                    	var obj = res2.result[i];
			                    	if(obj.cancelledStatus != null && obj.cancelledStatus != ''){
			                    		continue;
			                    	}
			                    	obj.statusValue = res.result.statusValue;
			                    	obj.orderStatus = res.result.status;
			                    	obj.orderSourceValue = res.result.orderSourceValue;
			                    	obj.createdDate = res.result.createdDate;
			                    	obj.receiverName = res.result.receiverName;
			                    	farray.push(obj)
			                    	
			                    }
			                    if(farray.length == 0){
			                    	swal({text: '没有可以取消的分仓单!',type: 'success',showCancelButton: false,width:300});
			                    }
			                    this.transportData = farray
			                }else{
			                  	swal('获取订单分仓信息失败', res2.result.message, 'error');
			                }
			            })

	                }
	            }else{
	              	swal('获取订单详情失败', res.message, 'warning');
	            }
	        })
	        }})
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
	        this.$api.doMyCancellRequestOrderDistrbutionList(params).then(res => {
	            if(res.status == "S"){
	                this.total = res.result.total;
	                this.transportData = [];
	                this.recallOrderListData = res.result.records;
	            }else{
	              swal('获取申请取消分库单失败', res.message, 'error');
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
