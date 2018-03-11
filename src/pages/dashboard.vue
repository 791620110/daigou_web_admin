<template>
  <div class="dashboard" ref="dashboard">
    <el-row>
      <el-col :span="24">
        <div id="gotobedbar"></div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import data from '../../static/data/data.json';
  import {mapGetters, mapActions, mapMutations} from 'vuex'

  export default {
    data() {
      return {
        chart: null
      };
    },
    computed: {
      ...mapGetters({
        sidebar: 'sidebar',
        device: 'device',
      }),
    },
    methods: {

      drawbar(id) {
//        let o = document.getElementById(id);
//        let height = document.documentElement.clientHeight;
//        height -= 120;
//        o.style.height= height+"px";
//        this.chart = echarts.init(o,'macarons');
//        this.chart.setOption(option);
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.drawbar('gotobedbar');
        var that = this;
        var resizeTimer = null;
        window.onresize = function () {
          if (resizeTimer) clearTimeout(resizeTimer);
          resizeTimer = setTimeout(function () {
            that.drawbar('gotobedbar');
          }, 300);
        }
      });
    },
    watch: {
      'sidebar.collapsed': function (val) {
        this.chart = {}
        var that = this;
        setTimeout(function () {
          that.drawbar('gotobedbar');
        }, 300);
      },
    }
  }
</script>

<style scoped>

  #gotobedbar {
    width: 100%;
    min-height: 500px;
    margin-right: 15px;
  }
</style>
