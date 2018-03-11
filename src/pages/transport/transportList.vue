<template>
    <div>
      <Breadcrumb>
        <BreadcrumbItem href="/">首页</BreadcrumbItem>
        <BreadcrumbItem href="/">运输单管理</BreadcrumbItem>
        <BreadcrumbItem>运输单列表</BreadcrumbItem>
      </Breadcrumb>
      <Form :model="form" :label-width="80" style="margin-top: 20px">
        <Row>
          <Col span="6">
            <FormItem label="订单编码">
              <Input v-model="form.orderNo" placeholder="请输入"></Input>
            </FormItem>
          </Col>
          <Col span="6">
          <FormItem label="运单编码">
            <Input v-model="form.transportNo" placeholder="请输入"></Input>
          </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="发货日期">
              <DatePicker type="date" placeholder="选择日期" v-model="form.orderDate"></DatePicker>
            </FormItem>
          </Col>
          <Col span="6">
          <FormItem >
            <Button type="ghost" style="float:right">查询</Button>
          </FormItem>
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
    components: { expandRow },
    data () {
      return {
        form:{
          orderNo:'',
          orderDate:'',
          transportNo:''
        },

        transportList: [
          {
            type: 'expand',
            width: 50,
            render: (h, params) => {
              return h(expandRow, {
                props: {
                  row: params.row
                }
              })
            }
          },
          {
            title: '编号',
            key: 'no'
          },
          {
            title: '订单号',
            key: 'orderNo'
          },
          {
            title: '发货时间',
            key: 'createDate',
            sortable: true
          },
          {
            title: '运单号',
            key: 'transportNo'
          },
          {
            title: '收件人',
            key: 'recName'
          },
          {
            title: '收件电话',
            key: 'recPhone'
          },
          {
            title: '收件地址',
            key: 'recAddr'
          },

        ],
        transportData: [
          {
            no: '1',
            orderNo: 'No.20170909',
            transportNo: 'No.20170909-1',
            recName: '魏博文',
            recPhone: '18766312029',
            recAddr:'辽宁省大连市中山区',
            createDate:'2017-08-01',
            medicineList:[
              {
                medName:'第一款测试药品',
                medNo:'Md.0001',
                medPrice:'13.3',
                medNum:'10',
                medCreateDate:'2017-09-10 08:22:32',
                medValidDate:'7'
              },
              {
                medName:'测试药品',
                medNo:'Md.0002',
                medPrice:'14',
                medNum:'14',
                medCreateDate:'2017-02-10 18:12:32',
                medValidDate:'17'
              },
            ]
          },
          {
            no: '2',
            orderNo: 'No.20170909',
            transportNo: 'No.20170909-1',
            recName: '魏博文001',
            recPhone: '18766312029',
            recAddr:'辽宁省大连市旅顺口区',
            createDate:'2017-02-01',
            medicineList:[
              {
                medName:'第二款测试药品',
                medNo:'Md.0001',
                medPrice:'13.3',
                medNum:'10',
                medCreateDate:'2017-09-10 08:22:32',
                medValidDate:'7'
              },
            ]
          },
          {
            no: '3',
            orderNo: 'No.20170909',
            transportNo: 'No.20170909-1',
            recName: '魏博文003',
            recPhone: '18766312029',
            recAddr:'辽宁省大连市沙河口区',
            createDate:'2017-12-01',
            medicineList:[
              {
                medName:'第三款测试药品',
                medNo:'Md.0001',
                medPrice:'13.3',
                medNum:'10',
                medCreateDate:'2017-09-10 08:22:32',
                medValidDate:'7'
              },
            ]
          },
        ]
      }
    },
    created(){
      this.$Spin.show();
      setTimeout(() => {
        this.$Spin.hide();
      }, 3000);
    }
  }
</script>
