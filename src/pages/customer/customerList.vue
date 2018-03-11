<template>
  <div>
    <Breadcrumb>
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>云仓客户管理</BreadcrumbItem>
      <BreadcrumbItem>云仓客户列表</BreadcrumbItem>
    </Breadcrumb>
    <Form :model="formSearch" :label-width="80" style="margin-top: 20px">
      <Row>
        <Col span="20">
          <Col span="8">
          <FormItem label="客户名称">
            <Input v-model="formSearch.customerName" placeholder="请输入客户名称"></Input>
          </FormItem>
          </Col>
        <Col span="8">
          <FormItem label="客户类型">
            <Select v-model="formSearch.customerType">
              <Option v-for="item in typeList" :value="item.refKey" :key="item.refKey">{{ item.refValue }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="8">
            <FormItem label="客户来源" prop="source" >
              <Select v-model="formSearch.source" >
                <Option v-for="item in sourceList" :value="item.refKey" :key="item.refKey">{{ item.refValue }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Col>
      <Col span="4">
        <Button type="ghost" style="float:right;margin-left:10px;" @click="doReset()">重置</Button>
        <Button type="primary" style="float:right" @click="search()">查询</Button>
        </Col>
        <Col span="24">
        <Button type="primary" style="float:right;margin-bottom:10px;" @click="add()" >新增</Button>
        </Col>
      </Row>
    </Form>
    <Table border :columns="customerList" :data="customerData"></Table>
    <Page :total="total" :page-size="pageSize" size="small"  show-elevator show-sizer show-total style="float: right;margin-top: 10px" @on-change="doPageChange"></Page>
    <Modal v-model="delCustomer" width="460">
      <p slot="header" style="color:#f60;text-align:left">
        <Icon type="information-circled"></Icon>
        <span>提示信息</span>
      </p>
      <div style="margin:10px">
          <span style="font-size:16px">您确定要删除此客户(<span>编码:{{ delCustomerCode }},名称:{{ delCustomerName }}</span>)吗？</span>
        </div>
      <div slot="footer">
        <Button type="text" size="large" @click="delCustomer=false">取消</Button>
        <Button type="error" size="large"  @click="doDel">删除</Button>
      </div>
    </Modal>
    <Modal
      title="客户信息"
      v-model="customerInfo"
      :mask-closable="false"
      width="850px">
      <Form :model="formCustomer"  label-position="top" ref="formCustomer" :rules="ruleValidate">
        <Row :gutter="10">
          <Col span="8">
          <FormItem label="客户编码" prop="customerCode">
            <Input :disabled="disabledInput" v-model="formCustomer.customerCode"  placeholder="请输入客户编码"></Input>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="客户中文名称" prop="customerName">
            <Input v-model="formCustomer.customerName"  placeholder="请输入客户中文名称" ></Input>
          </FormItem>
          </Col>
          <Col span="8" >
          <FormItem label="客户英文名称" prop="customerNameEn">
            <Input v-model="formCustomer.customerNameEn" placeholder="请输入客户英文名称"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row :gutter="10">
          <Col span="8">
          <FormItem label="联系电话" prop="customerPhone">
            <Input v-model="formCustomer.customerPhone"  placeholder="请输入联系电话"></Input>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="传真">
            <Input v-model="formCustomer.customerFax"  placeholder="请输入传真"></Input>
          </FormItem>
          </Col>
          <Col span="8" >
          <FormItem label="电子邮箱" prop="customerEmail">
            <Input v-model="formCustomer.customerEmail" placeholder="请输入电子邮箱"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row :gutter="10">
          <Col span="8">
            <FormItem label="客户网站">
              <Input v-model="formCustomer.customerWebsite" placeholder="请输入客户网站"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="客户来源" prop="source" >
              <Select v-model="formCustomer.source" >
                <Option v-for="item in editsourceList" :value="item.refKey" :key="item.refKey">{{ item.refValue }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="客户类型" prop="customerType" :required="true">
            <Select v-model="formCustomer.customerType" multiple>
              <Option v-for="item in edittypeList" :value="item.refKey" :key="item.refKey">{{ item.refValue }}</Option>
            </Select>
          </FormItem>
          </Col>
          </Row>
          <Row :gutter="10">
          	<Col span="24" style = "float: right;">
            	<FormItem label="备注">
              	<Input type="textarea" v-model="formCustomer.remarks" :rows="3" placeholder="请输入备注信息"></Input>
            	</FormItem>
          	</Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="doCancleForm('formCustomer')">取消</Button>
        <Button type="primary" size="large"  @click="doCustomerSave('formCustomer')">保存</Button>
      </div>
    </Modal>
    <Modal
      title="主账号信息"
      v-model="memberInfo"
      :mask-closable="false"
      width="860px">
      <Form :model="formMember" label-position="top" ref="formMember" :rules="ruleMemberValidate">
        <Row :gutter="10">
          <Col span="8">
         
          <FormItem label="用户名" prop="usernameCheck">
            <Input v-model="formMember.usernameCheck" :disabled="this.insertOrUpdate!='create'"  placeholder="请输入用户名"></Input>
             <Input v-show="false" v-model="formMember.customerCode"></Input>
             <Input v-show="false" v-model="formMember.memberId"></Input>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="人员姓名" prop="memberName">
            <Input v-model="formMember.memberName" placeholder="请输入人员姓名" :disabled="this.insertOrUpdate!='create'"></Input>
          </FormItem>
          </Col>
          <Col span="8" >
          <FormItem label="性别" prop="sex">
            <Select v-model="formMember.sex" :disabled="this.insertOrUpdate!='create'">
              <Option value="M">男</Option>
              <Option value="F">女</Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
        <Row :gutter="10">
          <Col span="8">
          <FormItem label="联系电话" prop="mobile">
            <Input v-model="formMember.mobile" placeholder="请输入联系电话" :disabled="this.insertOrUpdate!='create'"></Input>
          </FormItem>
          </Col>
          <Col span="8" >
          <FormItem label="电子邮箱" prop="email">
            <Input v-model="formMember.email" placeholder="请输入电子邮箱" :disabled="this.insertOrUpdate!='create'"></Input>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="是否可用" prop="status">
            <Select v-model="formMember.status" :disabled="this.insertOrUpdate!='create'">
              <Option value="00">可用</Option>
              <Option value="01">不可用</Option>
              <Option value="02">已删除</Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
        <Row :gutter="10">
          <Col span="24" >
          <FormItem label="备注">
            <el-input type="textarea" v-model="formMember.remarks" :disabled="this.insertOrUpdate!='create'"  placeholder="请输入备注信息"></el-input>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="clearMemberInfo()">取消</Button>
        <Button type="primary" v-if="this.insertOrUpdate=='create'" size="large"  @click="doMemberSave('formMember')">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import swal from 'sweetalert2'
  export default {
    data () {
      const customerTypeChecker = (rule, value, callback) => {
              if (value!=null && value.length>0) {
                  callback();
              }else{callback(new Error('客户类型不能为空'));}
        };
        const validateCustomerPhone = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入联系电话'));
          } else {
            if (!/^1(3|4|5|7|8)\d{9}$/.test(value) && !/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(value)) {
              callback(new Error('请输入正确的电话/手机号码'));
            }
            callback();
          }
        };
      return {
        loading: true,initStartIndex:0,initEndIndex:10,editsourceList:[],
        sourceList:[],disabledInput:false,insertOrUpdate:"",delCustomerCode:'',
        delCustomerName:'',delCustomer:false,customerInfo:false,memberInfo:false,
        total:0,pageSize:10, 
        formCustomer:{
            isValid:true,customerCode:'',customerName:'',
            customerNameEn:'' ,customerPhone:'' ,customerEmail:'',
            customreFax:'' ,customerWebsite:'',buyer:'N',
            saler:'N',warehouser:'N',source:'',status:'00',
            remarks:'',province:'',city:'',district:'',address:'',
            postcode:'',customerType:[]
        },
        ruleValidate: {
          customerCode: [
            { required: true, message: '客户编码不能为空', trigger: 'blur' }
          ],
          customerName: [
            { required: true, message: '客户名称不能为空', trigger: 'blur' }
          ],
          customerNameEn: [
            { required: true, message: '客户英文名称不能为空', trigger: 'blur' }
          ],
          customerPhone: [
            { required: true,validator:this.$validate.validatePhone, trigger: 'blur' }
          ],
          source: [
            { required: true, message: '客户来源不能为空', trigger: 'change' }
          ],
          customerType: [
            {validator:customerTypeChecker, trigger: 'change' }
          ],
          customerEmail: [
            {validator:this.$validate.validateEmail, trigger: 'blur' }
          ],
        },
        formSearch:{customerName:'',customerType:'',source:''},
        formMember:{
          userId: '',usernameCheck: '', customerCode:'',memberName:'',username:'',//username貌似是关键字
          memberSex:'',memberPhone:'',memberEmail:'',memberRemarks:'',
          sex:'',mobile: '',email: '',memberType:[],userType: 'SYS',remarks: '',status:'00'
        },
        ruleMemberValidate:{
          
          memberName: [
            { required: true, message: '人员姓名不能为空', trigger: 'blur' }
          ],
          usernameCheck: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
          sex: [
            { required: true, message: '性别不能为空', trigger: 'change' }
          ],
          mobile: [
            { required: true, validator:validateCustomerPhone, trigger: 'blur' }
          ],
          status: [
            { required: true, message: '状态不能为空', trigger: 'change' }
          ],
          email: [
            {  validator:this.$validate.validateEmail, trigger: 'blur' }
          ],
        },

        typeList:[{'refKey':'0000','refValue':'全部'},{'refKey':'BUYER','refValue':'采购客户'},{'refKey':'WAREHOUSER','refValue':'仓储客户'},{'refKey':'SALER','refValue':'供应商客户'}],
        edittypeList:[{'refKey':'BUYER','refValue':'采购客户'},{'refKey':'WAREHOUSER','refValue':'仓储客户'},{'refKey':'SALER','refValue':'供应商客户'}],
        customerList: [
          { type: 'index', width: 60,  align: 'center' },
          { title: '客户编号', key: 'customerCode', align: 'center' , width: 150},
          { title: '客户名称', key: 'customerName', align: 'center' },
          { title: '客户类型',align: 'center',
            render: (h, params) => {
              var cusType = (params.row.buyer === 'Y' ?  "采购客户 ":"");
              cusType += (params.row.warehouser === 'Y' ? "仓储客户 ":"");
              cusType += (params.row.saler === 'Y' ? "供应商客户":"");
              return cusType;}},
          { title: '状态',align: 'center' ,width: 70 ,
            render: (h, params) => {return params.row.status === '00' ? "可用": "不可用";}},
          { title: '客户来源',align: 'center' ,width: 90,
            render: (h, params) => {
              for(let record of this.sourceList){if(params.row.source === record.refKey){return record.refValue;}}
           }},
          { title: '操作', key: 'action', width: 210, align: 'center',
            render: (h, params) => {
              if(params.row.userInfo == null && params.row.source != 'B2B'){
                return h('div', [
                  h('Button', { props: {  type: 'primary', size: 'small' }, style: { marginRight: '5px' },
                    on: { click: () => { this.showMemberinfo(params.row) } } }, '设置主账户'),
                  h('Button', { props: {  type: 'primary', size: 'small' }, style: { marginRight: '5px' },
                    on: { click: () => { this.show(params.row) } } }, '详情'),
                  h('Button', { props: { type: 'error', size: 'small' },
                    on: { click: () => { this.del(params.row) } } }, '删除')
                ]);
              }else{
                return h('div', [
                  h('Button', { props: {  type: 'ghost', size: 'small' }, style: { marginRight: '5px' },
                    on: { click: () => { this.showMemberinfo(params.row) } } }, '查看主账户'),
                  h('Button', { props: {  type: 'primary', size: 'small' }, style: { marginRight: '5px' },
                    on: { click: () => { this.show(params.row) } } }, '详情'),
                  h('Button', { props: { type: 'error', size: 'small' },
                    on: { click: () => { this.del(params.row) } } }, '删除')
                ]);
              }

            }
          }
        ],
        customerData: []
      }
    },
    methods: {
      show (row) {this.$refs["formCustomer"].resetFields();
          this.disabledInput = true;
          this.customerInfo = true;
          this.insertOrUpdate = "update";

          this.formCustomer = row;
          let typeList = [];

          if(this.formCustomer.buyer == "Y"){
            typeList.push("BUYER")
          }
          if(this.formCustomer.warehouser == "Y"){
            typeList.push("WAREHOUSER")
          }
          if(this.formCustomer.saler == "Y"){
            typeList.push("SALER")
          }
          this.formCustomer.customerType = typeList;
      },
      clearMemberInfo(){
          this.formMember = {
              userId: null,usernameCheck: '',customerCode:'',memberName:'',
              memberSex:'',memberPhone:'',memberEmail:'',memberRemarks:'',
              sex:'',mobile: '',email: '',memberType:[],userType: 'SYS',remarks: '',status:'00'
          };
          this.memberInfo = false;
      },
      showMemberinfo (row) {
          this.clearMemberInfo();
          this.memberInfo = true;
          this.formMember.customerCode = row.customerCode;
          this.$refs["formMember"].resetFields();
          this.insertOrUpdate = row.source == 'B2B' ? "update" : "create";
          if(row.userInfo != null){
              this.insertOrUpdate = "update";
              this.formMember = row.userInfo;
              this.formMember.usernameCheck = row.userInfo.username;
              this.formMember.memberName = row.userInfo.realname;
          }
      },
      doMemberSave(name){
        this.$refs["formMember"].validate((valid)=> {
            if (valid) {
                this.formMember.username = this.formMember.usernameCheck;
                this.$api.doMemberSave(this.formMember,this.insertOrUpdate).then(res => {
                if(res.status == "S"){
                    this.insertOrUpdate = ''
                    swal({text: '保存成功!',type: 'success',showCancelButton: false,width:300}).then((isConfirm)=>{this.memberInfo = false;this.search();});
                }else{
                    swal('操作失败', res.message, 'error');
                }
            })
          }
        })
      },
      del(row) {
          this.delCustomer = true;
          this.delCustomerName = row.customerName;
          this.delCustomerCode = row.customerCode;
      },
      doDel(){
        this.$api.doCustomerDel(this.delCustomerCode).then(res => {
          if(res.status == "S"){
            swal({text: '保存成功!',type: 'success',showCancelButton: false,width:300}).then((isConfirm)=>{this.delCustomer = false;this.search();});
          }else{
            swal("操作失败",res.message,'error');
          }
        })
      },
      doReset(name){
        this.formSearch['customerName'] = '';
        this.formSearch['customerType'] = '0000';
        this.formSearch['source'] = '0000';
      },
      add(){
        this.disabledInput = false;
        this.customerInfo = true;
        this.insertOrUpdate = "create";
        this.$refs["formCustomer"].resetFields();
      	this.formCustomer= {
        	  customerCode:'',customerName:'',customerNameEn:'' ,customerPhone:'' ,
            customerEmail:'',customreFax:'' ,customerWebSite:'',buyer:'N',
            saler:'N',warehouser:'N',source:'',status:'00',remarks:'',province:'',
            city:'',district:'',address:'',postcode:'',customerType:[]
      	};
      },
      search(){
          this.doCustomerList(this.initStartIndex,this.initEndIndex);
      },
      doCustomerList(startIndex,endIndex){
        let params = {
            startIndex:startIndex,
            endIndex:endIndex,
            customerName:this.formSearch.customerName,
            customerType:this.formSearch.customerType === '0000' ? '' : this.formSearch.customerType,
            source:this.formSearch.source === '0000' ? '' : this.formSearch.source
        }
        this.$api.doCustomerList(params).then(res => {
          this.customerData = [];
          if(res.status == "S"){
            this.total = res.result.total;
            this.customerData = res.result.records;
          }else{
            swal('获取客户列表失败', res.message, 'error');
          }
        })
      },

      //change page number
      doPageChange(pagenumber){
        let startIndex = ( pagenumber - 1 ) * this.pageSize;
        let endIndex = pagenumber * this.pageSize;
        this.doCustomerList(startIndex,endIndex);
      },
      doCustomerInfo(customerCode){
        this.$api.doCustomerInfo(customerCode).then(res => {
          if(res.status == "S"){
            this.customerInfo = false;
            swal({text: '保存成功!',type: 'success',showCancelButton: false,width:300}).then((isConfirm)=>{this.search();});
          }else{
            swal("操作失败",res.message,'error');
          }
        })
      },
      doCustomerSave(name){
        let isValid = true;
        this.$refs[name].validate(function(valid) {
          if (!valid) {
            isValid = valid
            return;
          }
        })
        if(!isValid){return;}
        this.formCustomer.buyer='N'
        this.formCustomer.warehouser='N'
        this.formCustomer.saler='N'
        for(let cusType of this.formCustomer.customerType){
          if(cusType == "BUYER"){
            this.formCustomer.buyer = "Y";
          }
          if(cusType == "WAREHOUSER"){
            this.formCustomer.warehouser = "Y";
          }
          if(cusType == "SALER"){
            this.formCustomer.saler = "Y";
          }
        }
        this.$api.doCustomerSave(this.formCustomer,this.insertOrUpdate).then(res => {
          
          if(res.status == "S"){
           
            swal({text: '保存成功!',type: 'success',showCancelButton: false,width:300}).then((isConfirm)=>{ this.customerInfo = false;this.search();});
          }else{
            swal("操作失败",res.message,'error');
          }
        })
      },
      doCancleForm(name){
          if(this.insertOrUpdate == "create"){
              this.$refs[name].resetFields();
          }
          this.customerInfo = false;
      },

      doSourcelList(){
        this.sourceList = [];
        let sourceParams = {category:'CUSTOMER_SOURCE'};
        this.$api.getParamCategory(sourceParams).then(res => {
          if(res.status == "S"){
            this.editsourceList = res.result;
            this.sourceList.push({"refKey":"0000","refValue":"全部"});
            for(let record of res.result){
              this.sourceList.push(record);
            }
          }else{
            swal({text:res.result.error,type: 'error',showCancelButton: false,width:300});
          }
        })
      },
      doCustomerTypeList() {
        let sourceParams = {category:'CUSTOMER_STATUS'};
        this.$api.getParamCategory(sourceParams).then(res => {
          this.total = res.result.total;
          if(res.status == "S"){
            for(let record of res.result){
              console.log(this.record);
            }
          }else{
            swal({text:res.result.error,type: 'error',showCancelButton: false,width:300});
          }
        })
      },
      loadData(){
          this.doCustomerList(this.initStartIndex,this.initEndIndex);
      }
    },
    created(){this.doReset();
        this.doSourcelList();
      	this.loadData();
    }
  }
</script>
