<style scoped>
  .expand-row{
    margin-bottom: 16px;
  }
</style>
<template>
  <div>
    <Row class="expand-row">
      <Table :columns="columns" :data="data"></Table>
    </Row>
    <Modal v-model="delView" width="580">
    <p slot="header" style="color:#f60;text-align:left">
      <Icon type="information-circled"></Icon>
      <span>提示信息</span>
    </p>
    <div style="margin:10px">
        <span style="font-size:16px">您确定要设置&nbsp;<B><span style="font-size:13px;color:red">{{customerCode}}-{{customerName}}</span></B>&nbsp;不再使用&nbsp;<B><span style="font-size:13px;color:red">{{whName}}</span></B>&nbsp;吗</span>
    </div>
    <div slot="footer">
        <Button type="text" size="large" @click="delView=false">取消</Button>
        <Button type="error" size="large"  @click="doDel">删除</Button>
      </div>
  </Modal>

  </div>
</template>



<script>
  import swal from 'sweetalert2'
  export default {
    props: {  whCode:String ,whName:String },
    data(){
      return{
        delView:false, customerCode:'', customerName:'',   
        columns: [
          {title: '客户编码',key: 'customerCode',align: 'center'},
          {title: '客户名称',key: 'customerName',align: 'center'},
          {title: '客户类型',key: 'typeName',align: 'center'},
          { title: '客户状态',align: 'center' ,width:90 ,
            render: (h, params) => {return params.row.status === '00' ? "可用": "不可用";}},
          {title: '关联关系',key: 'typeName',align: 'center',width: 100,
            render: (h, params) => {return params.row.asOwner === 'Y'?"所有者":"使用者";}},
          {title: '对应仓库货主',key: 'warehouserOwnerName',align: 'center'},  
          {title: '操作',key: 'action',width:90,align: 'center',
            render: (h, params) => {
                return h('div', [
                  h('Button', {props: {type: 'error',size: 'small',disabled:params.row.asOwner === 'Y'},style: {marginRight: '5px'},on: {click: () => {this.del(params.row)}}}, '解除'),
                ]);
            }
          }
        ],data:[],
      }
    },
    methods:{
        init(){
          this.whCode = this._props.whCode;
          this.$api.doWarehouseCustomerSelectList(this.whCode).then(res => {
              if(res.status == "S"){
                this.data = [];
                for(let record of res.result){
                    record.typeName = (record.buyer == "Y" ? "采购客户 ":"")+(record.warehouser == "Y" ? "仓储客户 ":"")+(record.saler == "Y" ? "供应商客户 ":"")
                    record.warehouserOwnerName = (record.warehouserOwnerName == null || record.warehouserOwnerName == '') ? '-/-' : record.warehouserOwnerName
                    this.data.push(record);
                }
              }else{
                  swal('获取仓库租赁客户列表失败', res.message, 'error');
              }
          })
        },
        del(row){
            this.delView = true;
            this.customerCode = row.customerCode;
            this.customerName = row.customerName;
        },
        doDel(){
            this.$api.doWareBindDel(this.whCode,this.customerCode).then(res => {
                if(res.status == "S"){
                  this.delView = false;
                  swal({text: '操作成功!',type: 'success',showCancelButton: false,width:300}).then((isConfirm)=>{this.init()});
                }else{
                  swal({text: '操作失败['+res.message+']',type: 'error',showCancelButton: false,width:300});
                }
            })
        }
    },
    created(){this.init()}
  };



</script>




