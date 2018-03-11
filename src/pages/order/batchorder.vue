<template>
  <div>
    <Breadcrumb>
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>订单管理</BreadcrumbItem>
      <BreadcrumbItem>批量导入订单管理</BreadcrumbItem>
    </Breadcrumb>
    <Form :model="formSearch" :label-width="100" style="margin-top: 20px">
      <Row>
        <Col span="6">
        <FormItem label="客户订单编号">
          <Input v-model="formSearch.extOrderCode" placeholder="请输入客户订单编号"></Input>
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="订单创建日期">
          <DatePicker type="date" placeholder="请输入订单创建日期" v-model="formSearch.orderDate"></DatePicker>
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="订单状态">
          <Select v-model="formSearch.status" >
              <Option value="00">待确认</Option>
              <Option value="01">已确认</Option>
              <Option value="02">申请取消</Option>
              <Option value="02">已取消</Option>
              <Option value="02">待发货</Option>
              <Option value="02">发货中</Option>
              <Option value="02">已发货</Option>
              <Option value="02">已收货</Option>
              <Option value="02">已拒收</Option>
            </Select>
        </FormItem>
        </Col>
        <Col span="5">
          <Button type="ghost" style="float:right;margin-left:2px;" @click="doSearchReset()">重置</Button>
          <Button type="primary" style="float:right;margin-left:2px;" @click="search()">查询</Button>
          <Button type="primary" style="float:right;margin-left:2px;" @click="add()" >新增</Button>
        </Col>
      </Row>
    </Form>

    <Table border :columns="transportList" :data="transportData"></Table>
    <Page :total="40" size="small" show-elevator show-sizer style="float: right;margin-top: 10px"></Page>
    
  </div>
</template>
<script>
  import expandRow from './table-expand.vue';
  export default {
    components: { expandRow},
    data () {
      return {
        formSearch:{ extOrderCode:'',orderDate:''},
		formOrder:{orderCode:'',addressType:'00',addressCode:'',remarks:'',address:'', province:'',city:'',district:'',
			extMedicineCode:'',extMedicineName:'',whCode:'',totalNumber:0 ,
			medicineData:[{},{}]},
		orderInfo: false,addMedicine:false,
        transportList: [
          //{type: 'expand', width: 50, render: (h, params) => { return h(expandRow, {props: { row: params.row }})} },
          {type: 'index',width: 60,align: 'center'},
          {title: '客户订单编号', key: 'extOrderCode',align: 'center'},
          {title: '订单创建时间', key: 'orderDate',align: 'center', sortable: true },
          {title: '收件人名称', key: 'cneeName' ,align: 'center'},
          {title: '收件电话', key: 'cneeMobile' ,align: 'center'},
          {title: '收件地址', key: 'recAddr' ,align: 'center'},
          {title: '订单状态', key: 'statusLabel',align: 'center',width: 90},
          { title: '操作', key: 'action', width: 130, align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', { props: {  type: 'primary', size: 'small' }, style: { marginRight: '5px' },
                  on: { click: () => { this.show(params.row) } } }, '详情'),
                h('Button', { props: { type: 'error', size: 'small' },
                  on: { click: () => { this.del(params.row) } } }, '删除')
              ]);
            }
          }

        ],        
        transportData: [
          {
            no: '1', extOrderCode: 'XSAZDA00172058',  transportNo: 'No.20170909-1',statusLabel:'待确认',sourceLabel:'B2B',
            cneeName: '大连美罗药业集团', cneeMobile: '18766312029', recAddr:'辽宁省大连市旅顺口区', orderDate:'2017-02-01 08:22:38', 
            senderInfo:{  senderName:'第二家药厂',  senderPhone:'18766212311',  senderAddress:'辽宁省大连市旅顺口区',  senderType:'货到付款' },
            recInfo:{ recName:'第二个收货人', recPhone:'18766211132', recAddress:'山东省威海市经济开发区' },
            medicineList:[{medName:'测试药品2',medNo:'Md.0001',medPrice:'13.3',medNum:'10',medCreateDate:'2017-09-10 08:22:32', medValidDate:'7'}]
          },
          {
            no: '2', extOrderCode: 'XSAZDA00172056',  transportNo: 'No.20170909-1',statusLabel:'待确认',sourceLabel:'云仓平台',
            cneeName: '修正药业集团', cneeMobile: '18766312029', recAddr:'辽宁省大连市旅顺口区', orderDate:'2017-02-01 08:22:37', 
            senderInfo:{  senderName:'第二家药厂',  senderPhone:'18766212311',  senderAddress:'辽宁省大连市旅顺口区',  senderType:'货到付款' },
            recInfo:{ recName:'第二个收货人', recPhone:'18766211132', recAddress:'山东省威海市经济开发区' },
            medicineList:[{medName:'测试药品2',medNo:'Md.0001',medPrice:'13.3',medNum:'10',medCreateDate:'2017-09-10 08:22:32', medValidDate:'7'}]
          },
          {
            no: '2', extOrderCode: 'XSAZDA00172054',  transportNo: 'No.20170909-1',statusLabel:'待确认',sourceLabel:'云仓平台',
            cneeName: '吉林敖东药业集团', cneeMobile: '18766312029', recAddr:'辽宁省大连市旅顺口区', orderDate:'2017-02-01 08:22:36', 
            senderInfo:{  senderName:'第二家药厂',  senderPhone:'18766212311',  senderAddress:'辽宁省大连市旅顺口区',  senderType:'货到付款' },
            recInfo:{ recName:'第二个收货人', recPhone:'18766211132', recAddress:'山东省威海市经济开发区' },
            medicineList:[{medName:'测试药品2',medNo:'Md.0001',medPrice:'13.3',medNum:'10',medCreateDate:'2017-09-10 08:22:32', medValidDate:'7'}]
          }
        ]
      }
    },
    methods: {
      doSearchReset(){
      	for(var field in this.formMemberSearch){
      		this.formSearch[field] = '';
      	}
      },
      show (row) {
        this.$router.push('/order/order?id='+row.extOrderCode)
      },
      showMemberinfo (row) {
        this.memberInfo = true;
      },
      del (row) {
        this.delCustomer = true;
        this.delCustomerName = row.customerName;
        this.delCustomerCode = row.customerCode;
      },
      doDel(row){
        this.delCustomer = true;
      },
      add(){
        this.$router.push('/order/order?aa=b')
      },
      search(){}
    },
    created(){
       /**
      this.$Notice.config({
        top: 80,
      });
      this.$Notice.open({
        title: '订单No.123已经出货',
        desc: '发件人：第一药厂,收件人：第一收件人',
        duration: 0
      });
     
      this.$Notice.open({
        title: '订单No.123已经被签收',
        desc: '收件人：第一收件人,收件时间：2017-10-11 20:20:20',
        duration: 2
      });**/
    }
  }
</script>
