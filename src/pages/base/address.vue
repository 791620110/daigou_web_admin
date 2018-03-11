<template>
  <div>
    <Breadcrumb>
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>系统设置</BreadcrumbItem>
      <BreadcrumbItem>采购商信息管理</BreadcrumbItem>
    </Breadcrumb>
    <Form :model="formSearch" :label-width="105" style="margin-top: 20px">
      <Row>
      <Col span="20">
       <Col span="8">
        <FormItem label="采购商名称">
            <Input v-model="formSearch.addrName" placeholder="请输入采购商名称"></Input>
          </FormItem>
       </Col>
       <Col span="8">
        <FormItem label="采购商联系人">
            <Input v-model="formSearch.contactPerson" placeholder="请输入采购商联系人"></Input>
          </FormItem>
       </Col>
       <Col span="8">
        <FormItem label="工商编号">
            <Input v-model="formSearch.addrCode" placeholder="请输入工商编号"></Input>
          </FormItem>
       </Col>
      </Col>
        <Col span="4">
          <Button type="ghost" style="float:right;margin-left: 10px;" @click="doSearchReset()">重置</Button>
          <Button type="primary" style="float:right;" @click="search()">查询</Button>
        </Col>
        <Col span="24">
        <Button type="primary" style="float:right;margin-bottom: 10px;" @click="add()">新增</Button>
        </Col>
      </Row>
    </Form>
    <Table border :columns="addressList" :data="addressListData"></Table>
    <Page :total="total" size="small" show-elevator show-sizer style="float: right;margin-top: 10px"></Page>
    <Modal v-model="delAddress" width="460">
      <p slot="header" style="color:#f60;text-align:left">
        <Icon type="information-circled"></Icon>
        <span>提示信息</span>
      </p>
      <div style="margin:10px">
          <span style="font-size:16px">您确定要删除此地址信息(<span style="font-size:14px">地址类型:{{ delAddressType }} , 地址名称:{{delAddressName}}</span>)吗？</span>
        </div>
      <div slot="footer">
        <Button type="text" size="large" @click="deleteCancel">取消</Button>
        <Button type="error" size="large"  @click="doDel">删除</Button>
      </div>
    </Modal>

    <Modal
      title="采购商信息"
      v-model="addressInfo"
      :mask-closable="false"
      :loading="loading"
      @on-ok="doSave('formAddress')"
      @on-cancel="modalCancel('formAddress')"
      width="850px">
      <Form :model="formAddress" label-position="top" ref="formAddress" :rules="ruleValidate">
        <Row :gutter="10">          
          <Col span="8">
            <FormItem label="采购商名称" prop="addrName">
              <Input v-model="formAddress.addrName"  placeholder="请输入采购商名称"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="工商编号" prop="addrCode">
              <Input v-model="formAddress.addrCode"  placeholder="请输入工商编号"></Input>
            </FormItem>
          </Col>
          </Row>

          <Row :gutter="10">
          <Col span="8">
            <FormItem label="联系人" prop="contactPerson">
              <Input v-model="formAddress.contactPerson"  placeholder="请输入联系人"></Input>
            </FormItem>
          </Col>
          <Col span="16">
            <FormItem label="所在省 / 市 / 区" prop="distpicker">
                <areaselect ref="areaselect" :level="2" type="text" v-model='distpicker' placeholder="请选择省/市/区"></areaselect>
            </FormItem>
           </Col>
          </Row>
          <Row :gutter="10">
          <Col span="8">
            <FormItem label="联系人手机" prop="contactMobile">
              <Input v-model="formAddress.contactMobile"  placeholder="请输入联系人手机"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="街区地址" prop="address">
              <Input v-model="formAddress.address"  placeholder="请输入街区地址"></Input>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="邮编" prop="postcode">
              <Input v-model="formAddress.postcode"  placeholder="请输入地址邮编"></Input>
            </FormItem>
          </Col>
          </Row>
          <Row :gutter="10">
          	<Col span="24" style = "float: right;">
            	<FormItem label="备注" prop="addrRemarks">
              	<Input type="textarea" v-model="formAddress.addrRemarks" :rows="2" placeholder="请输入备注信息"></Input>
            	</FormItem>
          	</Col>
        </Row>

      </Form>

    </Modal>
  </div>
</template>
<script>
  import areaselect from '../../components/area-select.vue';
  import swal from 'sweetalert2'
  export default {
    components: {areaselect},
    data () {
      return {
        loading:true,
		    delAddressType:'',delAddressName:'',delAddrId:'', delAddress:false,addressInfo:false,addrTypeList:[],total:0,pageSize:10,
        formAddress:{addrId:'',customerCode:'',addrType:'01',addrCode:'',addrName:'', province:'',city:'',district:'',address:'',provinceCode:'',cityCode:'',districtCode:'',postcode:'',contactPerson:'',contactMobile:'',addrRemarks:'',contactPhone:''},distpicker:[],
        formSearch:{ addrName:'', addrCode:'',addrType:'',contactPerson:'',contactMobile:''},
        addressList: [
          { type: 'index', width: 60,  align: 'center' },
          
          { title: '采购商名称', key: 'addrName', align: 'center'  },
          { title: '省 / 市 / 区',key: 'pcd',align: 'center'},
          { title: '街区地址', key: 'address',  align: 'center'},
          { title: '联系人', key: 'contactPerson', align: 'center' , width:100},
          { title: '工商编号', key: 'addrCode', align: 'center'},
          { title: '操作', key: 'action', width: 130, align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', { props: {  type: 'primary', size: 'small' }, style: { marginRight: '5px' },
                  on: { click: () => { this.show(params.row) } } }, '详情'),
                h('Button', { props: { type: 'error', size: 'small' },
                  on: { click: () => { this.del(params.row) } } }, '删除')
              ]);
            }
          }
        ],
        addressListData: [],
        ruleValidate: {
          /**addrType: [
            { required: true, message: '请选择地址类型', trigger: 'blur' }
          ],**/
          addrName: [
            { required: true, message: '采购商名称不能为空', trigger: 'blur' }
          ],
          addrCode: [
            {required: true, message: '工商编号不能为空', trigger: 'blur'}
          ],
          contactPerson: [
            { required: true, validator:this.$validate.validateRealName, trigger: 'blur' },
          ],
          contactMobile: [
            { required: true, validator:this.$validate.validatePhone , trigger: 'blur' },
            {type:"string",max: 20, message: '联系电话必须少于20个字符', trigger: 'blur'}
          ],
          address: [
            { required: true, message: '街区地址不能为空', trigger: 'blur' },
            {type:"string",max: 200, message: '街区地址必须少于200个字符', trigger: 'blur'}
          ],
          postcode: [
            {type:"string",max: 20,validator:this.$validate.validatePostCode, trigger: 'blur'}
          ],
          addrRemarks: [
            {type:"string",max: 400, message: '备注名称必须少于400个字符', trigger: 'blur'}
          ]
        },
      }
    },
    methods: {
      doSearchReset(name){
          this.formSearch['addrType'] = '0000';
          this.formSearch['addrCode'] = '';
          this.formSearch['addrName'] = '';
          this.formSearch['contactPerson'] = '';
          this.formSearch['contactMobile'] = '';
      },
      modalCancel(name) {
          this.addressInfo = false;
          this.$refs[name].resetFields();
      },
      show (row) {
        this.$refs['formAddress'].resetFields();
        let addrId = row.addrId;
        this.$api.doAddressInfo(addrId).then(res => {
          if(res.status == "S"){
           this.addressInfo = true;
            this.formAddress = res.result;
            this.distpicker.push(this.formAddress.province)
            this.distpicker.push(this.formAddress.city)
            this.distpicker.push(this.formAddress.district)
          }else{
            swal({text: '操作失败['+res.result.error+']!',type: 'error',showCancelButton: false,width:300});
          }
        })

      },
      del (row) {
        this.delAddress = true;
        this.delAddrId = row.addrId;
        this.delAddressType = row.addrTypeName;
        this.delAddressName = row.addrName;
      },
      doDel(row){
        this.$api.doAddressDel(this.delAddrId).then(res => {
          if(res.status == "S"){
            swal({text: '操作成功!',type: 'success',showCancelButton: false,width:300}).then((isConfirm)=>{this.delAddress = false;this.search(this.$table.INIT_START_INDEX,this.$table.INIT_END_INDEX)});
          }else{
            swal({text: '操作失败['+res.message+']',type: 'error',showCancelButton: false,width:300});
          }
        })
      },
      deleteCancel(){
        this.delAddress = false;
        this.delAddrId = ''
         this.delAddressType = '';
        this.delAddressName = '';
      },
      add(){
        this.$refs['formAddress'].resetFields()
        this.addressInfo = true;
      	this.formAddress={addrId:'',customerCode:'',addrType:'01',addrCode:'',addrName:'', province:'',city:'',district:'',address:'',provinceCode:'',cityCode:'',districtCode:'',postcode:'',contactPerson:'',contactMobile:'',addrRemarks:'',contactPhone:'',distpicker:[]};
      },
      doSave(name){
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
        this.formAddress.province = this.distpicker[0]
        this.formAddress.city = this.distpicker[1]
        this.formAddress.district = this.distpicker[2]
        this.$refs['formAddress'].validate((valid) => {
          if (valid) {
              this.$api.doAddressSave(this.formAddress).then(res => {
                if(res.status == "S"){
                  swal({text: '操作成功!',type: 'success',showCancelButton: false,width:300}).then((s)=>{this.search();});
                  this.addressInfo = false;
                }else{
                  swal({text: '操作失败['+res.result.error+']!',type: 'error',showCancelButton: false,width:300});
                }
              })
          } else {
              this.$Message.error('表单填写错误');
          }
        })
      },
      search(startIndex , endIndex){
        if(!startIndex) startIndex = this.$table.INIT_START_INDEX;
        if(!endIndex)endIndex = this.$table.INIT_END_INDEX
        let lStartIndex = startIndex;
        let lEndIndex = endIndex;
        let params = {
          startIndex:lStartIndex,
          endIndex:lEndIndex,
          addrName:this.formSearch.addrName,
          addrCode:this.formSearch.addrCode,
          contactPerson:this.formSearch.contactPerson,
          contactMobile:this.formSearch.contactMobile,
          addrType:this.formSearch.addrType === '0000' ? '' : this.formSearch.addrType
        }

        this.$api.doAddressList(params).then(res => {
          if(res.status == "S"){
            this.total = res.result.total;
            this.addressListData = [];
            for(let record of res.result.records){
              if(record){
                record.pcd = record.province+" / "+record.city+" / "+record.district
              }
              this.addressListData.push(record);
            }
          }else{
            swal('获取地址列表失败', res.result.error, 'error');
          }
        })
      }
    },
    created(){
        this.doSearchReset()
    	  this.search(this.$table.INIT_START_INDEX,this.$table.INIT_END_INDEX);
        
        let addresstypeparams = {category:'ADDRESS_TYPE_LIST',showLoading:"N"};
        this.$api.getParamCategory(addresstypeparams).then(res => {
          if(res.status == "S"){
            this.addrTypeList.push({"refKey":"0000","refValue":"全部"});
            for(let record of res.result){
              if(record.refKey!='00')//企业地址不显示
              this.addrTypeList.push(record);
            }
          }else{
            swal('获取参数列表失败', res.result.error, 'error');
          }
        })
    }
  }
</script>
