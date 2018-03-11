<template>
  <imp-panel>
    <h5 class="box-title clearfix" slot="header" style="width: 100%;text-align:center" >
      <el-row style="width: 100%;">
        <span>账户信息</span>
      </el-row>
    </h5>
    <div slot="body">
      <Form :model="form" :label-width="80">
        <Card >
          <p slot="title">
            基本信息
          </p>
          <Row>
            <Col span="8">
            <FormItem label="药厂名称">
              <Input v-model="form.facName" placeholder="请输入"></Input>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="药厂英文">
              <Input v-model="form.facNameEn" placeholder="请输入"></Input>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="药厂编码">
              <Input v-model="form.facCode" placeholder="请输入"></Input>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="邮编">
              <Input v-model="form.postCode" placeholder="请输入"></Input>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="联系电话">
              <Input v-model="form.phoneNo" placeholder="请输入"></Input>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="传真">
              <Input v-model="form.faxNo" placeholder="请输入"></Input>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="电子邮件">
              <Input v-model="form.email" placeholder="请输入"></Input>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="区域">
              <Cascader :data="data" v-model="form.addr"></Cascader>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="详细地址">
              <Input v-model="form.mailAddress" placeholder="请输入"></Input>
            </FormItem>
            </Col>
            <Col span="24">
            <FormItem label="备注">
              <Input v-model="form.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
            </FormItem>
            </Col>
          </Row>
          <FormItem>
            <Button type="primary" >提交</Button>
            <Button type="ghost"  style="margin-left: 8px">重置</Button>
          </FormItem>
        </Card>
        <Card style="margin-top: 10px">
          <p slot="title">
            连接信息
          </p>
          <Row>
            <Col span="8">
              <FormItem label="ip地址">
                <Input v-model="form.ipAddr" placeholder="请输入"></Input>
              </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="JD商家编码">
              <Input v-model="form.JDId" placeholder="请输入"></Input>
            </FormItem>
            </Col>
            <Col span="24">
            <FormItem label="备注">
              <Input v-model="form.connRemark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
            </FormItem>
            </Col>
          </Row>
          <FormItem>
            <Button type="primary" >提交</Button>
            <Button type="ghost" style="margin-left: 8px">重置</Button>
          </FormItem>
        </Card>

        <Card style="margin-top: 10px">
          <p slot="title">
            数据连接信息
          </p>
          <Row>
            <Col span="8">
            <FormItem label="ip地址">
              <Input v-model="form.DBIp" placeholder="请输入"></Input>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="用户名">
              <Input v-model="form.DBUserName" placeholder="请输入"></Input>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="密码">
              <Input v-model="form.DBPsw" placeholder="请输入"></Input>
            </FormItem>

            </Col>


            <Form ref="formDynamic" :model="formDynamic" :label-width="80">
              <FormItem
                v-for="(item, index) in formDynamic.items"
                :key="index"
                :label="'获取erp' + (index + 1)"
                :prop="'items.' + index + '.value'"
                >
                <Row>
                  <Col span="2">
                  <Input type="text" v-model="item.value" placeholder="请输入"></Input>
                  </Col>
                  <Col span="16" offset="1">
                  <Input type="text" v-model="item.value" placeholder="请输入..."></Input>
                  </Col>
                  <Col span="4" offset="1">
                  <Button type="ghost" @click="handleRemove(index)">删除</Button>
                  </Col>
                </Row>
              </FormItem>
              <FormItem>
                <Row>
                  <Col span="12">
                  <Button type="dashed" long @click="handleAdd" icon="plus-round">新增</Button>
                  </Col>
                </Row>
              </FormItem>
            </Form>
            <Col span="24">
            <FormItem label="备注">
              <Input v-model="form.connRemark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
            </FormItem>
            </Col>
            <FormItem>
              <Button type="primary" @click="handleSubmit('formDynamic')">提交</Button>
              <Button type="ghost" @click="handleReset('formDynamic')" style="margin-left: 8px">重置</Button>
            </FormItem>
          </Row>
        </Card>
      </Form>
    </div>
  </imp-panel>
</template>
<script>
  import Row from "../../../node_modules/iview/src/components/grid/row.vue";
  export default {
    components: {
      Row,
    },
    data() {
      return {
        form: {
          facName:'',
          facNameEn:'',
          facCode:'',
          postCode:'',
          phoneNo:'',
          faxNo:'',
          email:'',
          addr:'',
          mailAddress:'',
          remark:'',
          ipAddr:'',
          JDId:'',
          connRemark:'',
          DBIp:'',
          DBUserName:'',
          DBPsw:''
        },
        formDynamic: {
          items: [
            {
              value: ''
            }
          ]
        },
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
      }
    },
    methods: {
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Message.success('提交成功!');
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      },
      handleReset (name) {
        this.$refs[name].resetFields();
      },
      handleAdd () {
        this.formDynamic.items.push({
          value: ''
        });
      },
      handleRemove (index) {
        this.formDynamic.items.splice(index, 1);
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
