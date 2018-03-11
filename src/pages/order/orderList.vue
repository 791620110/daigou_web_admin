<template>
  <div>
    <Breadcrumb>
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>订单管理</BreadcrumbItem>
      <BreadcrumbItem>订单查询</BreadcrumbItem>
    </Breadcrumb>
    <Form :model="formSearch" :label-width="100" style="margin-top: 20px">
      <Row>
        <Col span="20">
        <Col span="8">
        <FormItem label="订单编号">
          <Input v-model="formSearch.extOrderCode" placeholder="请输入订单编号"></Input>
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
        <FormItem label="订单状态">
          <Select v-model="formSearch.status"  placeholder="请选择订单状态">
             <Option v-for="item in orderStatusList" :value="item.refKey" :key="item.refValue">{{ item.refValue }}</Option>
          </Select>
        </FormItem>
        </Col>
        <Col span="16">
        <FormItem label="订单日期">
          <DatePicker type="date" placeholder="开始日期" v-model="formSearch.orderStartDate" format="yyyy-MM-dd" style="width:135px;"></DatePicker>
          ~
          <DatePicker type="date" placeholder="结束日期" v-model="formSearch.orderEndDate" format="yyyy-MM-dd"  style="width:135px;"></DatePicker>
        </FormItem>
        </Col>
        
        </Col>
        <Col span="24" v-if="false">
          <Button type="primary" style="float:right;margin-bottom: 10px;" @click="add()" >新增手工订单</Button>
        </Col>
      </Row>
    </Form>

    <Table border :columns="transportList" :data="transportData"></Table>
    <Page :total="total" ref="pager" :page-size="pageSize" size="small"    show-elevator show-sizer show-total   @on-change="doPageChange" style="float:right;margin-top: 10px"></Page>
    
  </div>
</template>
<script>
  import expandRow from './order-expand.vue';
  import expandb2bRow from './order-b2b-expand.vue';
  import expand3rdRow from './order-3rd-expand.vue';
  import dateUtil from 'iview/src/utils/date'
  import swal from 'sweetalert2'
  export default {
    components:{expandRow , expandb2bRow},
    data () {
      return {
        orderStatusList:[],orderSourceList:[],warehouseList:[],total:0,pageSize:10,
        formSearch:{ extOrderCode:'',orderStartDate:'',orderEndDate:'',status:'',warehouseCode:'',orderSource:'',receiverName:''},	
        transportList: [
          {type: 'expand', width: 40, render: (h, params) => { 
              if(params.row.orderSource=='usr'){
                return h(expandRow, {props: { row: params.row }})
              }else if(params.row.orderSource=='b2b'){
                return h(expandb2bRow, {props: { row: params.row }})
              }else if(params.row.orderSource=='3rd'){
                return h(expand3rdRow, {props: { row: params.row }})
              }
          } },
          {title: '订单编号', key: 'extOrderCode',align: 'center', width:160},
          {title: '订单时间', key: 'createdDate',align: 'center', width:160},
          {title: '收件方名称', key: 'receiverName' ,align: 'center'},
          {title: '联系人', key: 'receiverPerson' ,align: 'center'},
          {title: '联系电话', key: 'receiverMobile' ,align: 'center',width: 120},
          {title: '订单来源', key: 'orderSourceValue',align: 'center',width: 90},
          {title: '订单状态', key: 'statusValue',align: 'center',width: 100,render: (h, params) => { 
              if(params.row.cancelledStatus=='A'){
                  return h('B', {style: {color: 'red'}}, '已取消')
              }else if(params.row.cancelledStatus=='Y'){
                  return h('span', [params.row.statusValue, h('br'),h('span',{style: {color: 'red'}} ,"(部分取消)") ] )
              }else{
                  return h('span', params.row.statusValue)
              }
          } },
        ],        
        transportData: []
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
          this.formSearch.status = '0000'
          var now = new Date() , nowTime = now.getTime() ,day = now.getDay();
          var oneDayTime = 24*60*60*1000 ; 
          var MondayTime = nowTime - (day-1)*oneDayTime ; 
          var SundayTime =  nowTime + (7-day)*oneDayTime ;

          this.formSearch.orderStartDate = new Date(MondayTime)
          this.formSearch.orderEndDate = new Date(SundayTime)
      },
      show (row) {
          this.$router.push('/order/order?id='+row.extOrderCode)
      },
      add(){
          this.$router.push('/order/order')
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
              status:this.formSearch.status === '0000' ? '' : this.formSearch.status,
              extOrderCode:this.formSearch.extOrderCode,
              orderStartDate:dateUtil.format(this.formSearch.orderStartDate,'yyyy-MM-dd'),
              orderEndDate:dateUtil.format(this.formSearch.orderEndDate,'yyyy-MM-dd'),
              receiverName:this.formSearch.receiverName,
              warehouseCode:this.formSearch.warehouseCode,
              showLoading:'Y'
          }
          if(startIndex*1 == 0 && this.$refs['pager'])this.$refs['pager'].currentPage  = 1;
          this.$api.doOrderList(params).then(res => {
            if(res.status == "S"){
                this.total = res.result.total;
                this.transportData = [];
                for(let record of res.result.records){              
                  if(record){
                      
                  }
                  this.transportData.push(record);
                }
            }else{
              swal('获取订单列表失败', res.result.error, 'error');
            }
          })
      }
    },
    created(){

        let orderstatusparams = {category:'ORDER_STATUS'};
        this.$api.getParamCategory(orderstatusparams).then(res => {
            if(res.status == "S"){
              this.orderStatusList.push({"refKey":"0000","refValue":"全部"});        
              for(let record of res.result){
                this.orderStatusList.push(record);
              }
             // this.orderStatusList.push({"refKey":"Y","refValue":"部分取消"})
             // this.orderStatusList.push({"refKey":"A","refValue":"已取消"})
            }else{
              swal('获取参数列表失败', res.result.error, 'error');
            }
        })

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

        this.doSearchReset();
        this.search()
    }
  }
</script>
