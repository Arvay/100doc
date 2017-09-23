<template>
  <div class="dashboard-container">
    <el-upload class="upload-demo" drag action="https://jsonplaceholder.typicode.com/posts/" multiple>
  <i class="el-icon-upload"></i>
  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
  <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
</el-upload>
    <div class='dashboard-text'>视频文件上传sss</div>
    <div class='dashboard-text' id="resumable-browse">点击上传文件</div>
    <div class='dashboard-text' id="resumable-drop">{{name1}}</div>
    <div class='progress'>
      <div class='progress-c' :style="'width:' + progress + '%'">{{progress}}%</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dashboard',
  data() {
    return {
      r: {},
      name1: '我是文件名',
      progress: 0
    }
  },
  computed: {
  },
  mounted() {
    var that = this
    that.r = new Resumable({
      target: 'http://192.168.1.214:8088/?token=6',
      targetArray: '',
      chunkSize: 1 * 1024 * 1024,
      simultaneousUploads: 2,
      testChunks: true,
      uploadMethod: 'POST',
      throttleProgressCallbacks: 1,
      prioritizeFirstAndLastChunk: true,
      method: 'octet',
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    console.log(this.r)
    that.r.assignDrop(document.getElementById('resumable-drop'))
    that.r.assignBrowse(document.getElementById('resumable-browse'))
    that.r.on('fileAdded', function(file) {
      console.log(file.fileName)
      that.name1 = file.fileName
      that.r.upload()
    })
    that.r.on('fileProgress', function(file) {
      that.progress = Math.floor(that.r.progress() * 100)
    })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.progress {
    width: 400px;
    height: 20px;
    background: #bbb;
    &-c {
      width:50%;
      height:100%;
      line-height: 20px;
      font-size: 14px;
      color: #fff;
      background: greenyellow;
    }
  }
</style>
