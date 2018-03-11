<style>
  .area-select .el-select {
    margin-left: 0px;
    height: 32px;
  }
</style>

<template>
  <div>
    <Breadcrumb>
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>云仓客户管理</BreadcrumbItem>
      <BreadcrumbItem>云仓仓库列表</BreadcrumbItem>
    </Breadcrumb>
    <Form :model="formSearchWarehouse" :label-width="90" style="margin-top: 20px">
      <Row>
        <Col span="20">
        <Col span="9">
        <FormItem label="仓库名称">
          <Input v-model="formSearchWarehouse.whName" placeholder="请输入仓库名称"></Input>
        </FormItem>
        </Col>
        <Col span="9">
        <FormItem label="所属客户">
          <Input v-model="formSearchWarehouse.customerName" placeholder="请输入所属客户名称"></Input>
        </FormItem>
        </Col>
        <Col span="6">
          <FormItem label="是否为云仓" prop="asCloud">
            <Select v-model="formSearchWarehouse.asCloud">
              <Option value="Y">是</Option>
              <Option value="N">否</Option>
            </Select>
          </FormItem>
          </Col>
           </Col>
        <Col span="4">
        <Button type="ghost" style="float:right;margin-left: 10px" @click="doReset()">重置</Button>
        <Button type="primary" style="float:right;margin-left: 10px" @click="search()">查询</Button>
        </Col>
        <Col span="24">
          <Button type="primary" style="float:right;margin-bottom: 10px" @click="add()">新增</Button>
        </Col>
      </Row>
    </Form>
    <Table border :columns="wareHouseList" :data="wareHouseData"></Table>
    <Page :total="total" :page-size="pageSize" size="small" show-elevator show-sizer show-total
          style="float: right;margin-top: 10px" @on-change="doPageChange"></Page>
    <Modal
      title="仓库信息"
      v-model="showCloudwarehouseInfo"
      :mask-closable="false"
      :loading="true"
      width="900px">
      <Form :model="formWarehouse" label-position="top" ref="formWarehouse" :rules="ruleValidate">
        <Row :gutter="10">
          <Col span="8">
          <FormItem label="所属云仓客户" prop="customerCode">
            <Select v-model="formWarehouse.customerCode">
              <Option v-for="item in customerList" :value="item.customerCode" :key="item.customerCode">
                {{ item.customerName }}
              </Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="仓库编码" prop="whCode">
            <Input v-model="formWarehouse.whCode" :disabled="isAdd=='N'" placeholder="请输入仓库编码"></Input>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="仓库名称" prop="whName">
            <Input v-model="formWarehouse.whName" placeholder="请输入仓库名称"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row :gutter="10">
          <Col span="8">
          <FormItem label="仓库规模(平方米)" prop="area">
            <Input v-model="formWarehouse.area" placeholder="请输入仓库规模"></Input>
          </FormItem>
          </Col>
          <Col span="16">
          <FormItem label="所在省 / 市 / 区" :required="true" prop="areaSelectProp">
            <areaselect :level="2" type='text' v-model='distpicker'></areaselect>
          </FormItem>
          </Col>
        </Row>
        <Row :gutter="10">
          <Col span="4">
          <FormItem label="是否为云仓" prop="asCloud">
            <Select v-model="formWarehouse.asCloud">
              <Option value="Y">是</Option>
              <Option value="N">否</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="4">
          <FormItem label="状态" prop="status">
            <Select v-model="formWarehouse.status">
              <Option value="00">可用</Option>
              <Option value="01">禁用</Option>
            </Select>
          </FormItem>
          </Col>

          <Col span="16">
          <FormItem label="街区地址" prop="address">
            <Input v-model="formWarehouse.address" placeholder="请输入街区地址"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row :gutter="10">
          <Col span="24" style="float: right;">
          <FormItem label="对应仓库货主" prop="whOwnerCode" placeholder="请选择对应的仓库货主">
            <Select v-model="formWarehouse.whOwnerCode">
              <Option value=""></Option>
              <Option v-for="item in whOwnerCodeList" :value="item.ownerCode" :key="item.ownerCode">
                {{ item.ownerCode + "-" + item.ownerName }}
              </Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
        <Row :gutter="10">
          <Col span="24" style="float: right;">
          <FormItem label="备注" prop="remark">
            <Input type="textarea" v-model="formWarehouse.whRemarks" :rows="3" placeholder="请输入备注信息"></Input>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="doCloudWareCancle">取消</Button>
        <Button type="primary" size="large" @click="doCloudWareSave">确定</Button>
      </div>
    </Modal>
    <Modal
      title="云仓仓库配置信息"
      v-model="showWarehouseMeta"
      :mask-closable="false"
      :loading="true"
      @on-ok="addWarehouseMeta()"
      width="800px">
      <Form :model="formWarehouseMeta" label-position="top">
        <Row :gutter="10">
          <Col span="8">
          <FormItem label="访问方式">
            <Select v-model="formWarehouseMeta.accessType">
              <Option value="">对外接口服务</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="访问用户ID">
            <Input v-model="formWarehouseMeta.accessId" placeholder="请输入访问用户ID"></Input>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="访问授权码">
            <Input v-model="formWarehouse.accessKey" placeholder="请输入访问授权码"></Input>
          </FormItem>
          </Col>
        </Row>

        <Row :gutter="10">
          <Col span="12">
          <FormItem label="仓库商户信息接口">
            <Input v-model="formWarehouseMeta.apiGetAll" placeholder="请输入仓库商户信息接口URL"></Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="仓库商户药品信息接口">
            <Input v-model="formWarehouseMeta.apiGetMedicineAll" placeholder="请输入仓库商户药品信息接口"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row :gutter="10">
          <Col span="12">
          <FormItem label="仓库商户药品库存信息接口">
            <Input v-model="formWarehouseMeta.apiGetMedicineStore" placeholder="请输入仓库商户药品库存信息接口"></Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="仓库商户出库信息接口">
            <Input v-model="formWarehouseMeta.apiGetSales" placeholder="请输入仓库商户出库信息接口"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row :gutter="10">
          <Col span="24" style="float: right;">
          <FormItem label="备注">
            <Input type="textarea" v-model="formWarehouse.whRemarks" :rows="3" placeholder="请输入备注信息"></Input>
          </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>


    <Modal v-model="delWarehouse" width="480">
      <p slot="header" style="color:#f60;text-align:left">
        <Icon type="information-circled"></Icon>
        <span>提示信息</span>
      </p>
      <div style="padding-left:20px;margin:10px">
        <span style="font-size:16px">您确定要删除此仓库(<span>编码:{{ delCloudHouseCode }},名称:{{ delCloudHouseName
          }}</span>)吗？</span>
      </div>
      <div slot="footer">
        <Button type="text" size="large" @click="deleteCancel">取消</Button>
        <Button type="error" size="large" @click="doDel">删除</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import swal from 'sweetalert2'
  import jsonUtil from '../../../static/util/jsonUtil'
  import areaselect from '../../components/area-select.vue';
  export default {
    components: { areaselect },
    data() {
      const areaSelectCheck = (rule, value, callback) => {
        if (this.distpicker.length != 3) {
          callback(new Error('请选择所在省 / 市 / 区'));
        }
        callback();
      };
      return {
        total: 0, pageSize: 10, showCloudwarehouseInfo: false,
        delWarehouse: false, delCloudHouseName: '', delCloudHouseCode: '', showWarehouseMeta: false,
        isAdd: "",
        customerList: [], distpicker: [],
        formSearchWarehouse: {whName: '', customerName: '',asCloud:'Y'},
        formWarehouse: {
          whCode: '', whName: '', customerCode: '', asCloud: 'Y', status: '00',
          area: '', address: '', whRemarks: '', province: '',
          city: '', district: '', proviceCode: '', cityCode: '', districtCode: '', whOwnerCode: ''
        },
        whOwnerCodeList:[],
        ruleValidate: {
          customerCode: [
            {required: true, message: '所属云仓客户不能为空', trigger: 'change'}
          ],
          whName: [
            {required: true, message: '仓库名称不能为空', trigger: 'blur'},
            {type: "string", max: 100, message: '仓库名称必须少于100个字符', trigger: 'blur'}
          ],
          whCode: [
            {required: true, message: '仓库编码不能为空', trigger: 'blur'},
            {type: "string", max: 10, message: '仓库编码必须少于10个字符', trigger: 'blur'}
          ],
          area: [
            {type: "string", max: 10, message: '仓库规模必须少于10个字符', trigger: 'blur'}
          ],
          address: [
            {required: true, message: '街区地址不能为空', trigger: 'blur'},
            {type: "string", max: 200, message: '街区地址必须少于200个字符', trigger: 'blur'}
          ],
          areaSelectProp: [{validator: areaSelectCheck, trigger: 'blur'}],
          whRemarks: [
            {type: "string", max: 400, message: '备注必须少于400个字符', trigger: 'blur'}
          ]
        },
        formWarehouseMeta: {},
        wareHouseList: [
          {type: 'index', width: 60, align: 'center'},
          {title: '仓库编码', key: 'whCode', align: 'center', width: 120},
          {title: '仓库名称', key: 'whName', align: 'center'},
          {
            title: '云仓', key: 'asCloud', align: 'center',
            width: 70,
            render: (h, params) => {
              if (params.row.asCloud === 'Y') {
                return "是";
              } else {
                return "否";
              }
            }
          },
          {title: '所属客户', key: 'customerName', align: 'center'},
          {
            title: '省 / 市 / 区', align: 'center', render: (h, params) => {
            let province = params.row.province == null ? "-" : params.row.province;
            let city = params.row.province == null ? "-" : params.row.city;
            let district = params.row.district == null ? "-" : params.row.district;
            return province + " / " + city + " / " + district;
          }
          },
          {
            title: '状态', key: 'statusLabel', align: 'center',
            width: 70, render: (h, params) => {
            if (params.row.status === '00') {
              return "可用";
            } else {
              return "不可用";
            }
          }
          },
          {
            title: '操作', key: 'action', width: 195, align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {type: 'primary', size: 'small'}, style: {marginRight: '5px'}, on: {
                    click: () => {
                      this.showMeta(params.row)
                    }
                  }
                }, '访问配置'),
                h('Button', {
                  props: {type: 'primary', size: 'small'}, style: {marginRight: '5px'}, on: {
                    click: () => {
                      this.show(params.row)
                    }
                  }
                }, '详情'),
                h('Button', {
                  props: {type: 'error', size: 'small'},
                  on: {
                    click: () => {
                      this.remove(params.row)
                    }
                  }
                }, '删除')
              ]);
            }
          }
        ],
        wareHouseData: []
      }
    },
    methods: {
      show(row) {
        this.isAdd = 'N';
        this.$refs['formWarehouse'].resetFields();
        let whCode = row.whCode;
        this.$api.doCloudWarehouseInfo(whCode).then(res => {
          if (res.status == "S") {
            this.showCloudwarehouseInfo = true;
            this.formWarehouse = res.result;
            if (this.formWarehouse.province != null && this.formWarehouse.province != '') {

              this.distpicker = new Array();
              this.distpicker.push(this.formWarehouse.province)
              this.distpicker.push(this.formWarehouse.city)
              this.distpicker.push(this.formWarehouse.district)              
            }

            this.$api.doWhOwnerCodeList(whCode).then(res => {
                  this.whOwnerCodeList = []
                  if (res.status == "S") {
                    this.whOwnerCodeList = res.result.records;
                  } else {
                    swal('获取货主列表失败', res.message, 'error');
                  }
            })
          } else {
              swal({text: '操作失败[' + res.result.error + ']!', type: 'error', showCancelButton: false, width: 300});
          }
        })

      },

      showMeta(row) {
        this.showWarehouseMeta = true;
      },
      deleteCancel() {
        this.delWarehouse = false;
        this.delCloudHouseName = '';
        this.delCloudHouseCode = ''
      },
      remove(row) {
        this.delWarehouse = true;
        this.delCloudHouseName = row.whName;
        this.delCloudHouseCode = row.whCode;
      },

      doDel(row) {
        this.$api.doCloudWareDel(this.delCloudHouseCode).then(res => {
          if (res.status == "S") {
            this.delWarehouse = false;
            this.search();
            swal({text: '保存成功!', type: 'success', showCancelButton: false, width: 300}).then((isConfirm) => {
              this.search();
            });
          } else {
            swal({text: res.message, type: 'error', showCancelButton: false, width: 300});
          }
        })
      },
      add() {
        this.$refs['formWarehouse'].resetFields();
        this.formWarehouse = {
          whCode: '', whName: '', customerCode: '', asCloud: 'Y', status: '00',
          area: '', address: '', whRemarks: '', province: '',
          city: '', district: '', proviceCode: '', cityCode: '', districtCode: '', whOwnerCode: ''
        };
        console.log(this.distpicker)
        console.log(this.formWarehouse)
        this.showCloudwarehouseInfo = true;
        this.isAdd = 'Y';

      },
      doCloudWareSave() {
        let isValid = true;
        this.$refs['formWarehouse'].validate(function (valid) {
          if (!valid) {
            isValid = valid;
            return;
          }
        })
        if (!isValid) {
          return;
        }
        this.formWarehouse.province = this.distpicker[0]
        this.formWarehouse.city = this.distpicker[1]
        this.formWarehouse.district = this.distpicker[2]
        this.$api.doCloudWareSave(this.formWarehouse, this.isAdd, this.formWarehouse.customerCode, this.formWarehouse.whOwnerCode).then(res => {
          if (res.status == "S") {
            this.showCloudwarehouseInfo = false;
            swal({text: '保存成功!', type: 'success', showCancelButton: false, width: 300}).then((isConfirm) => {
              this.search();
            });
          } else {
            swal({text: res.message, type: 'error', showCancelButton: false, width: 300});
          }
        })
      },
      doCloudWareCancle() {
        this.showCloudwarehouseInfo = false;
        this.$refs["formWarehouse"].resetFields();
      },


      editCloudWare() {
        setTimeout(() => {
          this.editWh = false;
          this.$Message.info('添加成功');
        }, 2000);
      },

      doCustomerList() {
        this.$api.doWhCustomerList().then(res => {
          this.customerList = [];
          if (res.status == "S") {
            this.customerList = [];
            for (let record of res.result) {
              this.customerList.push(record);
            }
          } else {
            swal('获取云仓客户列表失败', res.result.error, 'error');
          }
        })
      },

      doReset(name) {
        this.formSearchWarehouse.whName = '';
        this.formSearchWarehouse.customerName = '';
        this.formSearchWarehouse.asCloud = 'Y';
      },
      search() {
        this.doCloudWareList(this.$table.INIT_START_INDEX, this.$table.INIT_END_INDEX)
      },
      doPageChange(pagenumber) {
        let startIndex = ( pagenumber - 1 ) * this.pageSize;
        let endIndex = pagenumber * this.pageSize;
        this.doCloudWareList(startIndex, endIndex);
      },
      doCloudWareList(startIndex, endIndex) {
        let lStartIndex = startIndex;
        let lEndIndex = endIndex;
        let whName = this.formSearchWarehouse.whName;
        let customerName = this.formSearchWarehouse.customerName;
        let params = {startIndex: lStartIndex, endIndex: lEndIndex, whName: whName,customerName:customerName,asCloud:this.formSearchWarehouse.asCloud}
        this.$api.doCloudWareList(params).then(res => {
          if (res.status == "S") {
            this.total = res.result.total;
            this.wareHouseData = [];
            for (let record of res.result.records) {
              this.wareHouseData.push(record);
            }
          } else {
            swal('获取用户列表失败', res.result.error, 'error');
          }
        })
      },
    },

    created() {
      this.doCustomerList();
      this.doCloudWareList(this.$table.INIT_START_INDEX, this.$table.INIT_END_INDEX)
    }
  }
</script>
