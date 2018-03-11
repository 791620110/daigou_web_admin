<template>
  <div>
    <Breadcrumb>
      <BreadcrumbItem href="/">首页</BreadcrumbItem>
      <BreadcrumbItem href="/">药厂管理</BreadcrumbItem>
      <BreadcrumbItem>药厂列表</BreadcrumbItem>
    </Breadcrumb>
    <Form :model="form" :label-width="80" style="margin-top: 20px">
      <Row>
        <Col span="6">
        <FormItem label="药厂名称">
          <Input v-model="form.whName" placeholder="请输入"></Input>
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="联系电话">
          <Input v-model="form.facId" placeholder="请输入"></Input>
        </FormItem>
        </Col>
        <Col span="12">
        <FormItem>
          <Button type="ghost" style="float:right">查询</Button>
          <Button type="ghost" style="float:right;margin-right: 10px;" @click="addWh = true">新增</Button>
          <Button type="ghost" style="float:right;margin-right: 10px;" >导入</Button>
        </FormItem>
        </Col>
      </Row>
    </Form>
    <Table border :columns="wareHouseList" :data="wareHouseData"></Table>
    <Page :total="40" size="small" show-elevator show-sizer style="float: right;margin-top: 10px"></Page>
    <Modal v-model="delWh" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>删除后将无法恢复</p>
        <p>是否继续删除？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long  @click="doDelWh">删除</Button>
      </div>
    </Modal>

    <Modal
      title="添加药厂"
      v-model="addWh"
      :mask-closable="false"
      :loading="true"
      @on-ok="addFactory"
      width="800px">
      <Form :model="formAddFac" label-position="top">
        <Row>
          <Col span="11">
          <FormItem label="药厂名称">
            <Input v-model="formAddFac.facName"></Input>
          </FormItem>
          </Col>
          <Col span="11" style="float: right;">
          <FormItem label="邮编">
            <Input v-model="formAddFac.postCode"></Input>
          </FormItem>
          </Col>
          <Col span="11">
          <FormItem label="电话">
            <Input v-model="formAddFac.phoneNo"></Input>
          </FormItem>
          </Col>
          <Col span="11" style="float: right;">
          <FormItem label="传真">
            <Input v-model="formAddFac.faxNo"></Input>
          </FormItem>
          </Col>
          <Col span="11">
          <FormItem label="所在区域">
            <Cascader :data="formAddFac.data" v-model="formAddFac.addr"></Cascader>
          </FormItem>
          </Col>
          <Col span="11" style="float: right;">
          <FormItem label="地址">
            <Input v-model="formAddFac.address"></Input>
          </FormItem>
          </Col>
          <Col span="11">
          <FormItem label="电子邮箱">
            <Input v-model="formAddFac.email"></Input>
          </FormItem>
          </Col>
          <Col span="24" style = "float: right;">
          <FormItem label="备注">
            <Input v-model="formAddFac.remark"></Input>
          </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>


    <Modal
      title="查看药厂"
      v-model="editWh"
      :mask-closable="false"
      :loading="true"
      @on-ok="editFactory"
      width="800px">
      <Form :model="formAddFac" label-position="top">
        <Row>
          <Col span="11">
          <FormItem label="药厂名称">
            <Input v-model="formAddFac.facName"></Input>
          </FormItem>
          </Col>
          <Col span="11" style="float: right;">
          <FormItem label="邮编">
            <Input v-model="formAddFac.postCode"></Input>
          </FormItem>
          </Col>
          <Col span="11">
          <FormItem label="电话">
            <Input v-model="formAddFac.phoneNo"></Input>
          </FormItem>
          </Col>
          <Col span="11" style="float: right;">
          <FormItem label="传真">
            <Input v-model="formAddFac.faxNo"></Input>
          </FormItem>
          </Col>
          <Col span="11">
          <FormItem label="所在区域">
            <Cascader :data="formAddFac.data" v-model="formAddFac.addr"></Cascader>
          </FormItem>
          </Col>
          <Col span="11" style="float: right;">
          <FormItem label="地址">
            <Input v-model="formAddFac.address"></Input>
          </FormItem>
          </Col>
          <Col span="11">
          <FormItem label="电子邮箱">
            <Input v-model="formAddFac.email"></Input>
          </FormItem>
          </Col>
          <Col span="24" style = "float: right;">
          <FormItem label="备注">
            <Input v-model="formAddFac.remark"></Input>
          </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        delWh:false,
        addWh:false,
        editWh:false,
        formAddFac:{
          facName:'',
          postCode:'',
          phoneNo:'',
          faxNo:'',
          email:'',
          address:'',
          remark:'',
          data: [{
            value: 'beijing',
            label: '北京',
            children: [
              {
                value: 'gugong',
                label: '故宫'
              },
              {
                value: 'tiantan',
                label: '天坛'
              },
              {
                value: 'wangfujing',
                label: '王府井'
              }
            ]
          }, {
            value: 'jiangsu',
            label: '江苏',
            children: [
              {
                value: 'nanjing',
                label: '南京',
                children: [
                  {
                    value: 'fuzimiao',
                    label: '夫子庙',
                  }
                ]
              },
              {
                value: 'suzhou',
                label: '苏州',
                children: [
                  {
                    value: 'zhuozhengyuan',
                    label: '拙政园',
                  },
                  {
                    value: 'shizilin',
                    label: '狮子林',
                  }
                ]
              }
            ],
          }],
        },
        form:{
          whName:'',
          isCloud:'',
          facId:''
        },
        wareHouseList: [
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '药厂名称',
            key: 'facName',
            align: 'center'
          },
          {
            title: '药厂英文',
            key: 'facNameEn',
            align: 'center'
          },
          {
            title: '邮编',
            key: 'postCode',
            align: 'center'
          },
          {
            title: '电话',
            key: 'phoneNo',
            align: 'center'
          },
          {
            title: '传真',
            key: 'faxNo',
            align: 'center'
          },
          {
            title: '电子邮件',
            key: 'email',
            align: 'center'
          },
          {
            title: '地址',
            key: 'address',
            align: 'center'
          },
          {
            title: '操作',
            key: 'action',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.show(params.index)
                    }
                  }
                }, '查看'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.remove(params.index)
                    }
                  }
                }, '删除')
              ]);
            }
          }
        ],
        wareHouseData: [
          {
            facName: '第一个药厂',
            facNameEn: 'DYGYC',
            postCode: '117000',
            phoneNo:'18766322232',
            faxNo:'123-223',
            email:'314052187@qq.com',
            address:'辽宁省大连市中山区'
          },
          {
            facName: '第二个药厂',
            facNameEn: 'DYGYC',
            postCode: '117000',
            phoneNo:'18766322232',
            faxNo:'123-223',
            email:'314052187@qq.com',
            address:'辽宁省大连市中山区'
          },
          {
            facName: '第三个药厂',
            facNameEn: 'DYGYC',
            postCode: '117000',
            phoneNo:'18766322232',
            faxNo:'123-223',
            email:'314052187@qq.com',
            address:'辽宁省大连市中山区'
          },
        ]
      }
    },
    methods: {
      show (index) {
        this.editWh = true;
      },
      remove (index) {
        this.delWh = true;

      },
      doDelWh(index){
        this.delWh = false;
        this.$Message.success('删除成功');
        this.wareHouseData.splice(index, 1);
      },
      addFactory(){

        setTimeout(() => {

          this.addWh = false;
          this.$Message.info('添加成功');
        }, 2000);
      },
      editFactory(){
        setTimeout(() => {

          this.editWh = false;
          this.$Message.info('添加成功');
        }, 2000);
      }
    },
    created(){
      this.$Spin.show();
      setTimeout(() => {
        this.$Spin.hide();
      }, 3000);
    }
  }
</script>

