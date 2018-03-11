<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>
<template>
	<div>
        <Tabs :animated="false" @on-click="tabSwitch">
        <TabPane label="运单详情">
        <Row class="expand-row">
            <Col span="8">
                <span class="expand-key">发件人：</span>
                <span class="expand-value">{{waybillDetail.senderName}}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">发件人电话：</span>
                <span class="expand-value">{{ waybillDetail.senderMobile }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">运单备注：</span>
                <span class="expand-value">{{ waybillDetail.remark }}</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="8">
                <span class="expand-key">收件人：</span>
                <span class="expand-value">{{ waybillDetail.receiveName }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">收件人电话：</span>
                <span class="expand-value">{{ waybillDetail.receiveMobile }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">详细地址：</span>
                <span class="expand-value">{{ waybillDetail.receiveAddress }}</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="8">
                <span class="expand-key">重量：</span>
                <span class="expand-value">{{ waybillDetail.weight }} KG</span>
            </Col>
            <Col span="8">
                <span class="expand-key">体积：</span>
                <span class="expand-value">{{ waybillDetail.vloum }} CM3</span>
            </Col>
            <Col span="8">
                <span class="expand-key">包裹数量：</span>
                <span class="expand-value">{{ waybillDetail.packageCount }}</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="8">
                <span class="expand-key">是否代收货款：</span>
                <span class="expand-value" v-if="waybillDetail.collectionValue == '1'">是</span>
                <span class="expand-value" v-if="waybillDetail.collectionValue != '1'">否</span>
            </Col>
            <Col span="8">
                <span class="expand-key">代收金额：</span>
                <span class="expand-value">{{ waybillDetail.collectionMoney }} 元</span>
            </Col>
            <Col span="8">
                <span class="expand-key">配送产品类型：</span>
                <span class="expand-value" v-if="waybillDetail.goodsType == '1'">普通</span>
                <span class="expand-value" v-if="waybillDetail.goodsType == '3'">填仓</span>
                <span class="expand-value" v-if="waybillDetail.goodsType == '4'">特配</span>
                <span class="expand-value" v-if="waybillDetail.goodsType == '6'">控温</span>
                <span class="expand-value" v-if="waybillDetail.goodsType == '7'">冷藏</span>
                <span class="expand-value" v-if="waybillDetail.goodsType == '8'">冷冻</span>
                <span class="expand-value" v-if="waybillDetail.goodsType == '9'">深冷</span>
            </Col>
        </Row>
        <Row class="expand-row">
        	<Col span="8">
                <span class="expand-key">是否保价：</span>
                <span class="expand-value" v-if="waybillDetail.guaranteeValue == '1'">是</span>
                <span class="expand-value" v-if="waybillDetail.guaranteeValue != '1'">否</span>
            </Col>
            <Col span="8">
                <span class="expand-key">保价金额金额：</span>
                <span class="expand-value">{{ waybillDetail.guaranteeAmount }} 元</span>
            </Col>
        </Row>
		</TabPane>

		<TabPane label="出库单详情">
        	<Table :columns="stockOutList" :data="stockOutData"></Table>
		</TabPane>

    </Tabs>
	</div>
</template>
<script>
    import Vue from "vue";
    import panel from "../../components/panel.vue";
    import * as api from "../../api";
    import apiConfig from "../../api/apiConfig.js";
    import swal from 'sweetalert2';
    export default {
    	props: {
            row: Object
        },
        data () {
            return {
            	modelWaybill: false,
				waybillDetail: [],
                stockOutList: [
                    {
                        title: '货主标识',
                        key: 'ownerCode',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '货品编号',
                        key: 'medicineCode',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '货品名称',
                        key: 'medicineName',
                        align: 'center'
                    },
                    {
                        title: '货品数量',
                        key: 'totalNumber',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '件装',
                        key: 'medicinePackages',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '批号',
                        key: 'licenseCode',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '生产厂家',
                        key: 'medicineFactory',
                        align: 'center'
                    }
                ],
                stockOutData: [],
            }
        },
        methods: {
        	getWaybillInfo(){
        		let params = {
                  waybillCode:this._props.row.waybillCode,
                  vendor:this._props.row.vendor
                }
            	this.$api.getWaybillInfo(params).then(res => {
                  if(res.status == "S"){
                      this.formWaybill = res.result.record;
                      this.waybillDetail = res.result.record;
                  }else{
                      swal({text: '未查询到运单信息',type: 'error',showCancelButton: false,width:300});
                  }
                });
        	},
            tabSwitch(target){
            	if(target == '0'){
            		this.getWaybillInfo();
            	}
            	if(target == '1'){
            		if(this._props.row.distributionId !=null){
            			this.getStockOutDetail(this._props.row.distributionId);
            		}
            	}
            },
            getStockOutDetail(code){
            	let params = {
                  distributionId:code
                }
                this.$api.getStockOutDetails(params).then(res => {
                if(res.status == "S"){
                  this.stockOutData = [];
                  for(let record of res.result.records){
                  	if(record){
                  	  record.ownerCode = res.result.ownerCode;
                  	}
                    this.stockOutData.push(record);
                  }
                }
                })
        	}
    	},
    	created(){
    		this.getWaybillInfo();
    	}
    };
</script>
