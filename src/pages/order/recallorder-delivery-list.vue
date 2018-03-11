<style>
    .badge-alone{
        background: #19be6b !important;
    }
</style>
<template>
  <div> 
    <Tabs :animated="true" style="min-height:200px"> 
    	<TabPane label="分仓单药品">
        		<Table :columns="medicineList" :data="medicineListData"></Table>
        </TabPane> 
    	<TabPane label="分仓单基本信息">
          	<Row style="margin-left:4px;font-size:13px">
	          <Col span="3" style="text-align: right;">
		          <span><B>分仓单状态：</B></span>
		      </Col>
		      <Col span="5" style="text-align: left;">
		          <span v-if="this.showTab=='N' && row.status=='00'">未处理</span>
		          <span v-if="this.showTab=='N' && row.status=='01'">已出库</span>
		          <span v-if="this.showTab=='N' && row.status=='02'">已取消</span>
		          <span v-if="this.showTab=='Y' && row.distributionStatus=='00'">未处理</span>
		          <span v-if="this.showTab=='Y' && row.distributionStatus=='01'">已出库</span>
		          <span v-if="this.showTab=='Y' && row.distributionStatus=='02'">已取消</span>
		          <span  v-if="!(this.showTab=='N' && row.status=='00')
		          	&&!(this.showTab=='N' && row.status=='01')
		          	&&!(this.showTab=='N' && row.status=='02')
		          	&&!(this.showTab=='Y' && row.distributionStatus=='00')
		          	&&!(this.showTab=='Y' && row.distributionStatus=='01')
		          	&&!(this.showTab=='Y' && row.distributionStatus=='02')">-/-</span>
	          </Col>
	           <Col span="3" style="text-align: right;">
		          <span><B>WMS出库单号：</B></span>
		      </Col>
		      <Col span="5" style="text-align: left;">
		          <span>{{row.wmsStockoutCode==null ? '-/-' : row.wmsStockoutCode}}&nbsp;</span>
	          </Col>
	          <Col span="3" style="text-align: right;">
		          <span><B>物流公司：</B></span>
		      </Col>
		      <Col span="5" style="text-align: left;">
		      	  <span v-if="row.logisticsVendor==null">-/-</span>
		          <span v-if="row.logisticsVendor=='jingdong'">京东物流</span>
	          </Col>
	        </Row>
	        <BR/>
	        <Row style="margin-left:4px;font-size:13px">
	          <Col span="3" style="text-align: right;">
		          <span><B>保价：</B></span>
		      </Col>
		      <Col span="5" style="text-align: left;">
		          <span v-if="row.insurance=='Y'">是 ( 保价 : {{row.insuranceAmount}} 元 )</span>
		          <span v-if="row.insurance=='N'">否</span>
		          <span v-if="row.insurance==null">-/-</span>
	          </Col>
	           <Col span="3" style="text-align: right;">
		          <span><B>代收款：</B></span>
		      </Col>
		      <Col span="5" style="text-align: left;">
		          <span v-if="row.collectPayment=='Y'">是 ( 代收款 : {{row.paymentAmount}} 元 )</span>
		          <span v-if="row.collectPayment=='N'">否</span>
		          <span v-if="row.collectPayment==null">-/-</span>
	          </Col>
	        </Row>
        </TabPane>    
        
        <TabPane label="订单取消申请审批信息"  v-if=" this.showTab=='Y' ">
	        <Row style="margin-left:4px;font-size:13px">
	          <Col span="3" style="text-align: right;">
		          <span><B>申请时间：</B></span>
		      </Col>
		      <Col span="5" style="text-align: left;">
		          <span>{{row.cancelledRequestDate}}&nbsp;</span>
	          </Col>
	          <Col span="3" style="text-align: right;">
		          <span><B>审批时间：</B></span>
		      </Col>
		      <Col span="5" style="text-align: left;">
		          <span>{{row.cancelledResponseDate==null ? '-/-' : row.cancelledResponseDate}}&nbsp;</span>
	          </Col>
	          <Col span="3" style="text-align: right;">
		          <span><B>申请状态：</B></span>
		      </Col>
		      <Col span="5" style="text-align: left;">
		          <span v-if="row.cancelledStatus=='00'"><Tag color="yellow">申请中</Tag></span>
		          <span v-if="row.cancelledStatus=='01'"><Tag color="green">同意</Tag></span>
		          <span v-if="row.cancelledStatus=='02'"><Tag color="red">拒绝</Tag></span>
	          </Col>
	          
	          
	        </Row>
			<BR/>
	        <Row style="margin-left:4px;font-size:13px">
	           <Col span="3" style="text-align: right;">
		          <span><B>审批备注：</B></span>
		      </Col>
		      <Col span="20" style="text-align: left;">
		          <span>{{row.cancelledResponseRemark}}</span>
	          </Col>
	        </Row>
        </TabPane>      
    </Tabs>
  </div>
</template>
<script>
	import swal from 'sweetalert2'
    export default {
        props: {row: Object,request:false},
        data () {
            return {
              orderData:{senderName:''},showTab:this._props.request ? 'N' : 'Y',
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
            	if(this._props.row.distributionId!=null){
	                this.$api.doDistributionInfo({"distributionId":this._props.row.distributionId,"showLoading":"Y"}).then(res => {
	                    if(res.status == "S"){
	                        this.medicineListData = res.result.details
	                    }else{
	                      swal('获取分仓单详细信息失败', res.message, 'error');
	                    }
	                })
                }else{
                	this.medicineListData = this._props.row.details
                }
            }        	
        },
        created(){this.init();}
    };
</script>
