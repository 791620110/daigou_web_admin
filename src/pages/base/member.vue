<template>
  <div>
    <Breadcrumb>
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>系统设置</BreadcrumbItem>
      <BreadcrumbItem>人员信息管理</BreadcrumbItem>
    </Breadcrumb>
    <h3 class="box-title" slot="header" style="width: 100%;">
      <Form :model="formMemberSearch" :label-width="80" style="margin-top: 20px" ref="formMemberSearch">
        <Row>
          <Col span="20">
          <Col span="8">
            <FormItem label="人员姓名">
              <Input v-model="formMemberSearch.memberName" placeholder="请输入人员姓名"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="手机号码">
              <Input v-model="formMemberSearch.memberPhone" placeholder="请输入手机号码"></Input>
            </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="电子邮箱">
            <Input v-model="formMemberSearch.memberEmail" placeholder="请输入电子邮箱"></Input>
          </FormItem>
          </Col>
          </Col>
          <Col span="4">
          <Button type="ghost" style="float:right;margin-left:10px;" @click="doSearchReset()">重置</Button>
          <Button type="primary" style="float:right;" @click="search()">查询</Button>
          </Col>
          <Col span="24">
          <Button type="primary" style="float:right;margin-bottom: 10px" @click="add('action')">新增</Button>
          </Col>
        </Row>
      </Form>
    </h3>
    <div slot="body">
      <Table border :columns="memberList" :data="memberData"></Table>
      <Page :total="total" :page-size="pageSize" size="small" show-elevator show-sizer show-total
            style="float: right;margin-top: 10px" @on-change="doPageChange"></Page>
      <Modal v-model="delMember" width="460" ok-text="确 定" cancel-text="取 消" @on-ok="doDelMember">
        <p slot="header" style="color:#f60;text-align:left">
          <Icon type="information-circled"></Icon>
          <span>提示信息</span>
        </p>
        <div style="padding-left:20px">
          <span style="font-size:16px">您确定要删除&nbsp;{{delMemberName}}&nbsp;信息吗？</span>
        </div>
      </Modal>
      <Modal
        v-model="delMemberAdmin"
        title="提示信息" width="460"
        @on-cancel="cancel">
        <p slot="header" style="color:#f60;text-align:left">
          <Icon type="information-circled"></Icon>
          <span>提示信息</span>
        </p>
        <div style="padding-left:20px">
          <Alert type="warning" show-icon>管理员账户不能删除</Alert>
        </div>
        <div slot="footer">
          <Button type="text" size="large" @click="delMemberAdmin = false">取消</Button>
      </div>
      </Modal>
      <Modal
        title="人员信息"
        v-model="showMemberInfo"
        :mask-closable="false"
        ok-text=" 保 存 "
        :loading="loading"
        @on-ok="doSaveMember('formMember')"
        @on-cancel="doCancleMember('formMember')"
        width="860px">
        <Form :model="formMember" label-position="top" ref="formMember" :rules="ruleValidate">
          <Row :gutter="10">
            <Col span="8">
            <FormItem label="登录用户名" prop="username">
              <Input type="text" :disabled="formMember.memberId>0" v-model="formMember.username"
                     placeholder="请输入登录用户名"></Input>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="人员姓名" prop="memberName">
              <Input v-model="formMember.memberName" placeholder="请输入人员姓名"></Input>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="性别" prop="memberSex">
              <Select v-model="formMember.memberSex">
                <Option value="M">男</Option>
                <Option value="F">女</Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row :gutter="10">
            <Col span="8">
            <FormItem label="手机号码" prop="memberPhone">
              <Input v-model="formMember.memberPhone" placeholder="请输入联系电话"></Input>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="电子邮箱" prop="memberEmail">
              <Input v-model="formMember.memberEmail" placeholder="请输入电子邮箱"></Input>
            </FormItem>
            </Col>
            <Col span="8" v-if="formMember.admin=='N'">
            <FormItem label="部门类型" prop="deptType">
              <Select v-model="formMember.deptType" @on-change="deptChange">
                <Option value="S">销售类</Option>
                <Option value="P">采购类</Option>
                <Option value="W">仓储类</Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="8" v-if="formMember.admin=='Y'">
            <FormItem label="可访问仓库" prop="whCheck" required>
              <CheckboxGroup v-model="formMember.whAccessArray" size="large">
                  <Checkbox v-for="item in customerAllWarehouseList" :label="item.whCode">
                    <font style="font-size:14px;margin:4px">{{item.whName}}</font>
                  </Checkbox>
                </CheckboxGroup>
            </FormItem>
            </Col>
          </Row>
          <Row :gutter="10">
            <Col span="8" v-show="formMember.deptType=='S'">
            <FormItem label="可访问仓库" prop="whCheck" required>
              <CheckboxGroup v-model="formMember.whAccessArray" size="large">
                  <Checkbox v-for="item in customerAllWarehouseList" :label="item.whCode">
                    <font style="font-size:14px;margin:4px">{{item.whName}}</font>
                  </Checkbox>
                </CheckboxGroup>
            </FormItem>
            </Col>

            <Col span="8" v-show="formMember.deptType=='W'" >
            <FormItem label="可管理仓库" prop="whCheck" required>
                <RadioGroup v-model="formMember.whAccess" size="large">
                  <Radio v-for="item in customerAllWarehouseList" :label="item.whCode"><font style="font-size:14px;margin:4px">{{item.whName}}</font></Radio>
              </RadioGroup>
            </FormItem>
            </Col>
          </Row>

          <Row :gutter="10">
            <Col span="24">
            <FormItem label="备注">
              <el-input type="textarea" v-model="formMember.memberRemarks" placeholder="请输入备注信息"></el-input>
            </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Modal
        v-model="resetpwd"
        title="重置密码"
        @on-ok="doResetPwd"
        @on-cancel="cancel" width="360px">
        <p style="font-size:15px">您确定要为&nbsp;{{restmembername}} &nbsp; 重置密码吗 ？</p>
      </Modal>

      <Modal
        v-model="resetpwdAdmin"
        title="重置管理员密码" width="600px"
        @on-ok="doResetPwd"
        @on-cancel="cancel">
        <p style="font-size:15px">您确定要重置管理员的密码吗？<BR/><BR/>
        <Alert type="warning" show-icon>如果您的云仓平台账户是通过注册汇药网自动创建，重置管理员密码会导致无法通过汇药网自动登录云仓平台。请您通过汇药网更改密码，新密码将自动同步到云仓平台</Alert></p>
      </Modal>
      <Modal
        title="角色配置"
        v-model="showBindView"
        :mask-closable="false"
        @on-ok="doBindRole"
        width="500px">
        <Form :model="formBindRole" label-position="top">
          <Row>
            <Card>
              <p slot="title">角色配置</p>
              <Row class="expand-row">
                <CheckboxGroup v-model="bizRole" size="large">
                  <Checkbox v-for="item in bizRoleList" :label="item.roleId" style="width:100%;margin:4px">
                    <font style="font-size:14px;margin:4px">{{item.roleName}}</font>
                  </Checkbox>
                </CheckboxGroup>
              </Row>
            </Card>
          </Row>
        </Form>
      </Modal>
    </div>
  </div>
</template>
<script>
  import Vue from "vue";
  import * as api from "../../api"
  import swal from 'sweetalert2'

  export default {
    data() {
      const whaccessCheck = (rule, value, callback) => {
        if(this.formMember.deptType === 'S'){//销售   
              if (this.formMember.whAccessArray.length ==0) {
                  callback(new Error('请选择人员可访问的仓库'));
              }else{callback();}
        }
        if(this.formMember.deptType === 'W'){//仓库
              if (this.formMember.whAccess === '') {
                  callback(new Error('请选择人员可管理的仓库'));
              }else{callback();}
        }
        callback();
      };

      return {
        loading: true,total: 0,pageSize: 10,insertOrUpate: '',initStartIndex: 0,initEndIndex: 10,delMember: false,
        formMemberSearch: {memberName: '', memberEmail: '',memberPhone:''},        
        resetpwd: false,resetpwdAdmin:false,delMemberAdmin:false,resetUserMobile:'',
        resetMember: '',delMemberName: null,showMemberInfo: false, restmembername: '', memberId: 0,resetUserId:null,
        showBindView:false,bizRoleList:[], bizRole:[],formBindRole:{},customerAllWarehouseList:[],
        formMember: {
          userId: null,username: '',admin:null, memberName: '',memberSex: '',memberPhone: '',deptType:'',
          memberEmail: '', remarks: '',deletedFlag: 'N' ,whAccess:'',whAccessArray:[]},
          roletypeList: [{label: '企业用户 - 管理员', value: 'CUS-ADMIN'}, 
          {label: '企业用户 - 销售',value: 'XS'}, {label: '企业用户 - 仓库', value: 'CK'}],
        memberList: [
          {type: 'index', width: 55, align: 'center'},
          {title: '人员姓名', key: 'memberName', align: 'center',width:100},
          {title: '登录用户名', key: 'username', align: 'center'},
          {title: '性别',align: 'center',width: 65,
            render: (h, params) => { return params.row.memberSex === 'M' ? "男":"女";}},
          {title: '手机号码',key: 'memberPhone',align: 'center'},
          {title: '电子邮箱',key: 'memberEmail',align: 'center'},
          {title: '人员角色',key: 'memeberRole',align: 'center'},
          {title: '管理员',align: 'center',width:80,
            render: (h, params) => {return params.row.admin === 'Y'?"是":"否";}},
         
          {title: '操作', key: 'action', width:170, align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {type: 'primary', size: 'small'}, style: {margin:'3px'}, on: {
                    click: () => {this.reset(params.row, 'view')}}}, '重置密码'),
                h('Button', {
                  props: {type: 'primary', size: 'small'}, style: {margin:'3px'}, on: {
                    click: () => {this.show(params.row, 'view')}}}, '详情'),
                h('Button', {
                  props: {type: 'primary', size: 'small'}, style: {margin:'3px'}, on: {
                    click: () => {this.showRoleView(params.row, 'view')}}}, '角色配置'),
                h('Button', {
                  props: {type: 'error', size: 'small'},style: {margin:'3px'}, on: {
                    click: () => {this.remove(params.row)}}}, '删除')
              ]);
            }
          },
        ],
        ruleValidate: {
          username: [
            {required: true, validator:this.$validate.validateUserName , trigger: 'blur'}
          ],
          memberName: [
            {required: true, validator:this.$validate.validateRealName,trigger: 'blur'}
          ],
          memberSex: [
            {required: true, message: '人员性别不能为空', trigger: 'change'}
          ],
          deptType: [
            {required: true, message: '部门类型不能为空', trigger: 'blur'}
          ],
          whCheck: [{validator:whaccessCheck,trigger:'change'}],
          memberPhone: [
            {required: true, validator:this.$validate.validatePhone , trigger: 'blur'}
          ],
          memberEmail: [
            {validator:this.$validate.validateEmail, trigger: 'blur'}
          ],
        },
        memberData: []
      }
    },
    methods: {
      clearFormMember(){
          this.formMember = {
              userId: null,username: '',memberName: '',memberSex: '',memberPhone: '',deptType:'',
              memberEmail: '', remarks: '',deletedFlag: 'N' , whAccess:'',whAccessArray:[] , admin:'N'
          };
      },
      deptChange(){
        //this.$refs['formMember'].resetFields();
        if(this.insertOrUpate === "create"){
          if(this.formMember.deptType === 'S'){
            for(var i in this.customerAllWarehouseList){
              this.formMember.whAccessArray.push(this.customerAllWarehouseList[i].whCode)
            }
          }else{
            this.formMember.whAccessArray = []
            //如果只有一个， 默认选中
            if(this.formMember.deptType === 'W' && this.customerAllWarehouseList.length == 1){
                this.formMember.whAccess = this.customerAllWarehouseList[0]
            }
          } 
        }
      },
      cancel() {
      },
      doSearchReset(name) {
        this.formMemberSearch.memberName = '';
        this.formMemberSearch.memberPhone = '';
        this.formMemberSearch.memberEmail = '';
      },
      doSaveMember(name) {
        this.loading = false;
        this.$nextTick(() => {this.loading = true;});
        let isValid = true;
        this.$refs[name].validate(function(valid) {
          if (!valid) {isValid = valid;return;}
        })
        if(!isValid){return;}
        this.$api.doMemberUserSave(this.formMember, this.insertOrUpate).then(res => {
          if (res.status == "S") {
            this.showMemberInfo = false;
            this.insertOrUpate = "";
            swal({text: '保存成功!', type: 'success', showCancelButton: false, width: 300}).then((isConfirm) => {
                this.clearFormMember();
                this.search();
            });
          } else {
              swal('操作失败', res.message, 'error');
          }
        })
      },
      //search user list
      search(target) {
        this.memberData = [];
        this.doMemberList(this.$table.INIT_START_INDEX, this.$table.INIT_END_INDEX);
      },
      remove(row) {
        if(row.admin=='Y'){
            this.delMemberAdmin = true;
        }else{
            this.memberId = row.memberId;
            this.delMemberName = row.memberName
            this.delMember = true;
        }
      },
      reset(row) {
        if(row.admin=='Y'){
            this.resetpwdAdmin = true;
        }else{
            this.resetpwd = true;
            this.restmembername = row.memberName
            this.resetUserId = row.userId
            this.resetUserMobile = row.memberPhone
        }
      },
      doResetPwd(row) {

        this.$api.doResetPwd({userId:this.resetUserId,mobile:this.resetUserMobile}).then(res => {
          if (res.status == "S") {
            this.showMemberInfo = false;
            swal({text: '密码重置成功!', type: 'success', showCancelButton: false, width: 300}).then((isConfirm) => {
                this.resetUserId = null;
                this.resetUserMobile = null;
                this.restmembername = null;
                this.resetpwd = false;
            });
          } else {
            swal({text: res.result.error, type: 'error', showCancelButton: false, width: 300});
          }
        })
      },
      //showing add user page
      add() {
        this.$refs['formMember'].resetFields();
        this.$Spin.show()
        
        //获取当前客户拥有的所有仓库列表
        this.getCustomerAllWarehouseList().then(res => {
            if (res.status == "S"){
                this.customerAllWarehouseList = res.result.records
                this.showMemberInfo = true;
                this.insertOrUpate = "create";
                this.clearFormMember()
                this.$Spin.hide()
            }else {
                swal('获取客户仓库列表失败', res.message, 'error');
                this.$Spin.hide()
            }
        })        
      },
      //show user information
      show(row, action) {
        let memberId = row.memberId;
        this.$Spin.show()
        this.$refs['formMember'].resetFields();
        this.$api.doMemberInfo(memberId).then(response => {
          if (response.status == "S") {
                this.formMember = response.result
                if(this.formMember.admin==null||this.formMember.admin==''){
                    this.formMember.admin = 'N'
                }
                this.getCustomerAllWarehouseList().then(res => {
                  if (res.status == "S"){
                      this.showMemberInfo = true;
                      this.customerAllWarehouseList = res.result.records                      
                      this.insertOrUpate = "";
                      this.$Spin.hide()
                  }else {
                      swal('获取客户仓库列表失败', res.message, 'error');
                      this.$Spin.hide()
                  }
                })                  
              }else {
                  swal('获取人员详情失败', response.message, 'error');
                  this.$Spin.hide()
              }
            
            
        })   
      },
      //delete Member
      doDelMember() {
        this.$api.doMemberDel(this.memberId).then(res => {
          if (res.status == "S") {
            this.showMemberInfo = false;
            this.memberId = null;
            this.delMemberName = null
            swal({text: '删除成功!', type: 'success', showCancelButton: false, width: 300}).then((isConfirm) => {
                this.search();
            });
          } else {
            swal('操作失败', res.result.error, 'error');
          }
        })
      },
      //change page number
      doPageChange(pagenumber) {
        let startIndex = ( pagenumber - 1 ) * this.pageSize;
        let endIndex = pagenumber * this.pageSize;
        this.doMemberList(startIndex, endIndex);
      },
      loadData() {
        this.doMemberList(this.$table.INIT_START_INDEX, this.$table.INIT_END_INDEX);
      },

      doCancleMember() {
        this.showMemberInfo = false;
        //if (this.insertOrUpdate == "create") {
            this.$refs["formMember"].resetFields();
            this.formMember.memberSex = '';
            this.formMember.deptType = '';
        //}
      },
      doMemberList(startIndex, endIndex) {
        let lStartIndex = startIndex;
        let lEndIndex = endIndex;
        let memeberName = this.formMemberSearch.memberName;
        let params = {startIndex: lStartIndex, endIndex: lEndIndex, memeberName: memeberName, memberPhone:this.formMemberSearch.memberPhone,memberEmail:this.formMemberSearch.memberEmail}
        this.$api.doMemberList(params).then(res => {
          if (res.status == "S") {
            this.total = res.result.total;
            this.wareHouseData = [];
            for (let record of res.result.records) {
              this.memberData.push(record);
            }
          } else {
              swal('获取人员列表失败', res.result.error, 'error');
          }
        })
      },
      showRoleView(row){

        this.$api.doMemberRoles(true).then(res => {
          this.bizRoleList = [];
          if (res.status == "S"){
              this.bizRoleList = []
              if(row.admin == 'Y'){
                  this.bizRoleList = res.result;
              }else{
                  for(let i in res.result){
                      let ele = res.result[i];
                      if(row.deptType == 'S' && ele.roleType=='SALER'){
                          this.bizRoleList.push(ele);continue
                      }

                      if(row.deptType == 'W' && ele.roleType=='WAREHOUSER'){
                          this.bizRoleList.push(ele);continue
                      }

                      if(row.deptType == 'P' && ele.roleType=='BUYER'){
                          this.bizRoleList.push(ele);continue
                      }
                  }

              }
              this.showBindView = true;
              this.memberId = row.memberId;
              this.bizRole = row.memeberRoleCode==null?[]:row.memeberRoleCode;
          }else {
            swal('获取角色列表信息失败', res.message, 'error');
          }
        })
      },
      doBindRole(){
        let params = {
          memberId:this.memberId,
          roleIds:this.bizRole
        };
        this.$api.doMemberRolesBind(params).then(res => {
          if (res.status == "S"){
            this.showBindView = false;
            swal({text: '操作成功!', type: 'success', showCancelButton: false, width: 300}).then((isConfirm) => {
              this.search();
            });
          }else {
            swal('操作失败', res.message, 'error');
          }
        })
      },

      getCustomerAllWarehouseList(){
        return this.$api.doCustomerWarehouseList({})
      }
    },

    //init page data
    created(){this.doSearchReset();this.loadData();}
  }
</script>
<style>
  .el-pagination {
    float: right;
    margin-top: 15px;
  }
</style>
