<template>
  <div>
    <Breadcrumb>
      <BreadcrumbItem href="/">首页</BreadcrumbItem>
      <BreadcrumbItem href="/">药品管理</BreadcrumbItem>
      <BreadcrumbItem>药品列表</BreadcrumbItem>
    </Breadcrumb>
    <Form :model="form" :label-width="80" style="margin-top: 20px">
      <Row>
        <Col span="6">
        <FormItem label="药品名称">
          <Input v-model="form.cusName" placeholder="请输入"></Input>
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="是否冷链">
          <Input v-model="form.cusAddr" placeholder="请输入"></Input>
        </FormItem>
        </Col>
        <Col span="12">
          <Button type="ghost" style="float:right">查询</Button>
          <Button type="ghost" style="float:right;margin-right: 10px;" @click="addMed = true">新增</Button>
          <Button type="ghost" style="float:right;margin-right: 10px;" >导入</Button>
        </Col>
      </Row>
    </Form>
    <Table border :columns="customerList" :data="customerData"></Table>
    <Page :total="40" size="small" show-elevator show-sizer style="float: right;margin-top: 10px"></Page>
    <Modal v-model="delMed" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>删除后将无法恢复</p>
        <p>是否继续删除？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long  @click="doDelCus">删除</Button>
      </div>
    </Modal>

    <Modal
      title="添加药品"
      v-model="addMed"
      :mask-closable="false"
      loading="true"
      @on-ok="addMedicine"
      width="800px">
      <Form :model="formAddMed" label-position="top">
        <Row>
          <Col span="11">
          <FormItem label="药品名称">
            <Input v-model="formAddMed.medName"></Input>
          </FormItem>
          </Col>
          <Col span="11" style="float: right;">
          <FormItem label="药厂编号">
            <Input v-model="formAddMed.facId"></Input>
          </FormItem>
          </Col>
          <Col span="11">
          <FormItem label="单位">
            <Input v-model="formAddMed.unit"></Input>
          </FormItem>
          </Col>
          <Col span="11" style="float: right;">
          <FormItem label="重量">
            <Input v-model="formAddMed.weight"></Input>
          </FormItem>
          </Col>
          <Col span="11" >
          <FormItem label="长度">
            <Input v-model="formAddMed.length"></Input>
          </FormItem>
          </Col>
          <Col span="11" style="float: right;">
          <FormItem label="高度">
            <Input v-model="formAddMed.height"></Input>
          </FormItem>
          </Col>
          <Col span="11" >
          <FormItem label="是否冷链">
            <Select v-model="formAddMed.isType" >
              <Option>是</Option>
              <Option>否</Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>

    <Modal
      title="查看／编辑药品"
      v-model="editMed"
      :mask-closable="false"
      loading="true"
      @on-ok="editMedicine"
      width="800px">
      <Form :model="formAddMed" label-position="top">
        <Row>
          <Col span="11">
          <FormItem label="药品名称">
            <Input v-model="formAddMed.medName"></Input>
          </FormItem>
          </Col>
          <Col span="11" style="float: right;">
          <FormItem label="药厂编号">
            <Input v-model="formAddMed.facId"></Input>
          </FormItem>
          </Col>
          <Col span="11">
          <FormItem label="单位">
            <Input v-model="formAddMed.unit"></Input>
          </FormItem>
          </Col>
          <Col span="11" style="float: right;">
          <FormItem label="重量">
            <Input v-model="formAddMed.weight"></Input>
          </FormItem>
          </Col>
          <Col span="11" >
          <FormItem label="长度">
            <Input v-model="formAddMed.length"></Input>
          </FormItem>
          </Col>
          <Col span="11" style="float: right;">
          <FormItem label="高度">
            <Input v-model="formAddMed.height"></Input>
          </FormItem>
          </Col>
          <Col span="11" >
          <FormItem label="是否冷链">
            <Select v-model="formAddMed.isType" >
              <Option>是</Option>
              <Option>否</Option>
            </Select>
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
        delMed:false,
        addMed:false,
        editMed:false,
        formAddMed:{
          medName:'',
          facId:'',
          unit:'',
          weight:'',
          length:'',
          height:'',
          isType:''
        },
        form:{
          cusName:'',
          cusAddr:'',
          facId:''
        },
        customerList: [
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '药品名称',
            key: 'medName',
            align: 'center'
          },
          {
            title: '单位',
            key: 'unit',
            align: 'center'
          },
          {
            title: '药厂编号',
            key: 'facId',
            align: 'center'
          },
          {
            title: '重量',
            key: 'weight',
            align: 'center'
          },
          {
            title: '长度',
            key: 'length',
            align: 'center'
          },
          {
            title: '高度',
            key: 'width',
            align: 'center'
          },
          {
            title: '是否冷链',
            key: 'isType',
            align: 'center',
            sortable: true
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
        customerData: [
          {
            medName: '第一客户',
            unit: '箱',
            facId: 'F0001',
            weight:'20',
            length:'30',
            width:'40',
            isType:'是',
          },
          {
            medName: '第二药品',
            unit: '袋',
            facId: 'F0001',
            weight:'20',
            length:'30',
            width:'40',
            isType:'是',
          },
          {
            medName: '第三药品',
            unit: '箱',
            facId: 'F0001',
            weight:'20',
            length:'30',
            width:'40',
            isType:'否',
          }
        ]
      }
    },
    methods: {
      show (index) {
        this.editMed = true;
      },
      remove (index) {
        this.delMed = true;

      },
      doDelCus(index){
        this.delMed = false;
        this.$Message.success('删除成功');
        this.customerData.splice(index, 1);
      },
      addMedicine(){

        setTimeout(() => {

          this.addMed = false;
          this.$Message.info('添加成功');
        }, 2000);
      },
      editMedicine(){
        setTimeout(() => {
          this.editMed = false;
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
