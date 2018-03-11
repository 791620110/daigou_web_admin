<template>
	<Tabs :animated="false" style="min-height:200px">
        <TabPane label="订单跟踪">
<BR/><BR/>
    		<Steps :current="1" direction="horizontal" v-if="row.status == '01' && this.orderData.cancelledStatus!='A'">		        
		        <Step title="订单已提交" content="订单已通过云仓平台提交"  style="width:500px"></Step>
		        <Step title="订单待分仓" content="订单尚未分仓，请您通过【待分仓订单】对药品进行分仓操作"></Step>
		        <Step title="订单待出库" content="订单尚未分拣出库"></Step>
		        <Step title="订单待取货" content="订单尚未取货"></Step>
		        <Step title="订单待送达" content="订单尚未送达"></Step>		        
		    </Steps>
		    <Steps :current="2" direction="horizontal" v-if="row.status == '02' && this.orderData.cancelledStatus!='A'">		        
		        <Step title="订单已提交" content="订单已通过云仓平台提交"></Step>
		        <Step title="订单已分仓" content="订单已完成分仓"></Step>
		        <Step title="订单待出库" content="订单尚未分拣出库,等待仓库人员分拣出库"></Step>
		        <Step title="订单待取货" content="订单尚未取货"></Step>
		        <Step title="订单待送达" content="订单尚未送达"></Step>		        
		    </Steps>
		    <Steps :current="3" direction="horizontal" v-if="row.status == '03' && this.orderData.cancelledStatus!='A'">		        
		        <Step title="订单已提交" content="订单已通过云仓平台提交"></Step>
		        <Step title="订单已分仓" content="订单已完成分仓"></Step>
		        <Step title="订单已出库" content="订单已完成分拣出库"></Step>	
		        <Step title="订单待取货" content="订单尚未取货,等待物流公司取货"></Step>
		        <Step title="订单待送达" content="订单尚未送达"></Step>		        
		    </Steps>

		    <Steps :current="4" direction="horizontal" v-if="row.status == '04' && this.orderData.cancelledStatus!='A'">		        
		        <Step title="订单已提交" content="订单已通过云仓平台提交"  style="width:500px"></Step>
		        <Step title="订单已分仓" content="订单已完成分仓"></Step>
		        <Step title="订单已出库" content="订单已完成分拣出库"></Step>
		        <Step title="订单已取货" content="订单已完成取货"></Step>
		        <Step title="订单待送达" content="订单已取货,等待物流送达收客户"></Step>
		    </Steps>



		    <Steps :current="1" direction="horizontal" v-if="row.status == '01' && this.orderData.cancelledStatus=='A'" status="error">		        
		        <Step title="订单已提交" content="订单已通过云仓平台提交"  style="width:500px"></Step>
		        <Step title="订单已取消" content="订单已经全部取消"></Step>
		        <Step title="订单待分仓" content="订单尚未分仓，请您通过【待分仓订单】对药品进行分仓操作"></Step>
		        <Step title="订单待出库" content="订单尚未分拣出库"></Step>
		        <Step title="订单待取货" content="订单尚未取货"></Step>
		        <Step title="订单待送达" content="订单尚未送达"></Step>		        
		    </Steps>
		    <Steps :current="2" direction="horizontal" v-if="row.status == '02' && this.orderData.cancelledStatus=='A'" status="error">		        
		        <Step title="订单已提交" content="订单已通过云仓平台提交"  style="width:500px"></Step>
		        <Step title="订单已分仓" content="订单已完成分仓"></Step>
		        <Step title="订单已取消" content="订单已经全部取消"></Step>
		        <Step title="订单待出库" content="订单尚未分拣出库,等待仓库人员分拣出库"></Step>
		        <Step title="订单待取货" content="订单尚未取货"></Step>
		        <Step title="订单待送达" content="订单尚未送达"></Step>		        
		    </Steps>
		    <Steps :current="3" direction="horizontal" v-if="row.status == '03' && this.orderData.cancelledStatus=='A'" status="error">
		        <Step title="订单已提交" content="订单已通过云仓平台提交"></Step>
		        <Step title="订单已分仓" content="订单已完成分仓"></Step>
		        <Step title="订单已出库" content="订单已完成分拣出库"></Step>
		        <Step title="订单已取消" content="订单已经全部取消"></Step>		        
		        <Step title="订单待取货" content="订单尚未取货,等待物流公司取货"></Step>
		        <Step title="订单待送达" content="订单尚未送达"></Step>		        
		    </Steps>

		    <Steps :current="4" direction="horizontal" v-if="row.status == '04' && this.orderData.cancelledStatus=='A'" status="error">		        
		        <Step title="订单已提交" content="订单已通过云仓平台提交"  style="width:500px"></Step>
		        <Step title="订单已分仓" content="订单已完成分仓"></Step>
		        <Step title="订单已出库" content="订单已完成分拣出库"></Step>
		        <Step title="订单已取货" content="订单已完成取货"></Step>
		        <Step title="订单已取消" content="订单已经全部取消"></Step>
		        <Step title="订单待送达" content="订单已取货,等待物流送达收客户"></Step>		        
		    </Steps>

		    <Steps :current="4" direction="horizontal" v-if="row.status == '05'">		        
		        <Step title="订单已提交" content="订单已通过云仓平台提交"  style="width:500px"></Step>
		        <Step title="订单已分仓" content="订单已完成分仓"></Step>
		        <Step title="订单已出库" content="订单已完成分拣出库"></Step>
		        <Step title="订单已取货" content="订单已完成取货"></Step>
		        <Step title="订单已签收" content="订单已送达,客户已经签收订单"></Step>		        
		    </Steps>

		    <Steps :current="4" direction="horizontal" v-if="row.status == '06'">		        
		        <Step title="订单已提交" content="订单已通过云仓平台提交"  style="width:500px"></Step>
		        <Step title="订单已分仓" content="订单已完成分仓"></Step>
		        <Step title="订单已出库" content="订单已完成分拣出库"></Step>
		        <Step title="订单已取货" content="订单已完成取货"></Step>
		        <Step title="订单已拒签收" content="订单已送达,但客户拒收"></Step>		        
		    </Steps>

        </TabPane>
        <TabPane label="订单基本信息">
        	<Row style="margin-left:4px;font-size:13px">
	          <Col span="2" style="text-align: right;">
		          <span><B>发货方名称：</B></span>
		      </Col>
		      <Col span="7" style="text-align: left;">
		          <span>{{row.senderName}}</span>
	          </Col>
	           <Col span="2" style="text-align: right;">
		          <span><B>联系人：</B></span>
		      </Col>
		      <Col span="4" style="text-align: left;">
		          <span>{{row.senderPerson}}</span>
	          </Col>
	           <Col span="2" style="text-align: right;">
		          <span><B>联系电话：</B></span>
		      </Col>
		      <Col span="4" style="text-align: left;">
		          <span>{{row.senderMobile}}</span>
	          </Col>
	        </Row>
	        <BR/>
	        <Row style="margin-left:4px;font-size:13px">
	          <Col span="2" style="text-align: right;">
		          <span><B>订单编号：</B></span>
		      </Col>
		      <Col span="7" style="text-align: left;">
		          <span>{{row.extOrderCode}}</span>
	          </Col>	
	          
	          <Col span="2" style="text-align: right;">
		          <span><B>保价：</B></span>
		      </Col>
		      <Col span="4" style="text-align: left;">
		      	<span v-show="row.insurance=='Y'">是 ( 保价 : {{row.insuranceAmount}} 元 )</span>
		      	<span v-show="row.insurance=='N'">否</span>
	          </Col>
	          <Col span="2" style="text-align: right;">
		          <span><B>代收款：</B></span>
		      </Col>
		      <Col span="4" style="text-align: left;">
		      	<span v-show="row.collectPayment=='Y'">是 ( 代收款 : {{row.paymentAmount}} 元 )</span>
		      	<span v-show="row.collectPayment=='N'">否</span>
	          </Col>
	        </Row>
	        <BR/>
	        <Row style="margin-left:4px;font-size:13px">
	           <Col span="2" style="text-align: right;">
		          <span><B>备注：</B></span>
		      </Col>
		      <Col span="20" style="text-align: left;">
		          <span>{{row.remarks}}</span>
	          </Col>
	        </Row>
		</TabPane>
        <TabPane label="订单地址(收货)详情">
        	<Row style="margin-left:4px;font-size:13px">
	          <Col span="2" style="text-align: right;">
		          <span><B>收货方名称：</B></span>
		      </Col>
		      <Col span="7" style="text-align: left;">
		          <span>{{row.receiverName}}</span>
	          </Col>
	          <Col span="2" style="text-align: right;">
		          <span><B>联系人：</B></span>
		      </Col>
		      <Col span="4" style="text-align: left;">
		          <span>{{row.receiverPerson}}</span>
	          </Col>
	          <Col span="2" style="text-align: right;">
		          <span><B>联系电话：</B></span>
		      </Col>
		      <Col span="4" style="text-align: left;">
		          <span>{{row.receiverMobile}}</span>
	          </Col>	          
	        </Row>
	        <BR/>
	        <Row style="margin-left:4px;font-size:13px">
	           <Col span="2" style="text-align: right;">
		          <span><B>详细地址：</B></span>
		      </Col>
		      <Col span="20" style="text-align: left;">
		          <span>{{row.receiverProvince}} {{row.receiverCity}} {{row.receiverDistrict}} {{row.receiverAddress}}&nbsp;&nbsp;&nbsp;&nbsp;{{row.receiverPostcode}}</span>
	          </Col>
	        </Row>
        </TabPane>
        <TabPane label="订单药品信息">
        	<Table :columns="columns" :data="columnsdata"></Table>
        </TabPane>
        <TabPane label="分仓详情" v-if="hasDistribution">
        	<Tabs>
	        	<TabPane :label="item.label" v-for="item in distributionData">
	        		<Row style="margin-left:4px;font-size:13px">
			          <Col span="2" style="text-align: right;">
				          <span><B>出库单号：</B></span>
				      </Col>
				      <Col span="5" style="text-align: left;">
				          <span v-if="item.wmsStockoutCode!=null">{{item.wmsStockoutCode}}</span>
				          <span v-if="item.wmsStockoutCode==null">-/-</span>
			          </Col>
			        </Row>
	        		<Table :columns="columns2" :data="item.details"></Table>
			    </TabPane>
		    </Tabs>
        </TabPane>
        <TabPane label="物流信息" v-if="hasDistribution && hasWaybill">
        	<Tabs  @on-click="subwaybillTrace">
	        	<TabPane :label="item.whName+'[ '+item.vendorName+':'+item.waybillCode+' ]'" v-for="item in wayBillArray">

	        		<span v-if="!currentWaybillList || currentWaybillList.length == 0">暂无物流信息，请稍后再试。 </span>
			        <Timeline>
		    			<TimelineItem color="green" v-for="(trace,index) in currentWaybillList" >
		    			<Icon type="flag" slot="dot" v-if="index==0"></Icon>
		    			<span>{{trace.opeTitle}}，{{trace.opeRemark}}<br/>{{trace.opeTime}}</span>
		    			</TimelineItem>
		    		</Timeline>

			    </TabPane>
		    </Tabs>
        </TabPane>
    </Tabs>
    
</template>
<script>
    export default {
        props: {
            row: Object
        },
        data () {
            return {
                columns: [
                    {title: '药品编码 - 药品名称 - 规格 - 批准文号 - 单位 - 剂型 - 生产厂家', key: 'medicineCode', align: 'center', width: '60%' , render: (h, params) => {
			          	return params.row.medicineCode+" - "+params.row.medicineName+" - "+params.row.medicineSpec+" - "+
			          	params.row.licenseCode+" - "+params.row.medicineUnit+" - "+params.row.medicineShape+" - "+params.row.medicineFactory;} 
			        },
                    {title: '批号',key: 'batchNo',align: 'center'},
                    {title: '单价',key: 'medicinePrice',align: 'center',render: (h, params) => {return new Number(params.row.medicinePrice).toFixed(2)}},
                    {title: '订单数量',key: 'totalNumber',align: 'center'}
                ],columnsdata:[],
                columns2: [
                    {title: '药品编码 - 药品名称 - 规格 - 批准文号 - 单位 - 剂型 - 生产厂家', key: 'medicineCode', align: 'center', width: '70%' , render: (h, params) => {
			          	return params.row.medicineCode+" - "+params.row.medicineName+" - "+params.row.medicineSpec+" - "+
			          	params.row.licenseCode+" - "+params.row.medicineUnit+" - "+params.row.medicineShape+" - "+params.row.medicineFactory;} 
			        },
                    {title: '批号',key: 'batchNo',align: 'center'},
                    {title: '分仓数量',key: 'totalNumber',align: 'center',width: 90}
                ],distributionData:[],orderData:{}, stepType:'process',hasDistribution:false ,
                hasWaybill:false ,wayBillArray:[],currentWaybillList:[]
            }
        },
        methods: {
            waybillTrace(target){
            	if(target == '5'){
            		this.doWaybillTrace(0);
            	}         	
            },
            subwaybillTrace(target){
            	this.doWaybillTrace(target);
            },
            doWaybillTrace(target){
        		let params = {waybillCode:this.wayBillArray[target].waybillCode, vendor:this.wayBillArray[target].vendor};
                this.$api.doWaybillTrace(params).then(res => {
	                if(res.status == "S"){
		                this.currentWaybillList = res.result.records
	                }else{
	                  	swal('获取运单信息失败', res.result.message, 'error');
	                }
                })
        	}
        },
        created(){
        	
			this.$api.doOrderInfo({"orderId":this._props.row.orderId,"showLoading":"N"}).then(res => {
                if(res.status == "S"){
                    this.columnsdata = res.result.details
                    this.orderData = res.result
                    this.stepType = this.orderData.cancelledStatus=='A' ? 'error':'process'
                }else{
                  	swal('获取订单明细失败', res.result.message, 'error');
                }
            })
            if(this._props.row.status >= "02"*1){
            	this.hasDistribution = true
	            this.$api.doOrderDistributionInfo({"orderId":this._props.row.orderId,"showLoading":"N"}).then(res => {
	                if(res.status == "S"){
	                    this.distributionData = res.result
	                    for(var i in res.result){
	                    	let item = res.result[i];
	                    	item.label=(h) => {
	                    	if(item.cancelledStatus == '01'){
		                    	return h('div',[h('span', item.whName),h('A',{style:{'color':'red'}},' [已取消]')])
		                    }else{
		                    	return h('div',[h('span', item.whName)])
		                    }

	                }
	                    }
	                }else{
	                  	swal('获取订单分仓信息失败', res.result.message, 'error');
	                }
	            })
            }else{
            	this.hasDistribution = false
            }
        }
    };
</script>
