<style>
    .badge-alone{
        background: #19be6b !important;
    }
</style>
<template>
  <div> 
    <Tabs :animated="false" style="min-height:200px">
        <TabPane label="出库药品">
          <Table :columns="medicineList" :data="medicineListData"></Table>
        </TabPane>   
        <TabPane label="订单基本信息">          
            <Row style="margin-left:4px;font-size:13px">
            <Col span="2" style="text-align: right;">
              <span><B>发货方名称：</B></span>
          </Col>
          <Col span="7" style="text-align: left;">
              <span>{{orderData.senderName}}</span>
            </Col>
             <Col span="2" style="text-align: right;">
              <span><B>联系人：</B></span>
          </Col>
          <Col span="4" style="text-align: left;">
              <span>{{orderData.senderPerson}}</span>
            </Col>
             <Col span="2" style="text-align: right;">
              <span><B>联系电话：</B></span>
          </Col>
          <Col span="4" style="text-align: left;">
              <span>{{orderData.senderMobile}}</span>
            </Col>
          </Row>
          <BR/>
          <Row style="margin-left:4px;font-size:13px">
            <Col span="2" style="text-align: right;">
              <span><B>订单编号：</B></span>
          </Col>
          <Col span="7" style="text-align: left;">
              <span>{{orderData.extOrderCode}}</span>
            </Col>  
            
            <Col span="2" style="text-align: right;">
              <span><B>保价：</B></span>
          </Col>
          <Col span="4" style="text-align: left;">
            <span v-show="orderData.insurance=='Y'">是 ( 保价 : {{orderData.insuranceAmount}} 元 )</span>
            <span v-show="orderData.insurance=='N'">否</span>
            </Col>
            <Col span="2" style="text-align: right;">
              <span><B>代收款：</B></span>
          </Col>
          <Col span="4" style="text-align: left;">
            <span v-show="orderData.collectPayment=='Y'">是 ( 代收款 : {{orderData.paymentAmount}} 元 )</span>
            <span v-show="orderData.collectPayment=='N'">否</span>
            </Col>
          </Row>
          <BR/>
          <Row style="margin-left:4px;font-size:13px">
             <Col span="2" style="text-align: right;">
              <span><B>备注：</B></span>
          </Col>
          <Col span="20" style="text-align: left;">
              <span>{{orderData.remarks}}</span>
            </Col>
          </Row>
        </TabPane> 
        <TabPane label="订单地址(收货)详情" name="address">
          <Row style="margin-left:4px;font-size:13px">
            <Col span="2" style="text-align: right;">
                <span><B>收货方名称：</B></span>
            </Col>
            <Col span="7" style="text-align: left;">
                <span>{{orderData.receiverName}}</span>
              </Col>
              <Col span="2" style="text-align: right;">
                <span><B>联系人：</B></span>
            </Col>
            <Col span="4" style="text-align: left;">
                <span>{{orderData.receiverPerson}}</span>
              </Col>
              <Col span="2" style="text-align: right;">
                <span><B>联系电话：</B></span>
            </Col>
            <Col span="4" style="text-align: left;">
                <span>{{orderData.receiverMobile}}</span>
              </Col>            
            </Row>
            <BR/>
            <Row style="margin-left:4px;font-size:13px">
               <Col span="2" style="text-align: right;">
                <span><B>详细地址：</B></span>
            </Col>
            <Col span="20" style="text-align: left;">
                <span>{{orderData.receiverProvince}} {{orderData.receiverCity}} {{orderData.receiverDistrict}} {{orderData.receiverAddress}}&nbsp;&nbsp;&nbsp;&nbsp;{{orderData.receiverPostcode}}</span>
              </Col>
          </Row>
        </TabPane>      
    </Tabs>
  </div>
</template>
<script>
  export default {
        props: {row: Object},
        data () {
            return {
              orderData:{senderName:''},
              medicineList: [	
		              {title: '药品编号', key: 'medicineCode', align: 'center' },
                  {title: '药品名称', key: 'medicineName', align: 'center'},
                  {title: '规格',key: 'medicineSpec',align: 'center'},
                  {title: '包装(件)',key: 'medicinePackages',align: 'center',width: 90},
                  {title: '批准文号',key: 'licenseCode',align: 'center'},
                  {title: '生产厂家',key: 'medicineFactory',align: 'center'},
                  {title: '数量', key: 'totalNumber',  align: 'center',width:65},  
		        ],
		        medicineListData: [],        
            }
        },
        methods:{
            init(){
                this.$api.doDistributionInfo({"distributionId":this._props.row.distributionId,"showLoading":"N"}).then(res => {
                    if(res.status == "S"){
                        this.medicineListData = res.result.details
                    }else{
                      swal('获取订单明细失败', res.result.message, 'error');
                    }
                })
                this.$api.doOrderInfo({"orderId":this._props.row.orderId,"showLoading":"Y"}).then(res => {
                    if(res.status == "S"){
                        this.orderData = res.result
                    }else{
                      swal('获取订单明细失败', res.result.message, 'error');
                    }
                })
            }        	
        },
        created(){this.init()}
    };
</script>
