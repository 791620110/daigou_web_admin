<template>
  <div>
    <Breadcrumb>
      <BreadcrumbItem href="/">首页</BreadcrumbItem>
      <BreadcrumbItem href="/">云仓管理</BreadcrumbItem>
      <BreadcrumbItem>云仓列表</BreadcrumbItem>
    </Breadcrumb>
    <Form :model="form" :label-width="80" style="margin-top: 20px">
      <Row>
        <Col span="6">
        <FormItem label="仓库名称">
          <Input v-model="form.whName" placeholder="请输入"></Input>
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="药厂编号">
          <Input v-model="form.facId" placeholder="请输入"></Input>
        </FormItem>
        </Col>
        <Col span="12">
        <FormItem>
          <Button type="ghost" style="float:right">查询</Button>
          <Button type="ghost" style="float:right;margin-right: 10px;" @click="addWh = true">新增</Button>

          <vue-xlsx-table style="float: right;margin-right: 10px;" @on-select-file="handleSelectedFile">导入</vue-xlsx-table>

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
      title="添加云仓"
      v-model="addWh"
      :mask-closable="false"
      width="800px"
      :loading="true"
      @on-ok="addChamber">
      <Form :model="formAddCham" label-position="top">
        <Row>
          <Col span="11">
          <FormItem label="仓库名称">
            <Input v-model="formAddCham.whName"></Input>
          </FormItem>
          </Col>
          <Col span="11" style="float: right;">
          <FormItem label="药厂编号">
            <Input v-model="formAddCham.facId"></Input>
          </FormItem>
          </Col>
          <Col span="11">
          <FormItem label="京东商户号">
            <Input v-model="formAddCham.jdId"></Input>
          </FormItem>
          </Col>
          <Col span="11" style="float: right;">
          <FormItem label="面积">
            <Input v-model="formAddCham.area"></Input>
          </FormItem>
          </Col>
          <Col span="11">
          <FormItem label="所在区域">
            <Cascader :data="formAddCham.data" v-model="formAddCham.addr"></Cascader>
          </FormItem>
          </Col>
          <Col span="11" style="float: right;">
          <FormItem label="地址">
            <Input v-model="formAddCham.addrDetail"></Input>
          </FormItem>
          </Col>
          <Col span="24" style = "float: right;">
          <FormItem label="备注">
            <Input v-model="formAddCham.remark"></Input>
          </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>


    <Modal
      title="查看／编辑云仓"
      v-model="editWh"
      :mask-closable="false"
      width="800px"
      :loading="true"
      @on-ok="editChamber">
      <Form :model="formAddCham" label-position="top">
        <Row>
          <Col span="11">
          <FormItem label="仓库名称">
            <Input v-model="formAddCham.whName"></Input>
          </FormItem>
          </Col>
          <Col span="11" style="float: right;">
          <FormItem label="药厂编号">
            <Input v-model="formAddCham.facId"></Input>
          </FormItem>
          </Col>
          <Col span="11">
          <FormItem label="京东商户号">
            <Input v-model="formAddCham.jdId"></Input>
          </FormItem>
          </Col>
          <Col span="11" style="float: right;">
          <FormItem label="面积">
            <Input v-model="formAddCham.area"></Input>
          </FormItem>
          </Col>
          <Col span="11">
          <FormItem label="所在区域">
            <Cascader :data="formAddCham.data" v-model="formAddCham.addr"></Cascader>
          </FormItem>
          </Col>
          <Col span="11" style="float: right;">
          <FormItem label="地址">
            <Input v-model="formAddCham.addrDetail"></Input>
          </FormItem>
          </Col>
          <Col span="24" style = "float: right;">
          <FormItem label="备注">
            <Input v-model="formAddCham.remark"></Input>
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
        formAddCham:{
          whName:'',
          facId:'',
          isCloud:'',
          addr:'',
          area:'',
          addrDetail:'',
          remark:'',
          jdId:'',
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
            title: '仓库名称',
            key: 'whName',
            align: 'center'
          },
          {
            title: '仓库编号',
            key: 'whId',
            align: 'center'
          },
          {
            title: 'JD商户号',
            key: 'whId',
            align: 'center'
          },
          {
            title: '面积/平方千米',
            key: 'area',
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
            whName: '第一仓库',
            whId: 'No0001',
            facId: 'F0001',
            area:'100',
            address:'辽宁省大连市中山区第一个位置',
            isCloud:"是"
          },
          {
            whName: '第二仓库',
            whId: 'No0002',
            facId: 'F0002',
            area:'200',
            address:'辽宁省大连市中山区第二个位置',
            isCloud:"否"
          },
          {
            whName: '第三仓库',
            whId: 'No0003',
            facId: 'F0003',
            area:'300',
            address:'辽宁省大连市中山区第三个位置',
            isCloud:"否"
          }
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
      addChamber(){
        setTimeout(() => {

          this.addWh = false;
          this.$Message.info('添加成功');
        }, 2000);
      },
      editChamber(){
        setTimeout(() => {

          this.editWh = false;
          this.$Message.info('添加成功');
        }, 2000);
      }
    },
    handleSelectedFile (convertedData) {
      console.log(convertedData)
    },
    created(){
      this.$Message.config({
        top: 100,
        duration: 3
      });
      this.$Spin.show();
      setTimeout(() => {
        this.$Spin.hide();
      }, 3000);
    }
  }
</script>
