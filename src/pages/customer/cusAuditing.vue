<template>
  <div>
    <Breadcrumb>
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>云仓客户管理</BreadcrumbItem>
      <BreadcrumbItem>云仓账户申请审核</BreadcrumbItem>
    </Breadcrumb>
    <Form :model="formSearch" :label-width="80" style="margin-top: 20px">
      <Row>
        <Col span="20">
          <Col span="8">
            <FormItem label="请求编号">
              <Input v-model="formSearch.requestId" placeholder="请输入请求编号"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="申请用户名">
              <Input v-model="formSearch.requestUsername" placeholder="请输入申请用户名"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="申请状态">
              <Select v-model="formSearch.requestStatus" placeholder="请选择申请状态">
                <Option value="0000">全部</Option>
                <Option value="01">申请中</Option>
                <Option value="00">审核通过</Option>
                <Option value="02">审核失败</Option>
              </Select> 
            </FormItem>
          </Col>
        </Col>
        <Col span="4">
        <Button type="ghost" style="float:right;margin-left:10px;" @click="doSearchReset('formSearch')">重置</Button>
        <Button type="primary" style="float:right" @click="search()">查询</Button>
        </Col>
      </Row>
      <Row>
          <Col span="20">
          <Col span="16">
          <FormItem label="申请日期">
            <DatePicker v-model="formSearch.requestStartDate" type="date" placeholder="开始日期"  style="width:135px"></DatePicker>
            ~
            <DatePicker v-model="formSearch.requestEndDate" type="date" placeholder="结束日期"  style="width:135px"></DatePicker>
          </FormItem>
          </Col>
          </Col>
        </Row>
    </Form>
    <Table border :columns="coloums" :data="coloumsData"></Table>
    <Page :total="total" :page-size="pageSize" size="small"  show-elevator show-sizer show-total style="float: right;margin-top: 10px" @on-change="doPageChange"></Page>
    
    <Modal
      title="云仓账户申请审核"
      v-model="customerInfo"
      :mask-closable="false"
      width="960px">
      <Tabs :animated="false" style="min-height:200px">
        <TabPane label="申请信息">
          <Row style="margin-left:4px;font-size:13px">
            <Col span="2" style="text-align: right;">
              <span><B>申请编号：</B></span>
          </Col>
          <Col span="16" style="text-align: left;">
              <span>{{formAudting.requestId}}</span>
          </Col>
          </Row>
          <BR/>
          <Row style="margin-left:4px;font-size:13px">
          <Col span="2" style="text-align: right;">
              <span><B>申请渠道：</B></span>
          </Col>
          <Col span="5" style="text-align: left;">
              <span>{{formAudting.requestSource}}</span>
            </Col>
             <Col span="2" style="text-align: right;">
              <span><B>申请时间：</B></span>
          </Col>
          <Col span="5" style="text-align: left;">
              <span>{{formAudting.requestDate}}</span>
            </Col>
          <Col span="2" style="text-align: right;">
              <span><B>申请账户：</B></span>
          </Col>
          <Col span="5" style="text-align: left;">
              <span>{{formAudting.requestUsername}}</span>
            </Col>  
          </Row>
          <BR/>
          <Row style="margin-left:4px;font-size:13px">
            <Col span="2" style="text-align: right;">
              <span><B>企业名称：</B></span>
          </Col>
          <Col span="5" style="text-align: left;">
              <span>{{formAudting.requestOwnerName}}</span>
            </Col>
             <Col span="2" style="text-align: right;">
              <span><B>企业法人：</B></span>
          </Col>
          <Col span="5" style="text-align: left;">
              <span>{{formAudting.requestOwnerBoss}}</span>
            </Col>
             <Col span="2" style="text-align: right;">
              <span><B>工商号：</B></span>
          </Col>
          <Col span="5" style="text-align: left;">
              <span>{{formAudting.requestOwnerBizCode}}</span>
            </Col>
          </Row>
          <BR/>
          <Row style="margin-left:4px;font-size:13px">
            <Col span="2" style="text-align: right;">
              <span><B>企业地址：</B></span>
          </Col>
          <Col span="5" style="text-align: left;">
              <span>{{formAudting.requestOwnerAddress}}</span>
            </Col>
             <Col span="2" style="text-align: right;">
              <span><B>联系人：</B></span>
          </Col>
          <Col span="5" style="text-align: left;">
              <span>{{formAudting.requestOwnerPerson}}</span>
            </Col>
             <Col span="2" style="text-align: right;">
              <span><B>联系电话：</B></span>
          </Col>
          <Col span="5" style="text-align: left;">
              <span>{{formAudting.requestOwnerMobile}}</span>
            </Col>
          </Row>
      </TabPane>

      <TabPane label="云仓注册信息" v-if="showBtn">
          <Form :model="formAudting" label-position="top" ref="formAudting" :rules="ruleValidate">
          <Row :gutter="10">
            <Col span="8">
            <FormItem label="对应云仓客户" placeholder="请选择对应云仓客户" prop="cwCustomerCode">
              <Select v-model="formAudting.cwCustomerCode">
                <Option v-for="item in customerList" :value="item.customerCode">{{ item.customerName }}</Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="云仓登录账户" prop="requestUsername">
                <Input v-model="formAudting.requestUsername"  placeholder="请输入云仓登录账户" :disabled=true></Input>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="10">
            <Col span="4">
            <FormItem label="登录账户姓名" placeholder="请选择登录账户姓名" prop="realName">
              <Input v-model="formAudting.realName"  placeholder="请输入登录账户姓名"></Input>
            </FormItem>
            </Col>
            <Col span="4">
            <FormItem label="性别" placeholder="请选择登录账户姓名" prop="sex">
              <Select v-model="formAudting.sex">
                <Option value="M">男</Option>
                <Option value="F">女</Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="登录账户手机号码" prop="mobile">
                <Input v-model="formAudting.mobile"  placeholder="请输入登录账户手机号码"></Input>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="登录账户邮箱地址" prop="email">
                <Input v-model="formAudting.email"  placeholder="请输入登录账户邮箱地址"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="10">
            <Col span="24" style = "float: right;">
              <FormItem label="备注" prop="responseRemark">
                <Input type="textarea" v-model="formAudting.responseRemark" :rows="6" placeholder="请输入备注信息"></Input>
              </FormItem>
            </Col>
        </Row>
          </Form>
      </TabPane>


      <TabPane label="云仓注册信息" v-if="!showBtn">
          <Row style="margin-left:4px;font-size:13px">
          <Col span="3" style="text-align: right;">
              <span><B>云仓客户名称：</B></span>
          </Col>
          <Col span="5" style="text-align: left;">
              <span v-if="userRequest.customer!=null">{{userRequest.customer.customerName}}</span>
              <span v-else>-/-</span>
            </Col>
             <Col span="3" style="text-align: right;">
              <span><B>云仓登录账户：</B></span>
          </Col>
          <Col span="5" style="text-align: left;">
              <span>{{userRequest.user.username}}</span>
            </Col>
          <Col span="3" style="text-align: right;">
              <span><B>登录账户姓名：</B></span>
          </Col>
          <Col span="5" style="text-align: left;">
              <span>{{userRequest.member.memberName}}</span>
            </Col>  
          </Row>
          <BR/>
          <Row style="margin-left:4px;font-size:13px">
          <Col span="3" style="text-align: right;">
              <span><B>联系电话：</B></span>
          </Col>
          <Col span="5" style="text-align: left;">
              <span>{{userRequest.requestOwnerMobile}}</span>
            </Col>
             <Col span="3" style="text-align: right;">
              <span><B>审批时间：</B></span>
          </Col>
          <Col span="5" style="text-align: left;">
              <span>{{userRequest.responseDate}}</span>
            </Col>
          <Col span="3" style="text-align: right;">
              <span><B>审批结果：</B></span>
          </Col>
          <Col span="5" style="text-align: left;">
              <span v-if="userRequest.requestStatus=='01'"><Tag color="yellow">申请中</Tag></span>
              <span v-if="userRequest.requestStatus=='02'"><Tag color="red">审核失败</Tag></span>
              <span v-if="userRequest.requestStatus=='00'"><Tag color="green">审核通过</Tag></span>
            </Col>  
          </Row>
          <BR/>
          <Row style="margin-left:4px;font-size:13px">
          <Col span="3" style="text-align: right;">
              <span><B>备注：</B></span>
          </Col>
          <Col span="21" style="text-align: left;">
              <span>{{userRequest.responseRemark}}</span>
          </Col>
          </Row>
      </TabPane>


    </Tabs>

      <div slot="footer">
          <Button type="text" size="large" @click="doCancleForm">取消</Button>
          <Button type="error" size="large" @click="doSave('N')" v-if="showBtn">审核失败</Button>
          <Button type="primary" size="large" @click="doSave('Y')" v-if="showBtn">审核通过</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import swal from 'sweetalert2'
  import dateUtil from 'iview/src/utils/date'
  export default {
    data() {
      return {
        customerInfo: false,showBtn:false,customerList:[{customerCode:'',customerName:''}],
        total:0,pageSize:10,
        formAudting:{requestId:'',cwCustomerCode:'',requestUsername:'',requestStatus:'',requestUsername:'',responseRemark:'',sex:'M',realName:'',mobile:'',email:''},
        userRequest:{customer:{customerName:''},user:{userName:''},member:{memberName:''}},
        formSearch: {requestId:'', requestStatus:'',requestUsername:'',requestStartDate:'',requestEndDate:''},
        coloums: [
          {type: 'index', width:45, align: 'center'},
          {title: '申请编号', key: 'requestId', align: 'center', width: 160}, 
          {title: '申请日期', key: 'requestDate', align: 'center', width: 160},
          {title: '申请渠道',key: 'requestSource',align: 'center', width: 85},         
          {title: '企业名称', key: 'requestOwnerName', align: 'center'},
          {title: '法人', key: 'requestOwnerBoss', align: 'center'},
          { title: '工商注册号',key: 'requestOwnerBizCode',align: 'center'},
          {title: '申请用户名', key: 'requestUsername', align: 'center'},
          {title: '状态',key: 'requestStatus',align: 'center', width: 110,render: (h, params) => { 
              if(params.row.requestStatus == '01'){
                return h('Tag', {props:{color: 'yellow'}},"申请中")
              }else if(params.row.requestStatus == '00'){
                return h('Tag', {props:{color: 'green'}},"审核通过")
              }else if(params.row.requestStatus == '02'){
                return h('Tag', {props:{color: 'red'}},"审核失败")
              }
          } },
          {title: '操作', key: 'action', width: 70, align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {type: 'primary', size: 'small'}, style: {marginRight: '5px'},
                  on: {click: () => {this.show(params.row)}}},'详情')
              ]);
            }
          }
        ],
        coloumsData: [],

        ruleValidate: {
          cwCustomerCode: [
            { required: true, message: '对应云仓客户不能为空', trigger: 'blur'}
          ],
          requestUsername: [
            { required: true, message: '云仓客户管理员账户不能为空', trigger: 'blur'}
          ],
          realName: [
            { required: true, message: '登录账户姓名不能为空', trigger: 'blur'},
            { type: 'string', max:40, message: '登录必须少于40个字符', trigger: 'blur'}
          ],
          mobile: [
            { required: true,validator:this.$validate.validatePhone, trigger: 'blur' }
          ],
          email: [
            { type: 'string', max:60, message: '电子邮件必须少于60个字符', trigger: 'blur'}
          ],
          responseRemark: [
            { type: 'string', max:400, message: '备注必须少于400个字符', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      doSearchReset() {
        this.formSearch['requestId'] = '';
        this.formSearch['requestStatus'] = '0000';
        this.formSearch['requestUsername'] = '';

        var now = new Date() , nowTime = now.getTime() ,day = now.getDay();
        var oneDayTime = 24*60*60*1000 ; 
        var MondayTime = nowTime - (day-1)*oneDayTime ; 
        var SundayTime =  nowTime + (7-day)*oneDayTime ;

        this.formSearch.requestStartDate = new Date(MondayTime)
        this.formSearch.requestEndDate = new Date(SundayTime)
      },
      show(row) {
          this.showBtn = row.requestStatus == "01"
          this.formAudting = row;
          this.formAudting.cwUserid = row.requestUsername
          this.formAudting.realName = row.requestOwnerPerson
          this.formAudting.mobile = row.requestOwnerMobile
          this.formAudting.requestId = row.requestId;
          if(this.showBtn){
            this.$api.doCustomerList({startIndex:0,endIndex:99999,customerName:'',customerType:''}).then(res => {
              if(res.status == "S"){
                  this.customerInfo = true;
                  this.customerList = res.result.records
              }else{
                  swal({text:res.message,type: 'error',showCancelButton: false,width:300});
              }
            })  
          }else{
            this.$api.getUserRequestDetails(row.requestId).then(res => {
              if(res.status == "S"){
                  this.customerInfo = true;
                  this.userRequest = res.result
              }else{
                  swal({text:res.message,type: 'error',showCancelButton: false,width:300});
              }
            })  
          }      
      },
      doSave(result){
          if(!confirm("您确认要"+("Y"==result ? "通过":"拒绝")+"该申请吗 ？ ")){
              return false;
          }
          let validateResult = true;
          if("Y" == result){
            this.$refs['formAudting'].validate(function(valid){validateResult = valid});
          }
          this.formAudting.result = result;
          if(validateResult){
            this.$api.doBindCus(this.formAudting).then(res => {
                this.loading = false;
                if(res.status == "S"){
                  this.customerInfo = false;
                  swal({text: '操作成功!',type: 'success',showCancelButton: false,width:300}).then((isConfirm)=>{this.search();});
                }else{
                  swal({text:res.message,type: 'error',showCancelButton: false,width:300});
                }
            })
          }
      },
      doCancleForm(name){
          this.customerInfo = false; 
          this.formAudting={requestId:'',cwCustomerCode:'',requestUsername:'',requestStatus:'',requestUsername:'',responseRemark:'',sex:'M',realName:'',mobile:'',email:''}
      },
      search(startIndex,endIndex) {
        if(!startIndex) startIndex = this.$table.INIT_START_INDEX;
        if(!endIndex)endIndex = this.$table.INIT_END_INDEX
        let lStartIndex = startIndex;
        let lEndIndex = endIndex;
        let params = {
            startIndex: lStartIndex,
            endIndex: lEndIndex,
            requestId: this.formSearch.requestId,
            requestStatus:this.formSearch.requestStatus === '0000' ? '' : this.formSearch.requestStatus,
            requestUsername:this.formSearch.requestUsername,
            requestStartDate:dateUtil.format(this.formSearch.requestStartDate,'yyyy-MM-dd'),
            requestEndDate:dateUtil.format(this.formSearch.requestEndDate,'yyyy-MM-dd')
        }
        this.$api.doB2BList(params).then(res => {
            this.customerData = [];
            if (res.status == "S") {
                this.total = res.result.total;
                this.coloumsData = res.result.records
              } else {
                  swal('获取云仓账户申请列表失败', res.result.error, 'error');
              }
            })
      },
      doPageChange(pagenumber){
          let startIndex = ( pagenumber - 1 ) * this.pageSize;
          let endIndex = pagenumber * this.pageSize;
          this.search(startIndex,endIndex);
      }
    },
    created() {
        this.doSearchReset();this.search();
    }
  }
</script>
