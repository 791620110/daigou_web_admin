<template>

  <div>
    <Breadcrumb>
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>系统管理</BreadcrumbItem>
      <BreadcrumbItem>菜单管理</BreadcrumbItem>
    </Breadcrumb>
    <Form :label-width="80" style="margin-top: 20px" >
      <Row>
        <Col span="6">&nbsp;</Col>
        <Col span="18">
        <FormItem >

          <Button type="primary" style="float:right;margin-right: 10px;" @click="add">新增</Button>
        </FormItem>
        </Col>
      </Row>
    </Form>
    <Modal v-model="delMenu" width="460" ok-text="确 定"  cancel-text="取 消" @on-ok="doDelMenu">
      <p slot="header" style="color:#f60;text-align:left">
        <Icon type="information-circled"></Icon>
        <span>提示信息</span>
      </p>
      <div style="padding-left:20px">
        <span style="font-size:16px">您确定要删除此菜单及权限信息(&nbsp;<span>菜单名称:{{ formMenu.menuName }}</span>&nbsp;)吗？</span>
      </div>
    </Modal>
    <Row slot="body" :gutter="24" style="margin-bottom: 20px;">
      <Col span="8">
      <Card>
        <p slot="title">系统菜单</p>
        <Tree :data="menuData" @on-select-change="getMenuInfo" style="font-size: 18px"></Tree>
      </Card>
      </Col>
      <Col span="16">
      <Card>
        <p slot="title">菜单信息</p>
        <Form ref="formMenu" :model="formMenu" :label-width="80">
          <FormItem label="父级菜单">
            <Cascader v-model="selectedParentId" :data="menuCascader" change-on-select></Cascader>
            <Input v-model="formMenu.parentId" style="display:none"></Input><Input v-model="formMenu.menuId"  style="display:none"></Input>
          </FormItem>
          <FormItem label="菜单名称">
            <Input v-model="formMenu.menuName" placeholder="请输入菜单名称"></Input>
          </FormItem>
          <FormItem label="链接地址">
            <Input v-model="formMenu.menuUrl" placeholder="请输入链接地址"></Input>
          </FormItem>
          <FormItem label="图标" >
            <Col span="18">
              <Input v-model="formMenu.menuIcon"></Input>
            </Col>
            <Col span="6">
              <Button type="text" @click="selectIconDialog=true">选择</Button>
            </Col>
          </FormItem>
          <FormItem label="菜单类型">
            <RadioGroup v-model="formMenu.menuType">
              <Radio label="00">显示菜单</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="是否可用">
            <RadioGroup v-model="formMenu.status">
              <Radio label="00">可用</Radio>
              <Radio label="01">禁用</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="排序">
            <Input v-model="formMenu.orderNumber" placeholder="请输入排序"></Input>
          </FormItem>
          <FormItem label="备注">
            <Input type="textarea" v-model="formMenu.remarks"/>
          </FormItem>
          <FormItem style="text-align: center">
            <Button type="primary" icon="plus" @click="save">保存</Button>
            <Button type="error" icon="minus" @click="del">删除</Button>
          </FormItem>
        </Form>
      </Card>
      </Col>
    </Row>
    <Modal
      title="图标"
      v-model="selectIconDialog"
      :mask-closable="false"
      :loading="true"
      width="400px">
      <Form label-position="top" class="select-tree">
        <Row>
          <div class="is-empty">
            <div class="icons-wrapper"><i class="fa fa-picture-o" @click="selectIcon($event)"></i><i class="fa fa-pie-chart" @click="selectIcon($event)"></i><i class="fa fa-plane" @click="selectIcon($event)"></i><i class="fa fa-plug" @click="selectIcon($event)"></i><i class="fa fa-plus" @click="selectIcon($event)"></i><i class="fa fa-plus-circle" @click="selectIcon($event)"></i><i class="fa fa-plus-square" @click="selectIcon($event)"></i><i class="fa fa-plus-square-o" @click="selectIcon($event)"></i><i class="fa fa-podcast" @click="selectIcon($event)"></i><i class="fa fa-power-off" @click="selectIcon($event)"></i><i class="fa fa-print" @click="selectIcon($event)"></i><i class="fa fa-puzzle-piece" @click="selectIcon($event)"></i><i class="fa fa-qrcode" @click="selectIcon($event)"></i><i class="fa fa-question" @click="selectIcon($event)"></i><i class="fa fa-question-circle" @click="selectIcon($event)"></i><i class="fa fa-question-circle-o" @click="selectIcon($event)"></i><i class="fa fa-quote-left" @click="selectIcon($event)"></i><i class="fa fa-quote-right" @click="selectIcon($event)"></i><i class="fa fa-random" @click="selectIcon($event)"></i><i class="fa fa-recycle" @click="selectIcon($event)"></i><i class="fa fa-refresh" @click="selectIcon($event)"></i><i class="fa fa-registered" @click="selectIcon($event)"></i><i class="fa fa-remove" @click="selectIcon($event)"></i><i class="fa fa-reorder" @click="selectIcon($event)"></i><i class="fa fa-reply" @click="selectIcon($event)"></i><i class="fa fa-reply-all" @click="selectIcon($event)"></i><i class="fa fa-retweet" @click="selectIcon($event)"></i><i class="fa fa-road" @click="selectIcon($event)"></i><i class="fa fa-rocket" @click="selectIcon($event)"></i><i class="fa fa-rss" @click="selectIcon($event)"></i><i class="fa fa-rss-square" @click="selectIcon($event)"></i><i class="fa fa-s15" @click="selectIcon($event)"></i><i class="fa fa-search" @click="selectIcon($event)"></i><i class="fa fa-search-minus" @click="selectIcon($event)"></i><i class="fa fa-search-plus" @click="selectIcon($event)"></i><i class="fa fa-send" @click="selectIcon($event)"></i><i class="fa fa-send-o" @click="selectIcon($event)"></i><i class="fa fa-server" @click="selectIcon($event)"></i><i class="fa fa-share" @click="selectIcon($event)"></i><i class="fa fa-share-alt" @click="selectIcon($event)"></i><i class="fa fa-share-alt-square" @click="selectIcon($event)"></i><i class="fa fa-share-square" @click="selectIcon($event)"></i><i class="fa fa-share-square-o" @click="selectIcon($event)"></i><i class="fa fa-shield" @click="selectIcon($event)"></i><i class="fa fa-ship" @click="selectIcon($event)"></i><i class="fa fa-shopping-bag" @click="selectIcon($event)"></i><i class="fa fa-shopping-basket" @click="selectIcon($event)"></i><i class="fa fa-shopping-cart" @click="selectIcon($event)"></i><i class="fa fa-shower" @click="selectIcon($event)"></i><i class="fa fa-sign-in" @click="selectIcon($event)"></i><i class="fa fa-sign-language" @click="selectIcon($event)"></i><i class="fa fa-sign-out" @click="selectIcon($event)"></i><i class="fa fa-signal" @click="selectIcon($event)"></i><i class="fa fa-signing" @click="selectIcon($event)"></i><i class="fa fa-sitemap" @click="selectIcon($event)"></i><i class="fa fa-sliders" @click="selectIcon($event)"></i><i class="fa fa-smile-o" @click="selectIcon($event)"></i><i class="fa fa-snowflake-o" @click="selectIcon($event)"></i><i class="fa fa-soccer-ball-o" @click="selectIcon($event)"></i><i class="fa fa-sort" @click="selectIcon($event)"></i><i class="fa fa-sort-alpha-asc" @click="selectIcon($event)"></i><i class="fa fa-sort-alpha-desc" @click="selectIcon($event)"></i><i class="fa fa-sort-amount-asc" @click="selectIcon($event)"></i><i class="fa fa-sort-amount-desc" @click="selectIcon($event)"></i><i class="fa fa-sort-asc" @click="selectIcon($event)"></i><i class="fa fa-sort-desc" @click="selectIcon($event)"></i><i class="fa fa-sort-down" @click="selectIcon($event)"></i><i class="fa fa-sort-numeric-asc" @click="selectIcon($event)"></i><i class="fa fa-sort-numeric-desc" @click="selectIcon($event)"></i><i class="fa fa-sort-up" @click="selectIcon($event)"></i><i class="fa fa-space-shuttle" @click="selectIcon($event)"></i><i class="fa fa-spinner" @click="selectIcon($event)"></i><i class="fa fa-spoon" @click="selectIcon($event)"></i><i class="fa fa-square" @click="selectIcon($event)"></i><i class="fa fa-square-o" @click="selectIcon($event)"></i><i class="fa fa-star" @click="selectIcon($event)"></i><i class="fa fa-star-half" @click="selectIcon($event)"></i><i class="fa fa-star-half-empty" @click="selectIcon($event)"></i><i class="fa fa-star-half-full" @click="selectIcon($event)"></i><i class="fa fa-star-half-o" @click="selectIcon($event)"></i><i class="fa fa-star-o" @click="selectIcon($event)"></i><i class="fa fa-sticky-note" @click="selectIcon($event)"></i><i class="fa fa-sticky-note-o" @click="selectIcon($event)"></i><i class="fa fa-street-view" @click="selectIcon($event)"></i><i class="fa fa-suitcase" @click="selectIcon($event)"></i><i class="fa fa-sun-o" @click="selectIcon($event)"></i><i class="fa fa-support" @click="selectIcon($event)"></i><i class="fa fa-tablet" @click="selectIcon($event)"></i><i class="fa fa-tachometer" @click="selectIcon($event)"></i><i class="fa fa-tag" @click="selectIcon($event)"></i><i class="fa fa-tags" @click="selectIcon($event)"></i><i class="fa fa-tasks" @click="selectIcon($event)"></i><i class="fa fa-taxi" @click="selectIcon($event)"></i><i class="fa fa-television" @click="selectIcon($event)"></i><i class="fa fa-terminal" @click="selectIcon($event)"></i><i class="fa fa-thermometer" @click="selectIcon($event)"></i><i class="fa fa-thermometer-0" @click="selectIcon($event)"></i><i class="fa fa-thermometer-1" @click="selectIcon($event)"></i><i class="fa fa-thermometer-2" @click="selectIcon($event)"></i><i class="fa fa-thermometer-3" @click="selectIcon($event)"></i><i class="fa fa-thermometer-4" @click="selectIcon($event)"></i><i class="fa fa-thermometer-empty" @click="selectIcon($event)"></i><i class="fa fa-thermometer-full" @click="selectIcon($event)"></i><i class="fa fa-thermometer-half" @click="selectIcon($event)"></i><i class="fa fa-thermometer-quarter" @click="selectIcon($event)"></i><i class="fa fa-thermometer-three-quarters" @click="selectIcon($event)"></i><i class="fa fa-thumb-tack" @click="selectIcon($event)"></i><i class="fa fa-thumbs-down" @click="selectIcon($event)"></i><i class="fa fa-thumbs-o-down" @click="selectIcon($event)"></i><i class="fa fa-thumbs-o-up" @click="selectIcon($event)"></i><i class="fa fa-thumbs-up" @click="selectIcon($event)"></i><i class="fa fa-ticket" @click="selectIcon($event)"></i><i class="fa fa-times" @click="selectIcon($event)"></i><i class="fa fa-times-circle" @click="selectIcon($event)"></i><i class="fa fa-times-circle-o" @click="selectIcon($event)"></i><i class="fa fa-times-rectangle" @click="selectIcon($event)"></i><i class="fa fa-times-rectangle-o" @click="selectIcon($event)"></i><i class="fa fa-tint" @click="selectIcon($event)"></i><i class="fa fa-toggle-down" @click="selectIcon($event)"></i><i class="fa fa-toggle-left" @click="selectIcon($event)"></i><i class="fa fa-toggle-off" @click="selectIcon($event)"></i><i class="fa fa-toggle-on" @click="selectIcon($event)"></i><i class="fa fa-toggle-right" @click="selectIcon($event)"></i><i class="fa fa-toggle-up" @click="selectIcon($event)"></i><i class="fa fa-trademark" @click="selectIcon($event)"></i><i class="fa fa-trash" @click="selectIcon($event)"></i><i class="fa fa-trash-o" @click="selectIcon($event)"></i><i class="fa fa-tree" @click="selectIcon($event)"></i><i class="fa fa-trophy" @click="selectIcon($event)"></i><i class="fa fa-truck" @click="selectIcon($event)"></i><i class="fa fa-tty" @click="selectIcon($event)"></i><i class="fa fa-tv" @click="selectIcon($event)"></i><i class="fa fa-umbrella" @click="selectIcon($event)"></i><i class="fa fa-universal-access" @click="selectIcon($event)"></i><i class="fa fa-university" @click="selectIcon($event)"></i><i class="fa fa-unlock" @click="selectIcon($event)"></i><i class="fa fa-unlock-alt" @click="selectIcon($event)"></i><i class="fa fa-unsorted" @click="selectIcon($event)"></i><i class="fa fa-upload" @click="selectIcon($event)"></i><i class="fa fa-user" @click="selectIcon($event)"></i><i class="fa fa-user-circle" @click="selectIcon($event)"></i><i class="fa fa-user-circle-o" @click="selectIcon($event)"></i><i class="fa fa-user-o"></i><i class="fa fa-user-plus" @click="selectIcon($event)"></i><i class="fa fa-user-secret" @click="selectIcon($event)"></i><i class="fa fa-user-times" @click="selectIcon($event)"></i><i class="fa fa-users" @click="selectIcon($event)"></i><i class="fa fa-vcard" @click="selectIcon($event)"></i><i class="fa fa-vcard-o" @click="selectIcon($event)"></i><i class="fa fa-video-camera" @click="selectIcon($event)"></i><i class="fa fa-volume-control-phone" @click="selectIcon($event)"></i><i class="fa fa-volume-down" @click="selectIcon($event)"></i><i class="fa fa-volume-off" @click="selectIcon($event)"></i><i class="fa fa-volume-up" @click="selectIcon($event)"></i><i class="fa fa-warning" @click="selectIcon($event)"></i><i class="fa fa-wheelchair" @click="selectIcon($event)"></i><i class="fa fa-wheelchair-alt" @click="selectIcon($event)"></i><i class="fa fa-wifi" @click="selectIcon($event)"></i><i class="fa fa-window-close" @click="selectIcon($event)"></i><i class="fa fa-window-close-o" @click="selectIcon($event)"></i><i class="fa fa-window-maximize" @click="selectIcon($event)"></i><i class="fa fa-window-minimize" @click="selectIcon($event)"></i><i class="fa fa-window-restore" @click="selectIcon($event)"></i><i class="fa fa-wrench" @click="selectIcon($event)"></i></div>
          </div>
        </Row>
      </Form>
    </Modal>
  </div>

</template>
<script  type="text/babel">

  import panel from "../../components/panel.vue"

  import treeter from "../../components/treeter"

  import * as api from "../../api"
  import swal from 'sweetalert2'

  export default {
    data(){
      return {
        delMenu:false,
        selectIconDialog:false,
        selectedParentId : [],
        formMenu:{menuId:'',menuName:'',menuUrl:'',menuType:'00',menuIcon:'',parentId:'',status:'00',orderNumber:'',remarks:'',icon:''},
        menuData:[{expand: true, title: '云仓平台',children: []}],
        menuCascader:[{label:'云仓平台',value:'-1',children:[]}]
      }
    },
    methods: {
      load(){this.search()},
      selectIcon(event){
        this.formMenu.menuIcon = event.target.className;
        this.selectIconDialog = false;
      },

      getMenuInfo(node){
        if( node && node.length > 0 ){
          if(node[0].parentId){
            this.formMenu.menuId = node[0].id;
            this.formMenu.parentId = node[0].parentId;
            this.formMenu.menuName = node[0].title;
            this.formMenu.menuUrl = node[0].href;
            this.formMenu.menuIcon = node[0].icon;
            this.formMenu.status = node[0].status;
            this.formMenu.menuType = node[0].menuType;
            this.formMenu.orderNumber = node[0].orderNumber;
            this.formMenu.remarks = node[0].remarks;
            if(this.selectedParentId)
              this.selectedParentId=['-1']
            if(node[0].parentId!=-1){
              this.selectedParentId.push(node[0].parentId)
            }
          }
        }
      },
      add(){
        this.formMenu={menuId:'',menuName:'',menuUrl:'',menuType:'00',menuIcon:'',parentId:'',status:'00',orderNumber:'',remarks:''};
        this.selectedParentId = []
      },
      save(){
        let parentId = this.selectedParentId.pop();
        this.selectedParentId.push(parentId)
        this.formMenu.parentId = parentId
        this.$api.doMenuSave(this.formMenu).then(res => {
          if(res.status == "S"){
            swal({text: '操作成功!',type: 'success',showCancelButton: false,width:300}).then((isConfirm)=>{this.search();});
          }else{
            swal({text:res.result.error,type: 'error',showCancelButton: false,width:300});
          }
        })
      },
      del(){
        if(!this.formMenu.menuId){
          swal({text:'请选择要删除的菜单',type: 'warning',imageSize:'50*50',showCancelButton: false,width:300}).then((s)=>{
            this.formMenu={menuId:'',menuName:'',menuUrl:'',menuIcon:'',parentId:'',status:'',orderNumber:'',remarks:''};
          });
        }else{
          this.delMenu = true;
        }
      },
      doDelMenu(){
        this.$api.doMenuDel(this.formMenu.menuId).then(res => {
          if(res.status == "S"){
            swal({text: '操作成功!',type: 'success',showCancelButton: false,width:300}).then((isConfirm)=>{this.search();});
          }else{
            swal({text:res.message,type: 'error',showCancelButton: false,width:300});
          }
        })
      },
      search(){
        this.$api.doMenuAll({}).then(res => {
          if(res.status == "S"){
            this.menuData[0].children = []
            for(let record of res.result){
              this.menuData[0].children.push(record);
            }
            this.menuCascader[0].children = res.result
          }else{
            swal('获取菜单列表失败', res.result.error, 'error');
          }
        })
      },
      doIconAdd(){

      }
    },
    created(){ this.load();}
  }
</script>

<style>
  .ivu-tree ul{
    font-size: 14px;
  }
  .icons-wrapper{
    display: block;
  }

  .is-empty i{
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    display: inline-block;
    cursor: pointer;
  }

  .is-empty i:hover{
    background-color: #0d6aad;
    color: #ffffff;
  }

</style>

