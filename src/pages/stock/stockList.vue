<template>
  <div>
    <Breadcrumb>
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>药品库存</BreadcrumbItem>
      <BreadcrumbItem>药品库存</BreadcrumbItem>
    </Breadcrumb>

        <Cascader :data="data"   v-model="value1"  >
        </Cascader>

    <h3 class="box-title" slot="header" style="width: 100%;">
      <Form :ref="formMember" :model="formStockSearch" :label-width="80" style="margin-top: 20px" >
        <Row>
          <Col span="20">
          <Col span="8">
          <FormItem label="货品编号">
            <Input v-model="formStockSearch.whGoodsCode" placeholder="请输入货品编号"></Input>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="货品名称">
            <Input v-model="formStockSearch.whGoodsName" placeholder="请输入货品名称"></Input>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="货主标识">
            <Input v-model="formStockSearch.ownerCode" placeholder="请输入货主标识"></Input>
          </FormItem>
          </Col>
          </Col>
          <Col span="4">
          <Button type="ghost" style="float:right;margin-left: 10px" @click="doSearchReset()">重置</Button>
          <Button type="primary" style="float:right;" @click="search()">查询</Button>
          </Col>
        </Row>
      </Form>
    </h3>
    <div slot="body">
      <Table border :columns="stockList" :data="stockData"></Table>
      <Page :total="total" :page-size="pageSize" size="small"  show-elevator show-sizer show-total style="float: right;margin-top: 10px" @on-change="doPageChange"></Page>
    </div>
  </div>
</template>

<script>
  import Vue from "vue";
  import panel from "../../components/panel.vue"
  import * as api from "../../api/index"
  import apiConfig from "../../api/apiConfig.js"
  import swal from 'sweetalert2'
  import stockExpand from './stock-expand.vue';
  import Cascader from "../../../node_modules/iview/src/components/cascader/cascader.vue";

  export default {
    components: {
      Cascader,
      'imp-panel': panel,stockExpand
    },
    data(){
      return {
        value1: '',
        value2:[],
        formStockSearch:{whGoodsCode:'',whGoodsName:'',ownerCode:''},
        total:0,
        pageSize:10,
        initStartIndex:0,
        initEndIndex:10,
        delMember:false,
        resetpwd:false,
        showStockInfo:false,
        formMember: {
          userId: null,  username: '',   password: '',
          memberName: '',  sex:'',   mobile: '',  email: '',memberType:[],
          userType: 'SYS',   remarks: '',  status:'00',
          createdBy:'',createdDate:null,updatedBy:'',updatedDate:null
        },
        stockList: [
          {type: 'expand',title: '',width: 65,align: 'center',
			render: (h, params) => {
				return h(stockExpand, {
					props: {row: params.row}
				})
			}
          },
          {title: '货品编号',key: 'whGoodsCode',align: 'center'},
          {title: '货品名称',key: 'whGoodsName',align: 'left'},
          {title: '件装数',key: 'whGoodsPackTotal',align: 'center',width:75},
          {title: '中包装数',key: 'whGoodsMpackTotal',align: 'center',width:85},
          {title: '单位',key: 'whGoodsUnit',align: 'center'},
          {title: '规格',key: 'whGoodsSpec',align: 'center'},
          {title: '生产厂家',key: 'whGoodsFactory',align: 'center'},
          {title: '库存数量',key: 'stockQuantity',align: 'center'},
          {title: '货主标识',key: 'ownerCode',align: 'center'}
        ],
        stockData: [],
        stockHisData:[],
        wareHouseSelectList:[],
        data: [{
          value: 'beijing',
          label: '北京',
          children: [
            {
              value: 'gugong',
              label: '故宫'
            },
            {
              value: 'tiantan',
              label: '天坛'
            },
            {
              value: 'wangfujing',
              label: '王府井'
            }
          ]
        }, {
          value: 'jiangsu',
          label: '江苏',
          children: [
            {
              value: 'nanjing',
              label: '南京',
              children: [
                {
                  value: 'fuzimiao',
                  label: '夫子庙',
                }
              ]
            },
            {
              value: 'suzhou',
              label: '苏州',
              children: [
                {
                  value: 'zhuozhengyuan',
                  label: '拙政园',
                },
                {
                  value: 'shizilin',
                  label: '狮子林',
                }
              ]
            }
          ],
        }]
      }
    },
    methods: {
      cancel(){},
      doSearchReset(name){
        this.formStockSearch.whGoodsName = '';
        this.formStockSearch.whGoodsCode = '';
        this.formStockSearch.ownerCode = '';
      },
      //search user list
      search(target){
        this.loadData();
      },
      loadData(){
        this.doStockList(this.$table.INIT_START_INDEX,this.$table.INIT_END_INDEX);
      },
      doPageChange(pagenumber) {
        let startIndex = ( pagenumber - 1 ) * this.pageSize;
        let endIndex = pagenumber * this.pageSize;
        this.doStockList(startIndex, endIndex);
      },
      doStockList(startIndex,endIndex){
        let lStartIndex = startIndex;
        let lEndIndex = endIndex;
        let whGoodsName = this.formStockSearch.whGoodsName;
        let whGoodsCode = this.formStockSearch.whGoodsCode;
        let ownerCode = this.formStockSearch.ownerCode;
        let params = {
          startIndex:lStartIndex,
          endIndex:lEndIndex,
          whGoodsName:whGoodsName,
          whGoodsCode:whGoodsCode,
          ownerCode:ownerCode
        }
        this.$api.doStockList(params).then(res => {
          if(res.status == "S"){
            this.total = res.result.total;
            this.stockData = [];
            for(let record of res.result.records){
              this.stockData.push(record);
            }
          }else{
            swal({text: '操作失败['+res.result.error+']!',type: 'error',showCancelButton: false,width:300});
          }
        })
      }
    },
    created(){
      this.loadData();
    }
  }
</script>
<style>
  .el-pagination {
    float: right;
    margin-top: 15px;
  }
</style>
