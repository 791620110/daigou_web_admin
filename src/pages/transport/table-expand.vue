<style scoped>
  .expand-row{
    margin-bottom: 16px;
  }
</style>
<template>
  <div >

    <div v-for="(item, index) in row.medicineList"
         :key="index"
         :label="'项目' + (index + 1)"
         :prop="'items.' + index + '.value'" style="margin-bottom: 10px">
    <Row class="expand-row">
      <Col span="8">
        <span class="expand-key">药品名称：</span>
      <span class="expand-value">{{ item.medName }}</span>
      </Col>
      <Col span="8">
        <span class="expand-key">药品编码：</span>
        <span class="expand-value">{{ item.medNo }}</span>
      </Col>
      <Col span="8">
        <span class="expand-key">药品单价：</span>
        <span class="expand-value">{{ item.medPrice }} 元</span>
      </Col>
    </Row>
    <Row>
      <Col span="8">
        <span class="expand-key">药品数量：</span>
        <span class="expand-value">{{ item.medNum }}</span>
      </Col>
      <Col span="8">
      <span class="expand-key">生产日期：</span>
      <span class="expand-value">{{ item.medCreateDate }}</span>
      </Col>
      <Col span="8">
      <span class="expand-key">有效期：</span>
      <span class="expand-value">{{ item.medValidDate }} 年</span>
      </Col>
    </Row>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      row: Object
    }
  };
</script>
