<template>
  <imp-panel>
    <h5 class="box-title clearfix" slot="header" style="width: 100%;text-align:center" >
      <el-row style="width: 100%;">
          <span>运货单</span>
      </el-row>
    </h5>
    <div slot="body">
      <Form :model="form" :label-width="80">
        <Card>
          <p slot="title">
            发件人信息
          </p>
          <AutoComplete slot="extra"
                        v-model="cusName"
                        icon="ios-search"
                        :data="cusNamekey"
                        @on-search="handleSearchCusName"
                        placeholder="客户名称"
                        style="width:200px">
          </AutoComplete>
          <Row>
            <Col span="8">
              <FormItem label="客户名称">
                <Input v-model="form.cusName" placeholder="请输入"></Input>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="发件人">
                <Input v-model="form.name" placeholder="请输入"></Input>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="联系电话">
                <Input v-model="form.phone" placeholder="请输入"></Input>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="区域">
                <Cascader :data="data" v-model="form.addr"></Cascader>
              </FormItem>
            </Col>
            <Col span="16">
              <FormItem label="详细地址">
                <Input v-model="form.addrDetail" placeholder="请输入"></Input>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="立即配送">
                <i-switch v-model="form.delivery" size="large">
                  <span slot="open">开启</span>
                  <span slot="close">关闭</span>
                </i-switch>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="货到付款">
                <i-switch v-model="form.payOnline" size="large">
                  <span slot="open">开启</span>
                  <span slot="close">关闭</span>
                </i-switch>
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
            收件人信息
          </p>
          <AutoComplete slot="extra"
                        v-model="recNameSearch"
                        icon="ios-search"
                        :data="cusNamekey"
                        @on-search="handleSearchCusName"
                        placeholder="收件人名称"
                        style="width:200px">
          </AutoComplete>
          <Row>
            <Col span="8">
            <FormItem label="收件人">
              <Input v-model="form.recName" placeholder="请输入"></Input>
            </FormItem>
            </Col>

            <Col span="8">
            <FormItem label="联系电话">
              <Input v-model="form.recPhone" placeholder="请输入"></Input>
            </FormItem>
            </Col>
            <Col span="8">
            </Col>
            <Col span="8">
            <FormItem label="区域">
              <Cascader :data="data" v-model="form.recAddr"></Cascader>
            </FormItem>
            </Col>
            <Col span="24">
            <FormItem label="详细地址">
              <Input v-model="form.recAddrDetail" placeholder="请输入"></Input>
            </FormItem>
            </Col>
            <Col span="24">
            <FormItem label="备注">
              <Input v-model="form.recRemark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
            </FormItem>
            </Col>
          </Row>
          <FormItem>
            <Button type="primary" >提交</Button>
            <Button type="ghost"  style="margin-left: 8px">重置</Button>
          </FormItem>
        </Card>
        <Card style="margin-top: 10px" >
          <p slot="title">
            药品信息
          </p>
          <AutoComplete slot="extra"
                        v-model="medcineSearch"
                        icon="ios-search"
                        :data="cusNamekey"
                        @on-search="handleSearchCusName"
                        placeholder="药品名称"
                        style="width:200px">
          </AutoComplete>
          <Card style="margin-bottom: 10px"
                v-for="(item, index) in form.items"
                :key="index"
                :label="'项目' + (index + 1)"
                :prop="'items.' + index + '.value'"
          >
          <Row>
            <Col span="8">
              <FormItem label="药品名称">
                <Input v-model="form.medName" placeholder="请输入"></Input>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="药品编码">
                <Input v-model="form.medNo" placeholder="请输入"></Input>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="药品价格">
                <Input v-model="form.medPrice" placeholder="请输入"></Input>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="药品数量">
                <Input v-model="form.medNum" placeholder="请输入"></Input>
              </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="生产日期">
              <DatePicker type="date" placeholder="选择日期" v-model="form.medCreateDate"></DatePicker>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="有效期">
              <Input v-model="form.medValidDate" placeholder="请输入"></Input>
            </FormItem>
            </Col>
            <Col span="24">
            <FormItem label="备注">
              <Input v-model="form.medRemark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
            </FormItem>
            </Col>
            <Col span="24" style="text-align: center">
              <Button type="ghost" @click="handleRemove(index)" >删除</Button>
            </Col>
          </Row>
          </Card>
          <Row>
            <Col span="24">
                <Button type="dashed" long @click="handleAdd" icon="plus-round">新增</Button>
            </Col>
          </Row>
          <FormItem>
            <Button type="primary" >提交</Button>
            <Button type="ghost"  style="margin-left: 8px">重置</Button>
          </FormItem>
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
          cusName:'',
          name: '',
          phone:'',
          delivery: false,
          payOnline: false,
          addr:'',
          addrDetail:'',
          remark: '',
          recName:'',
          recPhone:'',
          recAddr:'',
          recAddrDetail:'',
          recRemark:'',
          medName:'',
          medNo:'',
          medPrice:'',
          medNum:'',
          medCreateDate:'',
          medValidDate:'',
          medRemark:'',
          items: [
            {
              value: ''
            },
          ]
        },
        cusNamekey:[],
        cusName:'',
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
        recNameSearch:'',
        medcineSearch:'',


      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      },
      handleSearchCusName(value){

        debugger
        this.cusNamekey = !value ? [] : [
          value,
          value + value,
          value + value + value
        ];
        return

      },
      handleAdd () {
        this.form.items.push({
          value: ''
        });
      },
      handleRemove (index) {
        this.form.items.splice(index, 1);
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
