<template>
  <div>
    <Breadcrumb>
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>订单管理</BreadcrumbItem>
      <BreadcrumbItem>订单分仓</BreadcrumbItem>
    </Breadcrumb>
    <Form :model="formSearch" :label-width="90" style="margin-top: 20px">
      <Row>
        <Col span="20">
        <Col span="8">
        <FormItem label="订单编号">
          <Input v-model="formSearch.extOrderCode" placeholder="请输入订单编号"></Input>
        </FormItem>
        </Col>
        <Col span="8">
        <FormItem label="收件方名称">
          <Input v-model="formSearch.receiverName" placeholder="请输入收件方名称"></Input>
        </FormItem>
        </Col>
        <Col span="8">
        <FormItem label="联系电话">
          <Input v-model="formSearch.receiverMobile" placeholder="请输入联系电话"></Input>
        </FormItem>
        </Col>
        <Col span="16">
        <FormItem label="订单日期">
          <DatePicker type="date" placeholder="开始日期" v-model="formSearch.orderStartDate" style="width:135px"></DatePicker>
          ~
          <DatePicker type="date" placeholder="结束日期" v-model="formSearch.orderEndDate" style="width:135px"></DatePicker>
        </FormItem>
        </Col>       
        </Col>
        <Col span="4">
        <Button type="ghost" style="float:right;margin-left:10px;" @click="doSearchReset()">重置</Button>
        <Button type="primary" style="float:right;" @click="search()">查询</Button>
        </Col>
      </Row>
    </Form>
    <Table border :columns="transportList" :data="transportData"></Table>
    <Page :total="total" ref="pager" :page-size="pageSize" size="small" show-elevator show-sizer show-total  @on-change="doPageChange" style="float:right;margin-top: 10px"></Page>
    <Modal
      title="订单完成分仓"
      v-model="showConfirmWarehouse"
      :mask-closable="false"
      :loading="true" width="840px">
        <div style="font-size:14px;margin:6px">订单&nbsp;[&nbsp;<B>{{confirmOrderData.order.extOrderCode}}</B>&nbsp;]&nbsp;发往&nbsp;<B>{{confirmOrderData.order.receiverName}}</B>&nbsp;,分仓信息如下:</div>
        <div v-for="item in confirmOrderData.details">
          <div style="font-size:12.5px;margin:6px">药品 : {{item.medicineCode}} - {{item.medicineName}} - {{item.medicineSpec}} - {{item.medicinePackages}} - {{item.licenseCode}} - {{item.medicineFactory}} - <B style="font-size:14px;color:red">订单数量:{{item.totalNumber}}</B></div>
          <div style="font-size:12.5px;margin:6px">
              <span v-for="ele in item.deliveryList"><Tag type="border" color="blue" v-if="ele.warehouseName!=null">批号:{{ele.batchNo}} - {{ele.warehouseName}}(<B style="font-size:14px;color:red">{{ele.deliveryTotalNumber}}</B>)</Tag></span>
          </div>
        </div>
        <div style="font-size:14px;margin:6px" v-if="confirmOrderData.couldDone"><B>订单确认分仓之后不能再修改药品分仓仓库，您确认完成分仓吗？</B></div>

        <Alert type="error"  v-if="!confirmOrderData.couldDone" show-icon>分仓尚未完成,请您继续为订单药品【分仓】!</Alert>

        <div slot="footer">
          <Button type="text" size="large" @click="confirmWarehouseCancel">取消</Button>
          <Button type="primary" size="large" @click="doConfirmedWarehouse"  v-if="confirmOrderData.couldDone">确定</Button>
        </div>
    </Modal>

  </div>
</template>
<script>
  import medicineexpand from './order-medicine-list.vue';
  import swal from 'sweetalert2';
  import dateUtil from 'iview/src/utils/date'
  export default {
    components: {medicineexpand},
    data () {
      return {
        formSearch:{extOrderCode:'',orderStartDate:'',orderEndDate:'',warehouseCode:'',receiverName:'',receiverMobile:''},  
        warehouseList:[],total:0,pageSize:10, showConfirmWarehouse:false, confirmOrderData:{order:{extOrderCode:'',recevierName:''},details:[]},
        
        transportList: [
          {type:'expand',width:50,render:(h,params)=>{return h(medicineexpand,{props:{row:params.row}})}},
          {title: '订单编号', key: 'extOrderCode',align: 'center', width:150},
          {title: '订单时间', key: 'createdDate',align: 'center', width:160},
          {title: '收货方名称', key: 'receiverName' ,align: 'center'},
          {title: '联系电话', key: 'receiverMobile' ,align: 'center',width: 120},
          {title: '订单来源', key: 'orderSourceValue',align: 'center',width: 90},
          {title: '订单状态', key: 'statusValue',align: 'center',width: 90},

          {title: '操作',key: 'action',width: 90,align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {props:{type: 'primary',size: 'small'},style: {margin: '2px'},on: {click: () => {this.confirmedWarehouse(params.row)}} }, '分仓完成'),
              ]);
            }
          }
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
          var now = new Date() , nowTime = now.getTime() ,day = now.getDay();
          var oneDayTime = 24*60*60*1000 ; 
          var MondayTime = nowTime - (day-1)*oneDayTime ; 
          var SundayTime =  nowTime + (7-day)*oneDayTime ;
          this.formSearch.orderStartDate = new Date(MondayTime)
          this.formSearch.orderEndDate = new Date(SundayTime)
      },
      confirmWarehouseCancel(){this.showConfirmWarehouse = false;},
      //弹出分仓页面
      confirmedWarehouse(row){
        
          this.$api.doOrderDetailsDistributionInfo({"orderId":row.orderId,"showLoading":"Y"}).then(res => {
              if(res.status == "S"){
                  this.confirmOrderData.details = res.result
                  
                  let validationResult = true;
                  for(var index in res.result){
                      var record = res.result[index];                      
                      if(record.deliveryList.length == 0){
                          validationResult = false;
                      }else{
                          for(var ii in record.deliveryList){
                              var delivery = record.deliveryList[ii];
                              if((delivery.warehouseCode == null || delivery.warehouseCode=='')
                                || (delivery.deliveryTotalNumber == null || delivery.deliveryTotalNumber=='')){
                                  validationResult = false;
                                  break;
                              }
                          }
                      }
                  }
                  //if(validationResult){
                      this.confirmOrderData.order = row
                      this.confirmOrderData.couldDone = validationResult
                      this.showConfirmWarehouse = true;
                  //}else{
                  //    swal('获取订单明细失败', res.message, 'warning');
                  //}
              }else{
                  swal('获取订单明细失败', res.result.message, 'error');
              }
          })
      }, 

      doConfirmedWarehouse(){
          this.showConfirmWarehouse = false;
          this.$api.doOrderAction({orderId:this.confirmOrderData.order.orderId,action:'COMMIT_DISTRIBUTION',showLoading:'Y'}).then(res => {
            if(res.status == "S"){
                
            swal({text: '分仓成功!',type: 'success',showCancelButton: false}).then((s)=>{this.search();});
            }else{
                swal('操作失败', res.result.message, 'error');
            }
          })
      },   

      search(startIndex,endIndex){
          if(!startIndex) startIndex = this.$table.INIT_START_INDEX;
          if(!endIndex)endIndex = this.$table.INIT_END_INDEX
          let lStartIndex = startIndex;
          let lEndIndex = endIndex;
          let params = {showLoading:'Y',
              startIndex:lStartIndex,
              endIndex:lEndIndex,
              status:'01',orderSource:'',
              extOrderCode:this.formSearch.extOrderCode,
              orderStartDate:dateUtil.format(this.formSearch.orderStartDate,'yyyy-MM-dd'),
              orderEndDate:dateUtil.format(this.formSearch.orderEndDate,'yyyy-MM-dd'),
              receiverName:this.formSearch.receiverName,
              receiverMobile:this.formSearch.receiverMobile
          }
          if(startIndex*1 == 0 && this.$refs['pager'])this.$refs['pager'].currentPage  = 1;
          this.$api.doOrderList(params).then(res => {
            if(res.status == "S"){
                this.total = res.result.total;
                this.transportData = [];
                for(let record of res.result.records){ 
                  this.transportData.push(record);
                }
            }else{
              swal('获取待分仓订单失败', res.result.error, 'error');
            }
          })
      }

    },
    created(){
        this.doSearchReset()
        this.search()
    }

  }
</script>

<style>
  .ivu-input-icon-normal+.ivu-input {
    padding-right: 61px;
  }
</style>
