<template>
  <div>
    <Breadcrumb>
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>系统设置</BreadcrumbItem>
      <BreadcrumbItem>取件单管理</BreadcrumbItem>
    </Breadcrumb>
    <h3 class="box-title" slot="header" style="width: 100%;">
      <Form :model="formInvoiceSearch" :label-width="80" style="margin-top: 20px" ref="formInvoiceSearch">
        <Row>
          <Col span="20">
          <Col span="8">
          <FormItem label="取件联系人">
            <Input v-model="formInvoiceSearch.pickupName" placeholder="请输入取件联系人"></Input>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="联系电话">
            <Input v-model="formInvoiceSearch.pickupTel" placeholder="请输入联系电话"></Input>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="商家编码">
            <Input v-model="formInvoiceSearch.customerCode" placeholder="请输入商家编码"></Input>
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
      <Table border :columns="whInvoiceList" :data="whInvoiceData"></Table>
      <Page :total="total" :page-size="pageSize" size="small" show-elevator show-sizer show-total
            style="float: right;margin-top: 10px" @on-change="doPageChange"></Page>
      <Modal v-model="showDel" width="360" ok-text="确 定" cancel-text="取 消" @on-ok="doDelInvoice">
        <p slot="header" style="color:#f60;text-align:left">
          <Icon type="information-circled"></Icon>
          <span>提示信息</span>
        </p>
        <div style="padding-left:20px">
          <span style="font-size:16px">您确定要删除此条取件单吗?</span>
        </div>
      </Modal>
      <Modal
        title="取件单信息"
        v-model="showInvoiceInfo"
        :mask-closable="false"
        :loading="loading"
        @on-ok="doInvoiceSave('formValidate')"
        @on-cancel="doInvoiceCancel('formValidate')"
        width="840px">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-position="top">
          <Row :gutter="10">
            <Col span="8">
            <FormItem label="取件联系人" prop="pickupName">
              <Input v-model="formValidate.pickupName" placeholder="请输入取件联系人"></Input>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="联系电话" prop="pickupTel">
              <Input v-model="formValidate.pickupTel" placeholder="请输入移动电话号码"></Input>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="取件地址" prop="pickupAddress">
              <Input v-model="formValidate.pickupAddress" placeholder="取件地址"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row :gutter="10">
            <Col span="8">
            <FormItem label="退货地址" prop="backAddress">
              <Input v-model="formValidate.backAddress" placeholder="请输入退货地址"></Input>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="商家联系人" prop="customerContract">
              <Input v-model="formValidate.customerContract" placeholder="物流提供商"></Input>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="商家联系电话" prop="customerTel">
              <Input v-model="formValidate.customerTel" placeholder="请输入商家移动电话号码"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row :gutter="10">
            <Col span="8">
            <FormItem label="商家编码" prop="customerCode">
              <Input v-model="formValidate.customerCode" placeholder="请输入商家编码"></Input>
            </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  </div>
</template>

<script>
  import Vue from "vue";
  import * as api from "../../api/index"
  import apiConfig from "../../api/apiConfig.js"
  import swal from 'sweetalert2'

  export default {
    data() {
      return {
        loading:true,
        formValidate: {
          pickupName: '',
          pickupTel: '',
          pickupAddress: '',
          returnAddress: '',
          backAddress: '',
          customerTel: '',
          customerCode: '',
          customerContract: '',
        },
        baseFormValidate: {
          pickupName: '',
          pickupTel: '',
          pickupAddress: '',
          returnAddress: '',
          backAddress: '',
          customerTel: '',
          customerCode: '',
          customerContract: '',
        },
        ruleValidate: {
          pickupName: [
            {required: true, message: '取件联系人不能为空', trigger: 'blur'}
          ],
          pickupTel: [
            {required: true, validator:this.$validate.validatePhone , trigger: 'blur'}
          ],
          pickupAddress: [
            {required: true, message: '取件地址不能为空', trigger: 'blur'}
          ],
          returnAddress: [
            {required: true, message: '退货地址不能为空', trigger: 'blur'}
          ],
          backAddress: [
            {required: true, message: '退货地址不能为空', trigger: 'blur'}
          ],
          customerTel: [
            {required: true, validator:this.$validate.validatePhone, trigger: 'blur'}
          ],
          customerCode: [
            {required: true, message: '商家编码不能为空', trigger: 'blur'}
          ],
          customerContract: [
            {required: true, message: '商家联系人不能为空', trigger: 'blur'}
          ],
        },
        formInvoiceSearch: {pickupName: '', pickupTel: '',customerCode:''},
        total: 0,
        pageSize: 10,
        initStartIndex: 0,
        initEndIndex: 10,
        delMember: false,
        showInvoiceInfo: false,
        resetpwd: false,
        resetMember: '',
        showDel: false,
        userId: 0,
        pickupId: 0,
        insertOrUpdate: '',
        pickupName: '',
        pickupTel: '',
        pickupAddress: '',
        returnAddress: '',
        backAddress: '',
        customerTel: '',
        customerCode: '',
        customerContract: '',
        roletypeList: [{label: '企业用户 - 管理员', value: 'CUS-ADMIN'}, {
          label: '企业用户 - 销售',
          value: 'XS'
        }, {label: '企业用户 - 仓库', value: 'CK'}],
        whInvoiceList: [
          {type: 'index', width: 55, align: 'center'},
          {title: '取件联系人', key: 'pickupName', align: 'center'},
          {title: '联系电话', key: 'pickupTel', align: 'center'},
          {title: '取件地址', key: 'pickupAddress', align: 'center'},
          {title: '退货地址', key: 'backAddress', align: 'center'},
          {title: '商家联系电话', key: 'customerTel', align: 'center'},
          {title: '商家编码', key: 'customerCode', align: 'center'},
          {title: '商家联系人', key: 'customerContract', align: 'center'},
          {
            title: '操作', key: 'action', width: 200, align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {type: 'primary', size: 'small'}, style: {marginRight: '5px'}, on: {
                    click: () => {
                      let baseFormValidate  = params.row;
                      this.show(baseFormValidate, 'view')
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
        whInvoiceData: []
      }
    },
    methods: {
      cancel() {
      },
      doSearchReset(name) {
        this.formInvoiceSearch.pickupName = "";
        this.formInvoiceSearch.pickupTel = "";
        this.formInvoiceSearch.customerCode = "";
      },

      //search user list
      search(target) {
        this.loadData();
      },
      remove(row) {
        this.showDel = true;
        this.pickupId = row.pickupId;
      },
      reset(row) {
        this.resetpwd = true;
        this.restmembername = row.memberName
      },

      //showing add user page
      add() {
      	this.$refs['formValidate'].resetFields();
        this.showInvoiceInfo = true;
        this.insertOrUpdate = "create";
      },
      doInvoiceInfo() {

      },
      //show user information
      show(row) {
        this.showInvoiceInfo = true;
        this.insertOrUpdate = "update";
        this.formValidate = row;
        this.baseFormValidate = this.formValidate;
        this.pickupName=this.baseFormValidate.pickupName
        this.pickupTel=this.baseFormValidate.pickupTel
        this.pickupAddress=this.baseFormValidate.pickupAddress
        this.returnAddress=this.baseFormValidate.returnAddress
        this.backAddress=this.baseFormValidate.backAddress
        this.customerTel=this.baseFormValidate.customerTel
        this.customerCode=this.baseFormValidate.customerCode
        this.customerContract=this.baseFormValidate.customerContract
      },
      //delete Member
      doDelInvoice() {
        this.$api.doDelInvoice(this.pickupId).then(res => {
          if (res.status == "S") {
            this.showDel = false;
            swal({text: '保存成功!', type: 'success', showCancelButton: false, width: 300}).then((isConfirm) => {
              this.search();
            });
          } else {
            swal('获取用户列表失败', res.result.error, 'error');
          }
        })
      },
      //change page number
      doPageChange(pagenumber) {
        let startIndex = ( pagenumber - 1 ) * this.pageSize;
        let endIndex = pagenumber * this.pageSize;
        this.doUserList(startIndex, endIndex);
      },
      doInvoiceCancel(name){
        console.log(this.name);
        this.baseFormValidate.pickupName =this.pickupName
        this.baseFormValidate.pickupTel =this.pickupTel
        this.baseFormValidate.pickupAddress =this.pickupAddress
        this.baseFormValidate.returnAddress =this.returnAddress
        this.baseFormValidate.backAddress =this.backAddress
        this.baseFormValidate.customerTel =this.customerTel
        this.baseFormValidate.customerCode =this.customerCode
        this.baseFormValidate.customerContract =this.customerContract
        if (this.insertOrUpdate == "create") {
          this.$refs[name].resetFields();
        }
      },
      doInvoiceSave(name) {
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
        this.$api.doInvoiceSave(this.formValidate, this.insertOrUpdate).then(res => {
          if (res.status == "S") {
            this.showInvoiceInfo = false;
            swal({text: '保存成功!', type: 'success', showCancelButton: false, width: 300}).then((isConfirm) => {
              this.search();
            });
          } else {
            swal({text: res.result.error, type: 'error', showCancelButton: false, width: 300});
          }
        })
      },
      loadData() {
        this.doWbInvoiceList(this.initStartIndex, this.initEndIndex);
      },
      //wrap parameter and get user list
      doWbInvoiceList(startIndex, endIndex) {
        let lStartIndex = startIndex;
        let lEndIndex = endIndex;
        let params = {
          startIndex: lStartIndex,
          endIndex: lEndIndex,
          pickupName: this.formInvoiceSearch.pickupName,
          pickupTel: this.formInvoiceSearch.pickupTel,
          customerCode: this.formInvoiceSearch.customerCode

        }
        this.$api.doWbInvoiceList(params).then(res => {
          this.customerData = [];
          if (res.status == "S") {
            this.total = res.result.total;
            this.whInvoiceData = [];
            for (let record of res.result.records) {
              this.whInvoiceData.push(record);
            }
          } else {
            swal('获取用户列表失败', res.result.error, 'error');
          }
        })
      },
      closeModal() {
        this.showMemberInfo = false;
        this.$refs['formValidate'].resetFields();
      }
    },
    //init page data
    created() {
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
