<template>

  <div>
    <Breadcrumb>
      <BreadcrumbItem href="/">首页</BreadcrumbItem>
      <BreadcrumbItem href="/">系统管理</BreadcrumbItem>
      <BreadcrumbItem>资源管理</BreadcrumbItem>
    </Breadcrumb>
    <Form :label-width="80" style="margin-top: 20px">
      <Row>
        <Col span="24">
        <FormItem >
          <Button type="primary" style="float:right;margin-right: 10px;" @click="add">新增</Button>
        </FormItem>
        </Col>
      </Row>
    </Form>
    <Row slot="body" :gutter="24" style="margin-bottom: 20px;">
      <Col span="8">
      <Card>
        <p slot="title">
          资源树
        </p>
        <Tree :data="resourceData" @on-select-change="getResourceInfo" ref="menuTree" style="font-size: 14px"></Tree>
      </Card>
      </Col>
      <Col span="16">
      <Card v-show="isShow">
        <p slot="title">
          资源信息
        </p>
        <Form :model="formResource" :label-width="80">
          <input v-model="formResource.resourceId" v-show="false"></input>
          <input v-model="formResource.menuId" v-show="false"></input>
          <input v-model="formResource.isResource" v-show="false"></input>
          <FormItem label="菜单名称">
            <Cascader v-model="selectedParentId" :data="resourceCascader" change-on-select></Cascader>
          </FormItem>
          <FormItem label="资源名称">
            <Input v-model="formResource.resourceName" placeholder="请输入资源名称"></Input>
          </FormItem>
          <FormItem label="是否可用">
            <RadioGroup v-model="formResource.resourceStatus">
              <Radio label="00">可用</Radio>
              <Radio label="01">不可用</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="备注">
            <el-input type="textarea" v-model="formResource.remarks" placeholder="请输入备注信息"></el-input>
          </FormItem>
          <FormItem style="text-align: center">
            <Button type="primary" icon="plus" @click="save">保存</Button>
            <Button type="danger" icon="plus" @click="del">删除</Button>
          </FormItem>
        </Form>
      </Card>
      </Col>
    </Row>
    <Modal v-model="delResource" width="460" ok-text="确 定"  cancel-text="取 消" @on-ok="doDelResource">
      <p slot="header" style="color:#f60;text-align:left">
        <Icon type="information-circled"></Icon>
        <span>提示信息</span>
      </p>
      <div style="padding-left:20px">
        <span style="font-size:16px">您确定要删除此菜单吗？</span>
      </div>
    </Modal>
  </div>
</template>
<script  type="text/babel">
  import merge from 'element-ui/src/utils/merge';
  import * as api from "../../api";
  import swal from 'sweetalert2';

  export default {

    data(){
      return {
        isShow:false,
        delResource:false,
        selectedParentId : [],
        formResource:{resourceId:0,menuId:0,resourceName:'',resourceStatus:'',remarks:'',isResource:'Y'},
        resourceData:[{expand: true, title: '云仓平台',children: []}],
        resourceCascader:[{label:'云仓平台',value:'-1',children:[]}]
      }
    },
    methods: {
      load(){
        this.getResourceList();
      },
      getResourceInfo(node){

        if( node && node.length > 0 ){
          if(this.selectedParentId)
            this.selectedParentId=['-1']
          if(node[0].parentId!=-1){
            this.selectedParentId.push(node[0].parentId)
          }
          this.selectedParentId.push(node[0].id);
          console.log(this.selectedParentId);

          if(node[0].parentId){
            if(node[0].menuType === "00"){
              this.isShow = false;
              return;
            }
            this.isShow = true;
            this.formResource.resourceId = node[0].id;
            this.formResource.menuId = node[0].parentId;
            this.formResource.resourceName = node[0].href;
            this.formResource.resourceStatus = node[0].status;
            this.formResource.remarks = node[0].remarks;

          }
        }
      },
      add(){
        if(null != this.selectedParentId  && this.selectedParentId[1] === undefined){
          return;
        }
        this.formResource={resourceId:0,menuId:0,resourceName:'',resourceStatus:'',remarks:'',isResource:'Y'};
        this.isShow = true;
      },
      save(){
        let parentId = this.selectedParentId.pop();
        this.selectedParentId.push(parentId)
        this.formResource.menuId = parseInt(parentId);
        alert(this.formResource.menuId);
        this.$api.doResourceSave(this.formResource).then(res => {
          if(res.status == "S"){
            swal({text: '操作成功!',type: 'success',showCancelButton: false,width:300}).then((isConfirm)=>{this.load();});
          }else{
            swal({text:res.result.error,type: 'error',showCancelButton: false,width:300});
          }
        })
      },

      del(){
        this.delResource = true;
      },
      doDelResource(){
        this.$api.doResourceDel(this.formResource.resourceId).then(res => {
          if(res.status == "S"){
            swal({text: '操作成功!',type: 'success',showCancelButton: false,width:300}).then((isConfirm)=>{this.load();});
          }else{
            swal({text:res.message,type: 'error',showCancelButton: false,width:300});
          }
        })
      },
      search(){

      },

      getResourceList(){
        this.$api.doResourceList({}).then(res => {
          if(res.status == "S"){
            this.resourceData[0].children = []
            for(let record of res.result){
              this.resourceData[0].children.push(record);
            }
            this.resourceCascader[0].children = res.result
          }else{
            swal('获取菜单列表失败', res.result.error, 'error');
          }
        })
      }
    },
    created(){
      this.load();
    }
  }
</script>

<style>
  .ivu-tree ul{
    font-size: 14px;
  }
</style>

