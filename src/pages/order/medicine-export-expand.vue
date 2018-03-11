<template>
  <div>
    <Table :columns="columns" :data="data"></Table>
  </div>
</template>
<script>
  export default {
        props: {
            row: Object
        },
        data () {
            return {
                columns: [
                    {title: '云仓仓库编号',key: 'warehouseCode',align: 'center'},
                    {title: '云仓仓库名称',key: 'warehouseName',align: 'center'},
                    {title: '出货数量',key: 'deliveryTotalNumber',align: 'center'}
                ],
                data: []
            }
        },
        methods:{
          selectwarehouse(){
            this.$router.push('/order/sepOrderList?orderCode='+this._props.row.extOrderCode)
          },
          edit(){
            this.$router.push('/order/order?orderCode='+this._props.row.extOrderCode)
          }

        },
        created(){
            this.data = this._props.row.deliveryList
        }
    };
</script>
