<template>
  <div>
    <Breadcrumb>
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>运单管理</BreadcrumbItem>
      <BreadcrumbItem>生成运单</BreadcrumbItem>
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
        <Col span="16">
        <FormItem label="订单日期">
          <DatePicker type="date" placeholder="开始日期" v-model="formSearch.orderStartDate" style="width:135px"></DatePicker>
          ~
          <DatePicker type="date" placeholder="结束日期" v-model="formSearch.orderEndDate" style="width:135px"></DatePicker>
        </FormItem>
        </Col>        
        </Col>
      </Row>
    </Form> 
    <Table border :columns="transportList" :data="transportData"></Table>
    <Page :total="total" ref="pager" :page-size="pageSize" size="small"  show-elevator show-sizer show-total  @on-change="doPageChange" style="float:right;margin-top: 10px"></Page>

    <Modal v-model="showConfirm" title="订单确认发货"
      :mask-closable="false" :loading="true" width="880">
        <div style="font-size:14px;margin:10px">订单&nbsp;[&nbsp;<B>{{confirmData.extOrderCode}}</B>&nbsp;]&nbsp;,货主&nbsp;<B>{{confirmData.whOwnerName}}</B>&nbsp;,发往&nbsp;<B>{{confirmData.receiverName}}</B>&nbsp;,发货药品如下:</div>
        <div v-for="item in confirmData.details">
          <div style="font-size:12.5px;margin:10px">药品 : {{item.medicineCode}} - {{item.medicineName}} - {{item.medicineSpec}} - {{item.medicineUnit}} - {{item.licenseCode}} - {{item.medicineFactory}} - <B style="font-size:14px;color:red">数量:{{item.totalNumber}}</B></div>
        </div>
        <div>
          <Form :model="formDistribution" :label-width="105" ref="formDistribution" style="margin-top: 20px;margin-right: 20px;" :rules="ruleValidate1">
          <Row>
          <Col span="12">
            <FormItem label="仓库出库单号"  prop="wmsStockoutCode">
              <Input v-model="formDistribution.wmsStockoutCode" placeholder="请输入仓库出库单号"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="发货物流" :required=true>
                <Select v-model="formDistribution.logisticsVendor" placeholder="请选择物流公司">
                  <Option value="jingdong">京东物流</Option>
                </Select>
            </FormItem>
          </Col>
          </Row>
          <Row>
          <Col span="6" >
            <FormItem label="是否保价" prop="insurance">
              <RadioGroup v-model="formDistribution.insurance" type="button">
                  <Radio label="Y">是</Radio>
                  <Radio label="N">否</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col span="6" v-show="formDistribution.insurance == 'Y'">
            <FormItem label="保价金额(元)" prop="insuranceAmount" :required="true">
              <Input type="text" v-model="formDistribution.insuranceAmount" :number="true" placeholder="保价款金额(元)"></Input>
            </FormItem>
          </Col>
          <Col span="6" > 
            <FormItem label="是否代收款" prop="collectPayment">
              <RadioGroup v-model="formDistribution.collectPayment" type="button">
                  <Radio label="Y">是</Radio>
                  <Radio label="N">否</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col span="6" v-show="formDistribution.collectPayment == 'Y'">
            <FormItem label="代收款金额(元)" prop="paymentAmount" :required="true">
              <Input type="text" v-model="formDistribution.paymentAmount" :number="true" placeholder="代收款金额(元)"></Input>
            </FormItem>
          </Col>
          </Row>
          <Row v-show="formDistribution.onlyOneWareHouse && ( formDistribution.collectPayment == 'Y' || formDistribution.insurance == 'Y' )  ">
            <Col span="24" >
              <Alert style="margin-top:4px" type="warning" show-icon>
                <template slot="desc">
                <span>订单从多个仓库发出,请联系发货人确认代收金额以及保价金额</span>
                </template>
              </Alert>
            </Col>
          </Row>
          </Form>
        </div>
        <div style="font-size:14px;margin-top:26px"><B>订单确认发货之后将生成运单通知物流取货，您确认发货吗？</B></div>

        <div slot="footer">
          <Button type="text" size="large" @click="showConfirm = false">取消</Button>
          <Button type="primary" size="large" @click="doConfirm">确定</Button>
      </div>
    </Modal>

    
  </div>
</template>
<script>
  import orderDeliveryList from './order-delivery-list.vue';
  import swal from 'sweetalert2';
  import dateUtil from 'iview/src/utils/date'
  export default {
    components: {orderDeliveryList},
    data () {

      const insuranceAmount = (rule, value, callback) => {
        if(this.formDistribution.insurance === 'Y'){         
          var reg = new RegExp("^[0-9]+(.[0-9]{0,2})?$");
              if (!reg.test(value) || value<=0) {
                  callback(new Error('保价金额不能为空，且为大于零的、最多为两位小数的正数'));
              }else{callback();}
            }
            callback();
      };
      const paymentAmountCheck = (rule, value, callback) => {
        if(this.formDistribution.collectPayment === 'Y'){          
          var reg = new RegExp("^[0-9]+(.[0-9]{0,2})?$");
              if (!reg.test(value) || value<=0) {
                  callback(new Error('代收款金额不能为空，且为大于零的、最多为两位小数的正数'));
              }else{callback();}
            }
            callback();
      };

      return{
        orderSourceList:[],total:0,pageSize:10,
        showConfirm:false,confirmData:{extOrderCode:'',whOwnerName:'',logisticsVendor:'jingdong',onlyOneWareHouse:false},
        formSearch:{extOrderCode:'',receiverName:'',orderSource:'',orderStartDate:'',orderEndDate:''},
        formDistribution:{insurance:'N',insuranceAmount:'',collectPayment:'N',paymentAmount:'0',distributionId:'',logisticsVendor:''},
        transportList: [
          {type: 'expand', width: 50, render: (h, params) => { return h(orderDeliveryList, {props: { row: params.row }})} },
          {title: '订单编号', key: 'extOrderCode',align: 'center'},
          {title: '订单创建时间', key: 'createdDate',align: 'center', width:200},
          {title: '货主名称', key: 'whOwnerName' ,align: 'center'},
          {title: '收件方名称', key: 'receiverName' ,align: 'center'},
          {title: '订单状态', key: 'statusValue',align: 'center',width: 86},
          {title: '操作',key: 'action',width: 95,align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {props:{type: 'primary',size: 'small'},style: {margin: '2px'},on: {click: () => {this.deliver(params.row)}} }, '生成运单'),
              ]);
            }
          }
        ],
        transportData: [],
        ruleValidate1: {
            wmsStockoutCode:[
                {required: true, message: '仓库出库单号不能为空', trigger: 'blur'},
                {type:'string', max: 50, message: '仓库出库单号必须少于50个字符', trigger: 'blur'}
            ],
            paymentAmount: [{validator:paymentAmountCheck,trigger:'blur'}],
            insuranceAmount: [{validator:insuranceAmount,trigger:'blur'}]
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
          var now = new Date() , nowTime = now.getTime() ,day = now.getDay();
          var oneDayTime = 24*60*60*1000 ; 
          var MondayTime = nowTime - (day-1)*oneDayTime ; 
          var SundayTime =  nowTime + (7-day)*oneDayTime ;
          this.formSearch.orderStartDate = new Date(MondayTime)
          this.formSearch.orderEndDate = new Date(SundayTime)
      },
      //弹出发货页面
      deliver(row){  
          this.$refs['formDistribution'].resetFields();  
          this.$Spin.show()     
          this.$api.doDistributionInfo({"distributionId":row.distributionId,"showLoading":"N"}).then(res => {
              if(res.status == "S"){
                  this.confirmData = res.result
                  this.confirmData.distributionId = row.distributionId;
                  this.confirmData.whOwnerName = row.whOwnerName
                  this.confirmData.receiverName = row.receiverName
                  this.formDistribution.onlyOneWareHouse = res.result.onlyOneWareHouse
                  this.$api.doOrderInfo({"orderId":this.confirmData.orderId,"showLoading":"N"}).then(res => {
                      if(res.status == "S"){
                          this.showConfirm = true;
                          this.formDistribution.logisticsVendor = 'jingdong'
                          this.formDistribution.distributionId = row.distributionId
                          this.formDistribution.insurance = res.result.insurance;
                          this.formDistribution.insuranceAmount = res.result.insuranceAmount;
                          this.formDistribution.collectPayment = res.result.collectPayment;
                          this.formDistribution.paymentAmount = res.result.paymentAmount;
                          this.$Spin.hide()    
                      }else{this.$Spin.hide()    
                        swal('获取订单明细失败', res.result.message, 'error');
                      }
                  })
                 
              }else{this.$Spin.hide()    
                swal('获取分仓信息失败', res.result.message, 'error');
              }
          })
      },
      //发货
      doConfirm(){
          this.formDistribution.showLoading='Y';
           this.$refs['formDistribution'].validate(
              (valid) => {
                  if (valid) {
                      this.$api.doStockOut(this.formDistribution).then(res => {
                          if(res.status == "S"){
                              swal({text: '操作成功!',type: 'success',showCancelButton: false}).then((s)=>{ this.showConfirm = false;this.search();});
                          }else{
                            swal('操作失败', res.result.message, 'error');
                          }
                      })
                  } else {
                      this.$Message.error('表单填写错误');
                  }
            })

          
      },
      search(startIndex,endIndex){
          if(!startIndex) startIndex = this.$table.INIT_START_INDEX;
          if(!endIndex)endIndex = this.$table.INIT_END_INDEX
          let lStartIndex = startIndex;
          let lEndIndex = endIndex;
          let params = {
              startIndex:lStartIndex,
              endIndex:lEndIndex,
              extOrderCode:this.formSearch.extOrderCode,
              orderStartDate:dateUtil.format(this.formSearch.orderStartDate,'yyyy-MM-dd'),
              orderEndDate:dateUtil.format(this.formSearch.orderEndDate,'yyyy-MM-dd'),
              receiverName:this.formSearch.receiverName,
              orderSource:this.formSearch.orderSource === '0000' ? '' : this.formSearch.orderSource,
              distributionStatus:'00'
          }
          if(startIndex*1 == 0 && this.$refs['pager'])this.$refs['pager'].currentPage  = 1;
          this.transportData = []
          this.$api.doOrderDistrbutionList(params).then(res => {
            if(res.status == "S"){
                this.total = res.result.total;
                for(let record of res.result.records){
                  this.transportData = res.result.records;
                }
            }else{
                swal('获取待发货订单失败', res.result.error, 'error');
            }
          })

      },
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

<style>
  .ivu-input-icon-normal+.ivu-input {
    padding-right: 61px;
  }
</style>
