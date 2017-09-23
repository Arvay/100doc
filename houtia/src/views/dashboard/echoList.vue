<template>
  <div class="echoList">
    <el-row :gutter="20">
      <el-col :span="6" v-for="site in sites">
        <div class="grid-content bg-purple"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import http2 from '@/utils/http2'
import api from '@/utils/api'
export default {
  name: 'echoList',
  data() {
    return {
      sites: []
    }
  },
  computed: {
  },
  mounted() {
    this.queryProgram()// 获取视频列表
  },
  methods: {
    queryProgram: async function() {
      var res = await http2.get(api.queryProgram)
      this.sites = res.data.data
      console.log(res)
    }

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
