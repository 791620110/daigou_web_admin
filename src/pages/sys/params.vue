<template>
  <div>
    <Breadcrumb>
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>系统管理</BreadcrumbItem>
      <BreadcrumbItem>系统参数设置</BreadcrumbItem>
    </Breadcrumb>
    <Form :model="formSearch" :label-width="100" style="margin-top: 20px">
      <Row>
      <Col span="20">
	   <Col span="10">
        <FormItem label="参数分类">
            <Input v-model="formSearch.category" placeholder="请输入参数分类"></Input>
          </FormItem>
        </Col>
        <Col span="10">
        <FormItem label="参数值">
            <Input v-model="formSearch.refKey" placeholder="请输入参数值"></Input>
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
    <Table border :columns="paramList" :data="paramData"></Table>
    <Page :total="total" ref="pager" :page-size="pageSize" size="small"  show-elevator show-sizer show-total style="float: right;margin-top: 10px" @on-change="doPageChange"></Page>
    <Modal v-model="delParam" width="560"  @on-ok="doDel">
      <p slot="header" style="color:#f60;text-align:left">
        <Icon type="information-circled"></Icon>
        <span>提示信息</span>
      </p>
      <div style="margin:10px">
          <span style="font-size:16px">您确定要删除此参数设置吗？<BR/>(<span style="font-size:14px">参数分类:{{ delParamCategory }} 
           , 参数值:{{delParamKey}} , 参数名称:{{delParamValue}}</span>)</span>
        </div>
      <div slot="footer">
        <Button type="text" size="large" @click="deleteCancel">取消</Button>
        <Button type="error" size="large"  @click="doDel">删除</Button>
      </div>
    </Modal>
    <Modal
      title="参数信息"
      v-model="paramInfo"
      :mask-closable="false"
      :loading="true"
      width="850px">
      <Form :model="formParam" label-position="top" ref="formParam" :rules="ruleValidate">
        <Row :gutter="10">
          <Col span="8">
            <FormItem label="参数分类" prop="category">
              <Input v-model="formParam.category"  placeholder="请输入参数分类"></Input>
            </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="参数值" prop="refKey">
            <Input v-model="formParam.refKey"  placeholder="请输入参数值"></Input>
          </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="参数名称" prop="refValue">
              <Input v-model="formParam.refValue"  placeholder="请输入参数名称"></Input>
            </FormItem>
          </Col>
          
          </Row>
          <Row :gutter="10">
          <Col span="8">
          <FormItem label="排序序号" prop="softOrder">
            <Input v-model="formParam.softOrder"  placeholder="请输入排序序号"></Input>
          </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="是否可用">
              <Select v-model="formParam.deletedFlag" >
                <Option value="N">是</Option>
              	<Option value="Y">暂不使用</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>

      </Form>
      <div slot="footer">
          <Button type="text" size="large" @click="modalCancel">取消</Button>
          <Button type="primary" size="large" @click="doSave">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import Vue from "vue";
  import panel from "../../components/panel.vue"
  import * as api from "../../api"
  import apiConfig from "../../api/apiConfig.js"
  import swal from 'sweetalert2'

  export default {
    components:{'imp-panel':panel},
    data () {
      return {
		    delParamCategory:'',delParamKey:'',delParamValue:'',delParam:false,paramInfo:false,refId:'',
        formParam:{refId:'',refKey:'',refValue:'',category:'',softOrder:'', deleteFlag:'00',createdBy:'',createdDate:'',updatedBy:'',updatedDate:''},
        formSearch:{category:'',refKey:''},total:0,pageSize:10,
        paramList: [
          {type: 'index', width: 60,  align: 'center' },
          {title: '参数分类', key: 'category', align: 'center' },
          {title: '参数值', key: 'refKey', align: 'center' },
          {title: '参数名称', key: 'refValue', align: 'center'  },
          {title: '显示顺序',key: 'softOrder',align: 'center',width: 90},
          {title: '是否可用', key: 'deletedFlagLabel',  align: 'center',width: 90},
          {title: '操作', key: 'action', width: 140, align: 'center',
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
        paramData: [],
        ruleValidate: {
          category: [
            { required: true, message: '参数分类不能为空', trigger: 'blur' },
            { type: 'string', max: 40, message: '参数分类必须少于40个字符', trigger: 'blur' }
          ],
          refKey: [
            { required: true, message: '参数值不能为空', trigger: 'blur' },
            { type: 'string', max: 20, message: '参数值必须少于20个字符', trigger: 'blur' }
          ],
          refValue: [
            { required: true, message: '参数名称不能为空', trigger: 'blur' },
            { type: 'string', max: 100, message: '参数名称必须少于100个字符', trigger: 'blur' }
          ],
          softOrder: [
            {required:true,message:'排序序号不能为空',trigger:'blur' },
            {type:"integer",message:'排序序号必须是正整数',trigger:'blur',transform(value){return Number(value);}}
          ]
        }
      }
    },
    methods: {
      doSearchReset(name){
        this.formSearch['category'] = '';
        this.formSearch['refKey'] = '';
      },
      show (row) { 
          this.paramInfo = true;
          this.$refs['formParam'].resetFields();
          let refId = row.refId;
          this.$api.doParamInfo({"refId":refId}).then(res => {
            if(res.status == "S"){
              this.paramInfo = true;
              this.formParam = res.result;
            }else{
              swal({text: '操作失败['+res.result.error+']!',type: 'error',showCancelButton: false,width:300});
            }
          })

      },
      del (row) {
        this.delParam = true;
        this.delParamCategory = row.category;
        this.delParamKey = row.refKey;
        this.delParamValue = row.refValue;
        this.refId = row.refId;
      },
      doDel(){
        this.$api.doParamDel({refId:this.refId}).then(res => {
          if(res.status == "S"){
            swal({text: '操作成功!',type: 'success',showCancelButton: false,width:300}).then((isConfirm)=>{this.search();});
            this.delParam = false;
          }else{
            swal({text: '操作失败['+res.result.error+']',type: 'error',showCancelButton: false,width:300});
            this.delParam = false;
          }
        })
      },
      add(){
        this.paramInfo = true;
        this.$refs['formParam'].resetFields();
      	this.formParam={refId:'',refKey:'',refValue:'',category:'',softOrder:'', deleteFlag:'00',createdBy:'',createdDate:'',updatedBy:'',updatedDate:''};
      },
      doSave(){
       
        this.$refs['formParam'].validate(
          (valid) => {
              if (valid) {
                  this.$api.doParamSave(this.formParam).then(res => {
                  if(res.status == "S"){
                    this.paramInfo = false;
                    swal({text: '保存成功!',type: 'success',showCancelButton: false,width:300}).then((isConfirm)=>{this.search(0);});
                  }else{
                    swal({text:res.result.error,type: 'error',showCancelButton: false,width:300});
                  }
                })
              } else {
                  this.$Message.error('表单填写错误');
              }
        })
      },
      doPageChange(pagenumber){
        let startIndex = ( pagenumber - 1 ) * this.pageSize;
        let endIndex = pagenumber * this.pageSize;
        this.search(startIndex,endIndex);
      },

      search(startIndex , endIndex){
      	if(!startIndex) startIndex = this.$table.INIT_START_INDEX;
      	if(!endIndex)endIndex = this.$table.INIT_END_INDEX
        let params = {
            startIndex:startIndex,
            endIndex:endIndex,
            refKey:this.formSearch.refKey,
            category:this.formSearch.category
        }        
        if(startIndex*1 == 0 && this.$refs['pager'])this.$refs['pager'].currentPage  = 1;
        this.$api.doParamList(params).then(res => {
            if(res.status == "S"){
                this.total = res.result.total;
                this.paramData = [];
                for(let record of res.result.records){                  
                  if(record){
                    record.deletedFlagLabel = (("N"==record.deletedFlag) ? "是" :  "暂不使用")
                  }
                  this.paramData.push(record);
                }
            }else{
                swal('获取参数列表失败', res.result.error, 'error');
            }
        })
      },
      modalCancel() {
          this.paramInfo = false;
          this.$refs['formParam'].resetFields();
      },
      deleteCancel(){
        this.delParam = false;

        this.delParamCategory = '';
        this.delParamKey = '';
        this.delParamValue = '';
        this.refId = '';
      }
    },
    created(){
    	this.search(this.$table.INIT_START_INDEX,this.$table.INIT_END_INDEX);
      this.$Message.config({ top: 90,  duration:2 });
    }
  }
</script>
