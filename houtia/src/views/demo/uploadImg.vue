<template>
  <div class="uploadImg">
    <div class="uploadBox">
      <vueCropper ref="cropper3" :img="example3.img" :autoCrop="example3.autoCrop" :autoCropWidth="example3.autoCropWidth" :autoCropHeight="example3.autoCropHeight" :fixedBox="example3.fixedBox"></vueCropper>
    </div>
    <el-button type="info" @click="make">获取</el-button>
  </div>
</template>

<script>
import VueCropper from 'vue-cropper'
import store from '@/store/index'
export default {
  name: 'uploadImg',
  components: {
    store,
    VueCropper
  },
  data() {
    return {
      example3: {
        img: 'https://o90cnn3g2.qnssl.com/0C3ABE8D05322EAC3120DDB11F9D1F72.png',
        autoCrop: true,
        outputType: 'png',
        autoCropWidth: 200,
        autoCropHeight: 200,
        fixedBox: true
      }
    }
  },
  computed: {

  },
  mounted() {
  },
  methods: {
    make() {
      this.$refs.cropper3.getCropData((data) => {
        console.log(data)
			})
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.uploadBox {
  width: 400px;
  height: 400px;
}
</style>
