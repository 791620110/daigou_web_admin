<template>
  <div>
    <Breadcrumb>
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>系统设置</BreadcrumbItem>
      <BreadcrumbItem>物流信息管理</BreadcrumbItem>
    </Breadcrumb>

    <h3 class="box-title" slot="header" style="width: 100%;">
      <Form :model="formLogisticsSearch" :label-width="80" style="margin-top: 20px" ref="formLogisticsSearch">
        <Row>
          <Col span="20">
            <Col span="8">
            <FormItem label="物流访问ID">
              <Input placeholder="请输入物流访问id" v-model="formLogisticsSearch.clientId"></Input>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="物流提供商">
              <Select v-model="formLogisticsSearch.vendor">                
                <Option value="jingdong">京东物流</Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="状态">
              <Select v-model="formLogisticsSearch.status">
                <Option value="0000">全部</Option>
                <Option value="01">可用</Option>
                <Option value="02">不可用</Option>
              </Select>
            </FormItem>
            </Col>
          </Col>
          <Col span="4">
          <Button type="ghost" style="float:right;margin-left: 10px" @click="doSearchReset()">重置</Button>
          <Button type="primary" style="float:right;" @click="search()">查询</Button>
          </Col>
          <Col span="24">
          <Button type="primary" style="float:right;margin-bottom: 10px" @click="add('action')">新增</Button>
          </Col>
        </Row>
      </Form>
    </h3>
    <div slot="body">
      <Table border :columns="whLogisticsList" :data="whLogisticsData"></Table>
      <Page :total="total" :page-size="pageSize" size="small" show-elevator show-sizer show-total style="float: right;margin-top: 10px" @on-change="doPageChange"></Page>
      <Modal
        title="物流信息"
        v-model="showLogisticsView"
        :mask-closable="false"
        :loading="loading"
        @on-ok="doLogisticsSave('formLogistics')"
        @on-cancel="doCancleForm('formLogistics')"
        width="840px">
        <Form :model="formLogistics" label-position="top" ref="formLogistics" :rules="ruleValidate">
          <Row :gutter="10">
            <Col span="8">
            <FormItem label="物流信息" prop="vendor">
              <Select v-model="formLogistics.vendor" >
                <Option value="jingdong">京东物流</Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="物流访问ID" prop="accessKey">
              <Input placeholder="请输入物流访问ID" v-model="formLogistics.accessKey" ></Input>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="物流授权码" prop="accessSecret">
              <Input  placeholder="请输入物流授权码" v-model="formLogistics.accessSecret"></Input>
            </FormItem>
            </Col>

          </Row>
          <Row :gutter="10">
            <Col span="8">
            <FormItem label="物流客户编号" prop="clientId">
              <Input  placeholder="请输入物流客户编号" v-model="formLogistics.clientId"></Input>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="保单是否默认保价" >
              <Select>
                <Option value="Y">保价</Option>
                <Option value="N">不保价</Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="是否启用" prop="status">
              <Select v-model="formLogistics.status">
                <Option value="01">是</Option>
                <Option value="02">否</Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Modal v-model="showDel" width="460">
        <p slot="header" style="color:#f60;text-align:left">
          <Icon type="information-circled"></Icon>
          <span>提示信息</span>
        </p>
        <div style="margin:10px">
          <span style="font-size:16px">您确认要删除此条记录吗</span>
        </div>
        <div slot="footer">
          <Button type="error" size="large" long  @click="doDel">删除</Button>
        </div>
      </Modal>
    </div>
    </div>
  </imp-panel>
</template>
<script>
  import Row from "../../../node_modules/iview/src/components/grid/row.vue";
  import swal from 'sweetalert2'
  export default {
    components: {
      Row,
    },
    data() {
      return {
        formLogisticsSearch:{clientId:'',vendor:'',status:''},
        loading: true,
        insertOrUpdate:'',
        total:0,
        pageSize:10,
        showDel:false,
        logisticsId:'',
        formLogistics:{
          vendor:'',
          clientId:'',
          accessKey:'',
          accessSecret:'',
          status:''
        },
        ruleValidate: {
          vendor: [
            { required: true, message: '物流信息不能为空', trigger: 'change' }
          ],
          clientId: [
            { required: true, message: '物流客户编号不能为空', trigger: 'blur' }
          ],
          accessKey: [
            { required: true, message: '物流访问ID不能为空', trigger: 'blur' }
          ],
          accessSecret: [
            { required: true, message: '物流授权码不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '是否启用不能为空', trigger: 'change' }
          ]
        },
        showLogisticsView:false,
        whLogisticsList: [
          {type: 'index', width: 55, align: 'center'},
          {title: '客户编码', key: 'customerCode', align: 'center'},
          {title: '物流访问ID', key: 'clientId', align: 'center'},
          {title: '物流提供商', key: 'vendor', align: 'center'},
          {title: '状态', key: 'status', align: 'center',
            render: (h, params) => {
              if (params.row.status === '01') {
                return "可用";
              } else {
                return "不可用";
              }
            }
          },
          {
            title: '操作', key: 'action', width: 200, align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {type: 'primary', size: 'small'}, style: {marginRight: '5px'}, on: {
                    click: () => {
                      this.show(params.row, 'view')
                    }
                  }
                }, '详情'),
                h('Button', {
                  props: {type: 'error', size: 'small'}, on: {
                    click: () => {
                      this.remove(params.row)
                    }
                  }
                }, '删除')
              ]);
            }
          },
        ],
        whLogisticsData:[],
      }
    },
    methods:{
      loadData(){
        this.doLogiticsList(this.$table.INIT_START_INDEX, this.$table.INIT_END_INDEX);
      },
      doSearchReset(){
        this.formLogisticsSearch.clientId = "";
        this.formLogisticsSearch.vendor = "jingdong";
        this.formLogisticsSearch.status = "0000";
      },
      search(){
        this.loadData();
      },
      show(row){
       this.showLogisticsView = true;
       this.formLogistics = row;
       this.insertOrUpdate = "update";
      },
      add(){
        this.showLogisticsView = true;
        this.formLogistics = { vendor:'', clientId:'', accessKey:'', status:''};
        this.insertOrUpdate = "create";
      },
      doLogisticsSave(name){
        this.loading = false;
        this.$nextTick(() => {
          this.loading = true;
        });
        let isValid = true;
        this.$refs[name].validate(function(valid) {
          if (!valid) {
            isValid = valid
            return;
          }
        })
        if(!isValid){
          return;
        }
        this.$api.doLogisticsSave(this.formLogistics,this.insertOrUpdate).then(res => {
          if (res.status == "S") {
            this.showLogisticsView = false;
            swal({text: '保存成功!', type: 'success', showCancelButton: false, width: 300}).then((isConfirm) => {
              this.loadData();

            });
          } else {
            swal('获取用户列表失败', res.result.error, 'error');
          }
        })
      },

      doCancleForm(name){
        if(this.insertOrUpdate == "create"){
          this.$refs[name].resetFields();
          this.formLogistics.status = "";
        }
      },

      doPageChange(){

      },
      doLogiticsList(startIndex, endIndex) {
        let lStartIndex = startIndex;
        let lEndIndex = endIndex;
        let params = {
          startIndex: lStartIndex,
          endIndex: lEndIndex,
          clientId:this.formLogisticsSearch.clientId,
          vendor:this.formLogisticsSearch.vendor,
          status:this.formLogisticsSearch.status === '0000'? '' : this.formLogisticsSearch.status
        }
        this.$api.doLogiticsList(params).then(res => {
          this.customerData = [];
          if (res.status == "S") {
            this.total = res.result.total;
            this.whLogisticsData = [];
            for (let record of res.result.records) {
              this.whLogisticsData.push(record);
            }
          } else {
            swal('获取用户列表失败', res.result.error, 'error');
          }
        })
      },
      remove(row){
        this.showDel = true;
        alert(row.logisticsId);
        this.logisticsId = row.logisticsId;
      },
      doDel(){
        this.$api.doLogisticsDel(this.logisticsId).then(res => {
          if(res.status == "S"){
            this.showDel = false;
            this.loadData();
            swal({text: '保存成功!',type: 'success',showCancelButton: false,width:300}).then((isConfirm)=>{this.search();});
          }else{
            swal({text:res.message,type: 'error',showCancelButton: false,width:300});
          }
        })
      },
    },
    created(){this.doSearchReset()
      this.loadData();
    }
  }
</script>
