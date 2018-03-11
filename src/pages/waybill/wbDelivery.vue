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
      <BreadcrumbItem>完成取件</BreadcrumbItem>
    </Breadcrumb>
    <h3 class="box-title" slot="header" style="width: 100%;">
    <Form :model="formConfirmSearch" :label-width="80" style="margin-top: 20px" ref="formConfirmSearch">
 		    <Row>          
          <Col span="20">
          <Col span="8">
            <FormItem label="运单编号">
              <Input v-model="formConfirmSearch.waybillCode" style="width:187px" placeholder="请输入运单编号"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="物流公司" >
              <Select v-model="formConfirmSearch.vendor" >
                <Option value="jingdong">京东快递</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="出库单编号">
            <Input v-model="formConfirmSearch.invoiceCode" style="width:187px" placeholder="请输入出库单编号"></Input>
          </FormItem>
          </Col>
          </Col>
          <Col span="4">
          <Button type="ghost" style="float:right;margin:4px;" @click="doSearchReset('formConfirmSearch')">重置</Button>
          <Button type="primary" style="float:right;margin:4px;" @click="doSearch()">查询</Button>
          </Col>
        </Row>
        <Row>
          <Col span="16">
          <FormItem label="运单日期">
            <DatePicker v-model="formConfirmSearch.startDate" type="date" placeholder="开始日期"  style="width:135px"></DatePicker> ~
            <DatePicker v-model="formConfirmSearch.endDate" format="yyyy-MM-dd" type="date" placeholder="结束日期"  style="width:135px"></DatePicker>
          </FormItem>
          </Col>
          
        </Row>
      </Form>

    </h3>
    <!--Table border ref="selection" :columns="columns10" :data="data9"></Table-->
   <div class="edittable-table-height-con">
    <can-edit-table border ref="selection" :columns-list="columns10" v-model="unConfirmedList"></can-edit-table>
   </div>
   <Page :total="total" :page-size="pageSize" size="small"  show-elevator show-sizer show-total style="float: right;margin-top: 10px" @on-change="doPageChange"></Page>
 </div>
</template>
<script>
	import Vue from "vue";
    import panel from "../../components/panel.vue";
    import swal from 'sweetalert2';
    import canEditTable from './canEditTable.vue'
    import waybillExpand from './waybill-expand.vue';
    export default {
        components: { waybillExpand, canEditTable },
        watch: {'$route': 'fetchData'},
        data () {
            return {
              lowNetSpeed: false,
              generModal: false,
              selectedRowNumber: -1,
            	formConfirmSearch:{waybillCode:'',invoiceCode:'',vendor:'jingdong',status:'待打印',startDate:'',endDate:''},
            	total:0, pageSize:10, initStartIndex:0, initEndIndex:10,
                columns10: [
                    {
                        type: 'expand',
                        title: '序号',
                        width: 65,
                        align: 'center',
                        render: (h, params) => {
                            return h(waybillExpand, {
                                props: {
                                    row: params.row
                                }
                            })
                        }
                    },
                    {title: '运单编号',key: 'waybillCode',align: 'center'},
          {title: '物流公司',key: 'vendorLabel',align: 'center'},
          {title: '出库单编号',key: 'wmsStockoutCode',align: 'center'},
          {title: '运单生成日期',key: 'orderSendTime',align: 'center',width: 150},
          {title: '收货人',key: 'receiveName',align: 'center'},
          {title: '包裹数量',key: 'packageCount',align: 'center', editable: true},
                    {title: '操作',key: 'action', width: 120, align: 'center',
			            render: (h, params) => {
			              return h('div', [
			                h('Button',{props:{type:'primary',size:'small'},on:{click:()=>{this.confirmWbDelivery(params.row)}}},'确认取件')
			              ]);
			           }
			        }

                ],
                unConfirmedList: [],
            }
        },
 		methods:{
 		doSearchReset(){
          for(let field in this.formConfirmSearch){
            if(field =='vendor'){
               this.formConfirmSearch.vendor='jingdong'
            }else{
               this.formConfirmSearch[field] = '';
            }
          }
          var now = new Date() , nowTime = now.getTime() ,day = now.getDay();
          var oneDayTime = 24*60*60*1000 ; 
          var MondayTime = nowTime - (day-1)*oneDayTime ; 
          var SundayTime =  nowTime + (7-day)*oneDayTime ;

          this.formConfirmSearch.startDate = new Date(MondayTime)
          this.formConfirmSearch.endDate = new Date(SundayTime)
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
              startDate:this.formConfirmSearch.startDate==''?'':this.formConfirmSearch.startDate.getTime(),
              endDate:this.formConfirmSearch.endDate==''?'':this.formConfirmSearch.endDate.getTime(),
              status:'04',
              waybillCode:this.formConfirmSearch.waybillCode,
              vendor:this.formConfirmSearch.vendor,
              invoiceCode:''
            }
            this.$api.doWaybillList(params).then(res => {
            if(res.status == "S"){
                this.total = res.result.total;
                this.unConfirmedList = [];
                for(let record of res.result.records){
                	if(record){
                  		if("jingdong"==record.vendor){
                			record.vendorLabel = "京东物流";
                  		}
                	}
                	this.unConfirmedList.push(record);
                }
            }else{
              swal({text: '获取运单信息失败',type: 'error',showCancelButton: false,width:300});
            }
          })
        },
        confirmWbDelivery(row) {
       		 let params = {
				waybillCode:row.waybillCode,
				vendor:row.vendor
				}
				this.$api.doPickupConfirm(params).then(res => {
					if(res.status == "S"){
					  swal({text: '操作成功!',type: 'success',showCancelButton: false,width:300}).then((isConfirm)=>{this.loadData();});
					}else{
					  swal({text: '操作失败',type: 'error',showCancelButton: false,width:300});
					}
				})
        }
      },
      created(){this.doSearchReset();this.loadData();}
    }
</script>

