<template>
  <div>
    <Breadcrumb>
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>库存管理</BreadcrumbItem>
      <BreadcrumbItem>出库信息</BreadcrumbItem>
    </Breadcrumb>
    <h3 class="box-title" slot="header" style="width: 100%;">
      <Form :model="formSearch" :label-width="100" style="margin-top: 20px">
        <Row>
          <Col span="20">
          
          <Col span="8">
          <FormItem label="订单编号">
            <Input v-model="formSearch.extOrderCode" placeholder="请输入订单编号"></Input>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="出库单号">
            <Input v-model="formSearch.wmsStockoutCode" placeholder="请输入出库单号"></Input>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="出库单状态">
            <Select v-model="formSearch.distributionStatus" placeholder="请选择出库单状态">
                <Option value="0000">全部</Option>
                <Option value="00">未出库</Option>
                <Option value="01">已出库</Option>
                <Option value="02">已取消</Option>
              </Select> 
          </FormItem>
          </Col>
          </Col>
          <Col span="4">
          <Button type="ghost" style="float:right;margin-left: 10px" @click="doSearchReset()">重置</Button>
          <Button type="primary" style="float:right;" @click="search()">查询</Button>
          </Col> 
          <Col span="16">
        <FormItem label="订单日期">
          <DatePicker type="date" placeholder="开始日期" v-model="formSearch.orderStartDate" style="width:135px"></DatePicker>
          ~
          <DatePicker type="date" placeholder="结束日期" v-model="formSearch.orderEndDate" style="width:135px"></DatePicker>
        </FormItem>
        </Col>       
        </Row>
      </Form>
    </h3>
    <div slot="body">
      <Table border :columns="ioStockList" :data="ioStockData"></Table>
      <Page :total="total" :page-size="pageSize" size="small" show-elevator show-sizer show-total
            style="float: right;margin-top: 10px" @on-change="doPageChange"></Page>
    </div>
  </div>
</template>

<script>
  import swal from 'sweetalert2'
  import dateUtil from 'iview/src/utils/date'
  import orderDeliveryList from '../order/order-delivery-list.vue';
  export default {
   components: {orderDeliveryList},
    data() {
      return {
        formSearch: { wmsStockoutCode: '',extOrderCode: '',distributionStatus:'',orderStartDate:'',orderEndDate:''},
        total: 0,pageSize: 10,
        formMember: {
          userId: null, username: '', password: '',
          memberName: '', sex: '', mobile: '', email: '', memberType: [],
          userType: 'SYS', remarks: '', status: '00',
          createdBy: '', createdDate: null, updatedBy: '', updatedDate: null
        },
        ioStockList: [
          {type: 'expand',width: 50,
            render: (h, params) => {
                return h(orderDeliveryList, {props: { row: params.row }})
              }
          },
          {title: '订单编号', key: 'extOrderCode', align: 'center'}, 
          {title: '订单创建日期', key: 'createdDate', align: 'center' , width:200}, 
          {title: '出库单号', key: 'wmsStockoutCode', align: 'center',render: (h, params) => {
              if(params.row.wmsStockoutCode == undefined){return "-/-"}else{return params.row.wmsStockoutCode}}},          
          {title: '货主名称', key: 'whOwnerName', align: 'center'},
          {title: '收件方名称', key: 'receiverName', align: 'center'}, 
          {title: '运单编号', align: 'center',key: 'waybillCode',render: (h, params) => {
             return params.row.waybillCode}},
        ],
        ioStockData: []
      }
    },
    methods: {
      doSearchReset(name) {
          this.formSearch['wmsStockoutCode'] = '';
          this.formSearch['extOrderCode'] = '';
          this.formSearch['distributionStatus'] = '0000';
          this.formSearch['orderStartDate'] = '';
          this.formSearch['orderEndDate'] = '';
          var now = new Date() , nowTime = now.getTime() ,day = now.getDay();
          var oneDayTime = 24*60*60*1000 ; 
          var MondayTime = nowTime - (day-1)*oneDayTime ; 
          var SundayTime =  nowTime + (7-day)*oneDayTime ;
          this.formSearch.orderStartDate = new Date(MondayTime)
          this.formSearch.orderEndDate = new Date(SundayTime)
      },
      //change page number
      doPageChange(pagenumber) {
          let startIndex = ( pagenumber - 1 ) * this.pageSize;
          let endIndex = pagenumber * this.pageSize;
          this.search(startIndex, endIndex);
      },
      search(startIndex, endIndex) {
        if(!startIndex) startIndex = this.$table.INIT_START_INDEX;
        if(!endIndex)endIndex = this.$table.INIT_END_INDEX
        let params = {
            startIndex: startIndex,
            endIndex: endIndex,
            distributionStatus:this.formSearch.distributionStatus === '0000' ? '' : this.formSearch.distributionStatus,
            wmsStockoutCode: this.formSearch.wmsStockoutCode,
            extOrderCode: this.formSearch.extOrderCode,
            orderStartDate: dateUtil.format(this.formSearch.orderStartDate,'yyyy-MM-dd'),
            orderEndDate: dateUtil.format(this.formSearch.orderEndDate,'yyyy-MM-dd')
        }
        this.$api.doIoStockList(params).then(res => {
          if (res.status == "S") {
              this.total = res.result.total;
              this.ioStockData = res.result.records;
          } else {
            swal({text: '操作失败[' + res.result.error + ']!', type: 'error', showCancelButton: false, width: 300});
          }
        })
      },
    },
    //init page data
    created() {this.doSearchReset();this.search();}
  }
</script>
<style>
  .el-pagination {
    float: right;
    margin-top: 15px;
  }
</style>
