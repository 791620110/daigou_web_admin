<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>
<template>
	<div>
        <Tabs :animated="false" @on-click="tabSwitch">
        <TabPane label="出入库明细">
        	<Table :columns="stockInOutList" :data="stockInOutData"></Table>
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
                stockInOutList: [
                	{
                        title: '单据编号',
                        key: 'invoiceCode',
                        align: 'center'
                    },
                    {
                        title: '行号',
                        key: 'rowNum',
                        align: 'center'
                    },
                    {
                        title: '执行状态',
                        key: 'executionState',
                        align: 'center'
                    },
                    {
                        title: '数量',
                        key: 'quantity',
                        align: 'center'
                    },
                    {
                        title: '含税价格',
                        key: 'price',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '含税金额',
                        key: 'totalAmount',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '批号',
                        key: 'lotNo',
                        align: 'center'
                    },
                    {
                        title: '有效日期',
                        key: 'expiryDate',
                        align: 'center'
                    },
                    {
                        title: '生产日期',
                        key: 'productionDate',
                        align: 'center'
                    }
                ],
                stockInOutData: [],
            }
        },
        methods: {
            tabSwitch(target){
            
            },
            getStockInOutDetails(){
            	let params = {
                  goodsCode:this._props.row.whGoodsCode
                }
            	this.$api.getStockInOutDetails(params).then(res => {
                  if(res.status == "S"){
                      this.stockInOutData = [];
                      for(let record of res.result.records){
                      	  if(record){
                      	  	 if(record.executionState == "02"){
                      	  	 	record.executionState ="是";
                      	  	 }
                      	  	 if(record.executionState != "02"){
                      	  	 	record.executionState ="否";
                      	  	 }
                      	  }
                      	  this.stockInOutData.push(record);
                      }
                  }
                });
        	}
    	},
    	created(){
    		this.getStockInOutDetails();
    	}
    };
</script>
