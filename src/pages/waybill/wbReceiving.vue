<style>
    .ivu-table .demo-table-info-row td{
        background-color: #2db7f5;
        color: #fff;
    }
    .ivu-table .demo-table-error-row td{
        background-color: #ff6600;
        color: #fff;
    }
    .ivu-table td.demo-table-info-column{
        background-color: #2db7f5;
        color: #fff;
    }
    .ivu-table .demo-table-info-cell-name {
        background-color: #2db7f5;
        color: #fff;
    }
    .ivu-table .demo-table-info-cell-age {
        background-color: #ff6600;
        color: #fff;
    }
    .ivu-table .demo-table-info-cell-address {
        background-color: #187;
        color: #fff;
    }
</style>
<template>
 <div>
    <Breadcrumb>
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>运单管理</BreadcrumbItem>
      <BreadcrumbItem>待收货运单</BreadcrumbItem>
    </Breadcrumb>
    <h3 class="box-title" slot="header" style="width: 100%;">
    <Form :model="formWaybillSearch" :label-width="100" style="margin-top: 20px" ref="formWaybillSearch">
 		   
        <Row>
          <Col span="20">
          <Col span="8">
          <FormItem label="运单编号">
            <Input v-model="formWaybillSearch.deliveryId" placeholder="请输入运单编号"></Input>
          </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="物流公司" >
              <Select v-model="formWaybillSearch.vendor" >
                <Option value="jingdong">京东快递</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="出库单编号">
            <Input v-model="formWaybillSearch.invoiceCode" placeholder="请输入出库单编号"></Input>
          </FormItem>
          </Col>
          </Col>
          <Col span="4">
          <Button type="ghost" style="float:right;margin:4px;" @click="doSearchReset('formWaybillSearch')">重置</Button>
          <Button type="primary" style="float:right;margin:4px;" @click="doSearch()">查询</Button>
          </Col>
        </Row>
        <Row>
          <Col span="20">
          <Col span="16">
          <FormItem label="下单日期">
            <DatePicker v-model="formWaybillSearch.startDate" type="date" placeholder="开始日期"  style="width:135px"></DatePicker>
            ~
            <DatePicker v-model="formWaybillSearch.endDate" type="date" placeholder="结束日期"  style="width:135px"></DatePicker>
          </FormItem>
          </Col>
          </Col>
        </Row>
      </Form>
    </h3>
    <Table :columns="columns10" :data="waybillList"></Table>
    <Page :total="total" :page-size="pageSize" size="small"  show-elevator show-sizer show-total style="float: right;margin-top: 10px" @on-change="doPageChange"></Page>
 </div>
</template>
<script>
	import Vue from "vue";
    import panel from "../../components/panel.vue";
    import * as api from "../../api";
    import apiConfig from "../../api/apiConfig.js";
    import swal from 'sweetalert2';
    import expandRow from './wbtrace-expand.vue';
    export default {
        components: { expandRow,'imp-panel': panel },
        data () {
            return {
            	formWaybillSearch:{deliveryId:'',invoiceCode:'',vendor:'jingdong',status:'ALL',startDate:'',endDate:''},
            	total:0, pageSize:10, initStartIndex:0, initEndIndex:10,
                columns10: [
                    {
                        type: 'expand',
                        title: '',
                        width: 50,
                        align: 'center',
                        render: (h, params) => {
                            return h(expandRow, {
                                props: {
                                    row: params.row
                                }
                            })
                        }
                    },
                    {
                        title: '运单编号',
                        key: 'waybillCode',
                        width:150,
                        align: 'center'
                    },
                    {
                        title: '物流公司',
                        key: 'vendorLabel',
                        align: 'center'
                    },
                    {
                        title: '出库单编号',
                        key: 'wmsStockoutCode',
                        align: 'center'
                    },
                    {
                        title: '运单生成日期',
                        key: 'orderSendTime',
                        align: 'center'
                    },
                    {
                        title: '收件人',
                        key: 'receiveName',
                        align: 'center'
                    }
                ],
                waybillList: []
            }
        },
        methods: {
            doSearchReset(){
                for(let field in this.formWaybillSearch){
                	if(field =='vendor'){
                		this.formWaybillSearch.vendor='jingdong'
            		}else{
                		this.formWaybillSearch[field] = '';
                	}
          		}
                var now = new Date() , nowTime = now.getTime() ,day = now.getDay();
                var oneDayTime = 24*60*60*1000 ; 
                var MondayTime = nowTime - (day-1)*oneDayTime ; 
                var SundayTime =  nowTime + (7-day)*oneDayTime ;

                this.formWaybillSearch.startDate = new Date(MondayTime)
                this.formWaybillSearch.endDate = new Date(SundayTime)
            },
            doSearch(target){
                this.loadData();
            },
            loadData(){
                this.doWaybillList(this.initStartIndex,this.initEndIndex);
            },
            //change page number
            doPageChange(pagenumber){
                let startIdx = ( pagenumber - 1 ) * this.pageSize;
                let endIdx = pagenumber * this.pageSize;
                this.doWaybillList(startIdx,endIdx);
            },
            doWaybillList(startIndex,endIndex){
            	let lStartIndex = startIndex,lEndIndex = endIndex;
                let params = {
                  startIndex:lStartIndex,
                  endIndex:lEndIndex,
                  startDate:this.formWaybillSearch.startDate==''?'':this.formWaybillSearch.startDate.getTime(),
                  endDate:this.formWaybillSearch.endDate==''?'':this.formWaybillSearch.endDate.getTime(),
                  status:'06',
                  waybillCode:this.formWaybillSearch.deliveryId,
                  vendor:this.formWaybillSearch.vendor,
                  invoiceCode:this.formWaybillSearch.invoiceCode
                }
                this.$api.doWaybillList(params).then(res => {
                if(res.status == "S"){
                  this.total = res.result.total;
                  this.waybillList = [];
                  for(let record of res.result.records){
                  	if(record){
                  		if("jingdong"==record.vendor){
                			record.vendorLabel = "京东物流";
                  		}
                	}
                    this.waybillList.push(record);
                  }
                }else{
                  swal('获取运单列表失败', res.result.error, 'error');
                }
              })
        	}
    	},
    	created(){this.doSearchReset();this.loadData();}
    }
</script>

