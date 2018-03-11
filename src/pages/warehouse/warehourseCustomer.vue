<template>
  <div>
    <Breadcrumb>
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>云仓客户管理</BreadcrumbItem>
      <BreadcrumbItem>云仓仓库分配管理</BreadcrumbItem>
    </Breadcrumb>
    <Form :model="formSearchWh" :label-width="80" style="margin-top: 20px">
      <Row>
        <Col span="20">
        <Col span="9">
        <FormItem label="仓库名称">
          <Input v-model="formSearchWh.whName" placeholder="请输入仓库名称"></Input>
        </FormItem>
        </Col>
        <Col span="9">
        <FormItem label="所属客户">
          <Input v-model="formSearchWh.customerName" placeholder="请输入所属客户名称"></Input>
        </FormItem>
        </Col>
        <Col span="6">
          <FormItem label="是否为云仓" prop="asCloud">
            <Select v-model="formSearchWh.asCloud">
              <Option value="Y">是</Option>
              <Option value="N">否</Option>
            </Select>
          </FormItem>
          </Col>
           </Col>
        </Col>
        <Col span="4">
          	<Button type="ghost" style="float:right;margin-left: 10px;" @click="doReset('formSearchWh')">重置</Button>
            <Button type="primary" style="float:right;" @click="search()">查询</Button>
        </Col>
      </Row>
    </Form>
    <Table border :columns="wareHouseList" :data="wareHouseData"></Table>
    <Page :total="total" :page-size="pageSize" size="small"  show-elevator show-sizer show-total style="float: right;margin-top: 10px" @on-change="doPageChange"></Page>
    <Modal v-model="delCusotmerWarehouse" width="480">
      	<p slot="header" style="color:#f60;text-align:left">
          <Icon type="information-circled"></Icon>
          <span>提示信息</span>
        </p>
        <div style="padding-left:20px;margin:10px">
          <span style="font-size:16px">您确定要删除此仓库(<span>编码:{{ delCusotmerWarehouseCusotmerCode }},名称:{{ delCusotmerWarehouseWhCode }}</span>)吗？</span>
        </div>
        <div slot="footer">
        <Button type="error" size="large" long  @click="doDelCusotmerWarehouseInfo">删除</Button>
      </div>
    </Modal>

    <Modal
      title="云仓仓库分配信息"
      v-model="showCustomerWarehouse"
      :mask-closable="false"
      @on-ok="doWhBindCus"
      width="900px">
      <Form :model="formCustomerWarehouse" label-position="top">
        <Row :gutter="10">
          <Col span="10" >
          <FormItem label="云仓客户(客户编号 - 客户名称)">
            <Select  v-model="formCustomerWarehouse.customerCode" filterable  placeholder="请选择云仓客户">
              <Option v-for="item in cusList" :value="item.customerCode" :key="item.customerCode">{{ item.labelVal }}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="10" >
          <FormItem label="对应仓库货主" placeholder="请选择对应的仓库货主">
            <Select v-model="formCustomerWarehouse.whOwnerCode" >
              <Option v-for="item in whOwnerList" :value="item.ownerCode" :key="item.ownerCode">{{ item.ownerName }}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="4">
          <FormItem label="是否启用">
            <Select v-model="formCustomerWarehouse.status">
              <Option value="00">是</Option>
              <Option value="01">否</Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
          <Row :gutter="10">
          <Col span="24" style = "float: right;">
            <FormItem label="备注">
              <Input type="textarea" v-model="formCustomerWarehouse.remark" :rows="3" placeholder="请输入备注信息"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>
<script>
  import swal from 'sweetalert2'
  import expandRow from './table-expand.vue';
  export default {
    components: { expandRow },
    data () {
      return {
        showCustomerWarehouse:false,
        delCusotmerWarehouseCusotmerCode:'',
        delCusotmerWarehouseWhCode:'',
        delCusotmerWarehouse:false,
        initStartIndex:0,initEndIndex:10,total:0,pageSize:10,
        insertOrUpdate:'',cusList:[],customerList:[],whOwnerList:[], whCode:'',
        formSearchWh:{whName: '', customerName: '',asCloud:'Y'},
        formCustomerWarehouse:{ customerCode:'',whOwnerCode:'',status:'00',whCode:''},
        wareHouseList: [
          {type: 'expand',width: 50,
              render: (h, params) => {return h(expandRow, {props: {whCode:params.row.whCode,whName:params.row.whName}})}
          },

          {title: '仓库编码',key: 'whCode',align: 'center',width: 120},
          {title: '仓库名称',key: 'whName',align: 'center'},
          {title: '云仓',key: 'asCloud',align: 'center',width: 70,
            render: (h, params) => {return params.row.asCloud === 'Y' ? "是":"否"}},
          {title: '所属客户',key: 'customerName',align: 'center'},
          {title: '省 / 市 / 区',align: 'center',render: (h, params) => {
            let province  = params.row.province == null ? "-" : params.row.province;
            let city  = params.row.province == null ? "-" : params.row.city;
            let district  = params.row.district == null ? "-" : params.row.district;
            return province +" / "+city +" / "+district; } },
          {title: '状态',align: 'center',width: 70,
            render: (h, params) => {return params.row.status === '00'?"可用":"不可用";}},
          {title: '操作',key: 'action',width:120,align: 'center',
            render: (h, params) => {
              return h('div', [
              	h('Button', {props: {type: 'primary',size: 'small'},style: {marginRight: '5px'},on: {click: () => {this.addCustomerWarehouseInfo(params.row)}}}, '分配仓库')
              ]);
            }
          }
        ],
        wareHouseData: []
      }
    },
    methods: {
      doReset(){
          this.formSearchWh.warehouseName = '';
          this.formSearchWh.customerName = '';
          this.formSearchWh.asCloud = 'Y';
      },
      addCustomerWarehouseInfo (row) {
          this.$api.doWarehouseCustomerUnSelectList(row.whCode).then(res => {
            if(res.status == "S"){
              this.cusList = [];
              for(let record of res.result){
                  record.labelVal = record.customerCode +" - "+record.customerName
                  this.cusList.push(record);
              }
              this.showCustomerWarehouse = true;
              this.insertOrUpdate = 'create';
              this.formCustomerWarehouse.whCode = row.whCode;
              this.doWhOwnerSelectList(row.whCode);
            }else{
                swal('获取客户列表失败', res.message, 'error');
            }
          })
      },

      doDelCusotmerWarehouseInfo(){
      },
      doWhBindCus(){
          this.$api.doWhBindCus(this.formCustomerWarehouse,this.insertOrUpdate).then(res => {
              if(res.status == "S"){
                this.showCustomerWarehouse = false;
                swal({text: '保存成功!',type: 'success',showCancelButton: false,width:300}).then((isConfirm)=>{this.search();});
              }else{
                swal({text:res.message,type: 'error',showCancelButton: false,width:300});
              }
          })
      },
      doAuthWhList(startIndex,endIndex){
        let lStartIndex = startIndex;
        let lEndIndex = endIndex;
        let whName = this.formSearchWh.whName;
        let params = {
          startIndex:lStartIndex,
          endIndex:lEndIndex,
          whName:whName,
          customerName:this.formSearchWh.customerName,
          asCloud:this.formSearchWh.asCloud
        }
        this.$api.doAuthWhList(params).then(res => {
          if(res.status == "S"){
            this.total = res.result.total;
            this.wareHouseData = [];
            this.wareHouseData = res.result.records;
          }else{
              swal('获取仓库列表失败', res.message, 'error');
          }
        })
      },
      doWhOwnerSelectList(whCode){
          this.$api.doWhOwnerSelectList(whCode).then(res => {
            if(res.status == "S"){
              this.whOwnerList = res.result.records;
            }else{
              swal('获取仓库货主列表失败', res.message, 'error');
            }
          })
      },

      search(){
          this.doAuthWhList(this.$table.INIT_START_INDEX,this.$table.INIT_END_INDEX);
      },
      doPageChange(pagenumber){
        let startIndex = ( pagenumber - 1 ) * this.pageSize;
        let endIndex = pagenumber * this.pageSize;
        this.doAuthWhList(startIndex,endIndex);
      },
    },
    created(){
        this.search();
    }
  }
</script>
