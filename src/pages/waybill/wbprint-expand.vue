<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>
<template>
	<div>
		<div v-if="row.status == '01' || row.status == '02'">
		<Button type="primary" size="small" style="float:right" @click="editWaybill()">修改运单</Button>
		</div>
        <Tabs :animated="false" @on-click="tabSwitch">
        <TabPane label="运单详情">
        <Row class="expand-row">
            <Col span="8">
                <span class="expand-key">发件人：</span>
                <span class="expand-value">{{waybillDetail.senderName}}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">发件人电话：</span>
                <span class="expand-value">{{ waybillDetail.senderMobile }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">运单备注：</span>
                <span class="expand-value">{{ waybillDetail.remark }}</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="8">
                <span class="expand-key">收件人：</span>
                <span class="expand-value">{{ waybillDetail.receiveName }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">收件人电话：</span>
                <span class="expand-value">{{ waybillDetail.receiveMobile }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">详细地址：</span>
                <span class="expand-value">{{ waybillDetail.receiveAddress }}</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="8">
                <span class="expand-key">重量：</span>
                <span class="expand-value">{{ waybillDetail.weight }} KG</span>
            </Col>
            <Col span="8">
                <span class="expand-key">体积：</span>
                <span class="expand-value">{{ waybillDetail.vloum }} CM3</span>
            </Col>
			<Col span="8">
                <span class="expand-key">配送产品类型：</span>
				<span class="expand-value" v-if="waybillDetail.goodsType == '1'">普通</span>
                <span class="expand-value" v-if="waybillDetail.goodsType == '3'">填仓</span>
                <span class="expand-value" v-if="waybillDetail.goodsType == '4'">特配</span>
                <span class="expand-value" v-if="waybillDetail.goodsType == '6'">控温</span>
                <span class="expand-value" v-if="waybillDetail.goodsType == '7'">冷藏</span>
                <span class="expand-value" v-if="waybillDetail.goodsType == '8'">冷冻</span>
                <span class="expand-value" v-if="waybillDetail.goodsType == '9'">深冷</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="8">
                <span class="expand-key">是否代收货款：</span>
                <span class="expand-value" v-if="waybillDetail.collectionValue == '1'">是</span>
                <span class="expand-value" v-if="waybillDetail.collectionValue != '1'">否</span>
            </Col>
            <Col span="8">
                <span class="expand-key">代收金额：</span>
                <span class="expand-value">{{ waybillDetail.collectionMoney }} 元</span>
            </Col>
            <Col span="8">
                <span class="expand-key">是否保价：</span>
                <span class="expand-value" v-if="waybillDetail.guaranteeValue == '1'">是</span>
                <span class="expand-value" v-if="waybillDetail.guaranteeValue != '1'">否</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="8">
                <span class="expand-key">保价金额金额：</span>
                <span class="expand-value">{{ waybillDetail.guaranteeAmount }} 元</span>
            </Col>
        </Row>
		</TabPane>

		<TabPane label="出库单详情">
        	<Table :columns="stockOutList" :data="stockOutData"></Table>
		</TabPane>

    </Tabs>
    <Modal
        v-model="modelWaybill"
        title="修改运单信息"
        :mask-closable="false"
        :loading="true"
        width="760px">
        <Form :model="formWaybill" label-position="top" ref="formWaybill" :rules="ruleValidate">
          <Row :gutter="5">
            <Col span="6">
            <FormItem label="发货人" prop="senderName">
              <Input type="text" style="width:150px;" v-model="formWaybill.senderName" ></Input>
            </FormItem>
            </Col>
            <Col span="6">
            <FormItem label="发货人电话" prop="senderMobile">
               <Input style="width:150px;" type="text" v-model="formWaybill.senderMobile" ></Input>
            </FormItem>
            </Col>
			<Col span="6">
            <FormItem label="收货人" prop="receiveName">
              <Input type="text" style="width:150px;" v-model="formWaybill.receiveName" ></Input>
            </FormItem>
            </Col>
            <Col span="6">
            <FormItem label="收货人电话" prop="receiveMobile">
              <Input type="text" style="width:150px;" v-model="formWaybill.receiveMobile" ></Input>
            </FormItem>
            </Col>
          </Row>
          <Row :gutter="10">
            <Col span="18">
            <FormItem label="收货地址" prop="receiveAddress">
              <Input type="textarea" v-model="formWaybill.receiveAddress" ></Input>
            </FormItem>
            </Col>
          </Row>
          <Row :gutter="10">
            <Col span="6">
            <FormItem label="是否代收货款" prop="collectionValue">
              <RadioGroup v-model="formWaybill.collectionValue" type="button">
                  <Radio label="1">是</Radio>
                  <Radio label="0">否</Radio>
              </RadioGroup>
            </FormItem>
            </Col>
            <Col span="6">
            <FormItem label="代收金额" prop="collectionMoney" v-show="formWaybill.collectionValue=='1'">
              <Input style="width:150px;" type="text" v-model="formWaybill.collectionMoney" ></Input>
            </FormItem>
            </Col>
            <Col span="6">
            <FormItem label="是否保价" prop="guaranteeValue">
              <RadioGroup v-model="formWaybill.guaranteeValue" type="button">
                  <Radio label="1">是</Radio>
                  <Radio label="0">否</Radio>
              </RadioGroup>
            </FormItem>
            </Col>
            <Col span="6">
            <FormItem label="保价金额金额" prop="guaranteeAmount" v-show="formWaybill.guaranteeValue=='1'">
              <Input style="width:150px;"  type="text" v-model="formWaybill.guaranteeAmount" ></Input>
            </FormItem>
            </Col>
          </Row>
          <Row :gutter="10">
            <Col span="6">
            <FormItem label="重量(KG)" prop="weight">
              <Input style="width:150px;" type="text" v-model="formWaybill.weight" ></Input>
            </FormItem>
            </Col>
            <Col span="6">
            <FormItem label="体积(CM3)" prop="vloum">
              <Input style="width:150px;" type="text" v-model="formWaybill.vloum" ></Input>
            </FormItem>
            </Col>
            <Col span="6">
            <FormItem label="配送产品类型" prop="goodsType">
    			<Select v-model="goodsTypeModel" style="width:150px">
        			<Option v-for="item in goodsTypeList" :value="item.value" :key="item.value">
        			{{ item.label }}
        			</Option>
    			</Select>
            </FormItem>
            </Col>
          </Row>
          <Row :gutter="10">
          	<Col span="18">
            <FormItem label="运单备注" prop="remark">
              <Input type="textarea" v-model="formWaybill.remark" ></Input>
            </FormItem>
            </Col>
          </Row>
        </Form>

        <div slot="footer">
          <Button type="text" size="large" @click="modalCancel">取消</Button>
          <Button type="primary" size="large" @click="saveWaybillInfo('formWaybill')">确定</Button>
      </div>
    </Modal>
	</div>
</template>
<script>
    import Vue from "vue";
    import panel from "../../components/panel.vue";
    import * as api from "../../api";
    import apiConfig from "../../api/apiConfig.js";
    import swal from 'sweetalert2';
    export default {
    	props: {
            row: Object
        },
        data () {
        	const validateCollectionMoney = (rule, value, callback) => {
                if (this.formWaybill.collectionValue=='1') {
                    let reg = new RegExp("^[0-9]+(.[0-9]{0,2})?$");
              		if (!reg.test(value) || value<=0) {
                  		callback(new Error('代收金额不能为空，且为大于零的、最多为两位小数的正数'));
              		}else{
              			callback();
              		}
                }else{
                	callback();
                }
            };
            const validateGuaranteeAmount = (rule, value, callback) => {
            	let reg = new RegExp("^[0-9]+(.[0-9]{0,2})?$");
                if (this.formWaybill.guaranteeValue=='1') {
              		if (!reg.test(value) || value<=0) {
                  		callback(new Error('保价金额不能为空，且为大于零的、最多为两位小数的正数'));
              		}else{
                		callback();
                	}
                }else{
                	callback();
                }
            };
            return {
            	modelWaybill: false,
            	formWaybill: {senderName: '', senderMobile: '', senderAddress: '', collectionMoney: '', collectionValue: '',
            				  receiveName: '', receiveMobile: '', receiveAddress: '', guaranteeValue: '', guaranteeAmount: '',
							  weight: '', vloum: '',remark: '', goodsType: ''},
				waybillDetail: [],
                stockOutList: [
                    {
                        title: '货主标识',
                        key: 'ownerCode',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '货品编号',
                        key: 'medicineCode',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '货品名称',
                        key: 'medicineName',
                        align: 'center'
                    },
                    {
                        title: '货品数量',
                        key: 'totalNumber',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '件装',
                        key: 'medicinePackages',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '批号',
                        key: 'licenseCode',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '生产厂家',
                        key: 'medicineFactory',
                        align: 'center'
                    }
                ],
                goodsTypeList: [
                    {
                        value: '1',
                        label: '普通'
                    },
                    {
                        value: '3',
                        label: '填仓'
                    },
                    {
                        value: '4',
                        label: '特配'
                    },
                    {
                        value: '6',
                        label: '控温'
                    },
                    {
                        value: '7',
                        label: '冷藏'
                    },
                    {
                        value: '8',
                        label: '冷冻'
                    },
                    {
                        value: '9',
                        label: '深冷'
                    }
                ],
                goodsTypeModel: '',
                stockOutData: [],
                ruleValidate: {
                  senderName: [
                    { required: true, message: '发货人不能为空', trigger: 'blur' },
                    { type: 'string', max: 96, message: '发货人不能多于100个字符', trigger: 'blur' }
                  ],
                  senderMobile: [
                    { required: true, message: '发货人电话', trigger: 'blur' },
                    { type: 'string', max: 20, message: '发货人电话不能多于20个字符', trigger: 'blur' }
                  ],
                  senderAddress: [
                    { required: true, message: '发货人地址不能为空', trigger: 'blur' },
                    { type: 'string', max: 40, message: '发货人地址不能多于400个字符', trigger: 'blur' }
                  ],
                  receiveName: [
                    { required: true, message: '收货人不能为空', trigger: 'blur' },
                    { type: 'string', max: 96, message: '收货人不能多于100个字符', trigger: 'blur' }
                  ],
                  receiveMobile: [
                    { required: true, message: '收货人电话不能为空', trigger: 'blur' },
                    { type: 'string', max: 20, message: '收货人电话不能多于20个字符', trigger: 'blur' }
                  ],
                  receiveAddress: [
                    { required: true, message: '收货人地址不能为空', trigger: 'blur' },
                    { type: 'string', max: 40, message: '收货人地址不能多于400个字符', trigger: 'blur' }
                  ],
                  remark: [
                    { type: 'string', max: 40, message: '备注不能多于400个字符', trigger: 'blur' }
                  ],
                  guaranteeAmount: [{validator:validateGuaranteeAmount,trigger:'blur'}],
                  collectionMoney: [{validator:validateCollectionMoney,trigger:'blur'}]
                }
            }
        },
        methods: {
        	editWaybill(){
        		this.$refs['formWaybill'].resetFields();
        		this.getWaybillInfo();
            	this.modelWaybill = true;
        	},
        	getWaybillInfo(){
        		let params = {
                  waybillCode:this._props.row.waybillCode,
                  vendor:this._props.row.vendor
                }
            	this.$api.getWaybillInfo(params).then(res => {
                  if(res.status == "S"){
                      this.formWaybill = res.result.record;
                      this.waybillDetail = res.result.record;
                      if(this.waybillDetail.goodsType == 1){this.goodsTypeModel='1';}
            		  if(this.waybillDetail.goodsType == 3){this.goodsTypeModel='3';}
            		  if(this.waybillDetail.goodsType == 4){this.goodsTypeModel='4';}
            		  if(this.waybillDetail.goodsType == 6){this.goodsTypeModel='6';}
            		  if(this.waybillDetail.goodsType == 7){this.goodsTypeModel='7';}
            		  if(this.waybillDetail.goodsType == 8){this.goodsTypeModel='8';}
            		  if(this.waybillDetail.goodsType == 9){this.goodsTypeModel='9';}
                  }else{
                      swal({text: '未查询到运单信息',type: 'error',showCancelButton: false,width:300});
                  }
                });
        	},
        	saveWaybillInfo (name) {
        		this.$refs[name].validate((valid) => {
					if (valid) {
						let params = {
						  waybillCode:this._props.row.waybillCode,
						  vendor:this._props.row.vendor,
						  senderName:this.formWaybill.senderName,
						  senderMobile:this.formWaybill.senderMobile,
						  senderAddress:this.formWaybill.senderAddress,
						  receiveName:this.formWaybill.receiveName,
						  receiveMobile:this.formWaybill.receiveMobile,
						  receiveAddress:this.formWaybill.receiveAddress,
						  weight:this.formWaybill.weight,
						  vloum:this.formWaybill.vloum,
						  goodsType:this.goodsTypeModel,
						  remark:this.formWaybill.remark,
						  collectionValue:this.formWaybill.collectionValue,
						  collectionMoney:this.formWaybill.collectionValue=='1'?this.formWaybill.collectionMoney:0,
						  guaranteeValue:this.formWaybill.guaranteeValue,
						  guaranteeAmount:this.formWaybill.guaranteeValue=='1'?this.formWaybill.guaranteeAmount:0
						}
						this.$api.updateWaybillInfo(params).then(res => {
						  if(res.status == "S"){
						    this.modelWaybill = false;
							swal({text: '修改运单成功!',type: 'success',showCancelButton: false,width:300}).then((s)=>{this.getWaybillInfo();});
						  }else{
							swal({text: '修改运单失败',type: 'error',showCancelButton: false,width:300});
						  }
						})
					}
				})
            },
            tabSwitch(target){
            	if(target == '0'){
            		this.getWaybillInfo();
            	}
            	if(target == '1'){
            		if(this._props.row.distributionId !=null){
            			this.getStockOutDetail(this._props.row.distributionId);
            		}
            	}
            },
            getStockOutDetail(code){
            	let params = {
                  distributionId:code
                }
                this.$api.getStockOutDetails(params).then(res => {
					if(res.status == "S"){
						this.stockOutData = [];
						for(let record of res.result.records){
							if(record){
							  record.ownerCode = res.result.ownerCode;
							}
							this.stockOutData.push(record);
						}
					}
                })
        	},
            modalCancel () {
                this.modelWaybill = false;
            }
    	},
    	created(){
    		this.getWaybillInfo();
    	}
    };
</script>
