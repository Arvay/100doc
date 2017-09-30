<template>
  <div class="dashboard-container">
    <div class="videoUploadBox el-upload-dragger" v-show="uploadBoxIsShow" id="dropTarget">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        <div class="el-upload__text">将文件拖到此处，或<em id="resumable-browse">点击上传</em></div>
      </div>
    </div>
    <div v-show="formBoxShow" class="formBox">
      <el-form :model="form">
        <el-form-item label="上传进度：" :label-width="formLabelWidth">
          <el-progress style="width: 60%;float:left" :text-inside="true" :stroke-width="18" :percentage="progress"></el-progress>
          <el-button style="margin-left:10px" type="warning" size="mini" @click="suspendUpload">暂停</el-button>
          <el-button style="margin-left:10px" type="danger" size="mini" @click="removeUpload">删除</el-button>
          <el-button style="margin-left:10px" type="primary" size="mini" @click="goOnUpload">继续</el-button>
        </el-form-item>
        <el-form-item label="标题：" :label-width="formLabelWidth">
          <el-input v-model="form.vaideName" :maxlength="255" auto-complete=""></el-input>
        </el-form-item>
        <el-form-item label="描述：" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="2" :maxlength="255" placeholder="请输入内容" v-model="form.voidPicture"></el-input>
        </el-form-item>
        <el-form-item label="封面图：" :label-width="formLabelWidth">
          <el-upload class="upload-demo" action="http://liveapi.cn/vms/v1/asset/poster" :on-success="fileImgSuccess" :headers="token" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="标签：" :label-width="formLabelWidth">
          <el-tag :key="tag" v-for="tag in dynamicTags" :closable="true" :close-transition="false" @close="handleClose(tag)">
            {{tag}}
          </el-tag>
          <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="mini" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 输入后回车添加</el-button>
        </el-form-item>
        <el-form-item label="DRM：" :label-width="formLabelWidth">
          <el-radio class="radio" v-model="radioDRM" label="0">无</el-radio>
          <el-radio class="radio" v-model="radioDRM" label="1">有</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" id="btnBox" class="dialog-footer" :label-width="formLabelWidth">
        <el-button @click="dialogFormVisible = false" class="marginLeft">默认配置</el-button>
        <el-button type="primary" @click="dialogFormVisible = false;createProgram(true)">确 定</el-button>
      </div>
    </div>
    <echolist></echolist>
  </div>
</template>

<script>
import http from '@/utils/http'
import http2 from '@/utils/http2'
import api from '@/utils/api'
import store from '@/store/index'
import echolist from './echoList'
export default {
  name: 'dashboard',
  components: {
    echolist,
    store
  },
  data() {
    return {
      r: {},
      progress: 0,
      token: { Authorization: 'Bearer ' + localStorage.getItem('yibai_token') },
      fileKey: '',
      radioDRM: '0',
      listTotal: this.$store.state.listTotal, // 分页总数据
      targetUrl: '', // 视频上传地址
      coverUrl: '', // 上传后的图片地址
      uploadBoxIsShow: true, // 上传框
      dialogTableVisible: false,
      dialogFormVisible: false,
      formBoxShow: true, // 视频信息框
      form: {
        vaideName: '', // 视频名称
        voidPicture: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      // 标签
      dynamicTags: [],
      tags: '',
      inputVisible: false,
      inputValue: '',
      formLabelWidth: '120px',
      fileList: []
    }
  },
  computed: {
  },
  mounted() {
    this.getuploadurl()
  },
  methods: {

    createProgram: async function(is) {
      var tags = JSON.stringify(this.dynamicTags)
      tags = tags.replace('[', '').replace(']', '').replace(/\"/g, '')
      var DRM = parseInt(this.radioDRM)
      const params = {
        name: this.form.vaideName,
        cpID: 'cpid001',
        userID: 'user001',
        description: this.form.voidPicture,
        fileKey: this.fileKey,
        coverURL: this.coverURL,
        isDRM: DRM,
        tags: tags
      }
      const res = await http2.post(api.createProgram, params)
      if (res.code === 0) {
        if (is === true) {
          this.open2('上传成功')
        }
        // console.log('上传视频信息' + this.targetUrl)
      }else{
        this.open2(res.message)
      }
    },
    open2(mess) {
      this.$message(mess)
    },
    // 上传图片返回地址
    fileImgSuccess(response, file, fileList) {
      this.coverURL = response.data.url
    },
    open() {
      this.$alert('不支持多个文件同时上传', '提示', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'info',
            message: `提示: 请重新选择`
          })
          this.r.cancel()
        }
      })
    },
    // 上传封面
    submitUpload() {
      this.$refs.upload.submit()
    },
    // 获取视频上传地址
    getuploadurl() {
      const getuploadurl = async function() {
        var data = await http.get(api.getuploadurl)
        return data
      }
      getuploadurl().then(result => {
        this.targetUrl = result.data.uploadUrl
        result = result.data.uploadUrl.split('token=')[1]
        this.fileKey = result
        this.createProgram(false)
        var that = this
        that.r = new Resumable({
          target: that.targetUrl,
          targetArray: '',
          chunkSize: 1 * 1024 * 1024,
          simultaneousUploads: 1,
          resumableChunkNumber: 1,
          testChunks: true,
          uploadMethod: 'POST',
          throttleProgressCallbacks: 1,
          method: 'octet',
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        var videoLength = 0
        that.r.assignBrowse(document.getElementById('resumable-browse'))
        that.r.assignDrop(document.getElementById('dropTarget'))
        that.r.target = 'www/baidu.com'
        that.r.on('fileAdded', function(file) {
          videoLength++
          if (videoLength > 1) {
            that.open()
          }
          setTimeout(() => {
            // 允许上传
            if (videoLength === 1) {
              that.formBoxShow = true// 显示视频信息框
              that.uploadBoxIsShow = false // 上传视频框隐藏
              that.r.upload()
            }
            videoLength = 0
          }, 1000)
          that.form.vaideName = file.fileName
        })
        that.r.on('fileProgress', function(file) {
          that.progress = Math.floor(that.r.progress() * 100)
        })
        that.r.on('catchAll', function(file, message) {
          // alert(1)
        })
        // 上传成功
        that.r.on('fileSuccess', function(file, message) {
          console.log(message)
        })
        // 上传失败
        that.r.on('fileError', function(file, message) {
          console.log(message)
        })
      }).catch(err => {
        console.log(err)
      })
    },
    buildUploadUrl() {
      // this.getuploadurl()
      // this.getuploadurl()
      // this.uoloadBtn()
      // this.r.assignDrop(document.getElementById('dropTarget'))
      // this.getuploadurl()
    },
    handleRemove(file, fileList) {
    },
    handlePreview(file) {
    },
    // 标签
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 暂停上传
    suspendUpload() {
      this.r.pause()
    },
    // 删除上传
    removeUpload() {

    },
    // 继续上传
    goOnUpload() {
      this.r.upload()
    },
    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
#dropTarget {
  margin-left: 52px;
  margin-bottom: 20px;
}

.el-progress {
  margin-top: 9px;
}

.formBox {
  border: 1px solid #bfcbd9;
  padding: 20px;
  border-radius: 10px;
  width: 800px;
  margin-bottom: 20px;
}

#btnBox {
  padding-top: 20px;
  border-top: 1px solid #bfcbd9;
}

.marginLeft {
  margin-left: 120px;
}

.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.el-tag {
  margin-right: 10px
}

.progress {
  margin: 20px 0 20px 50px;
  width: 400px;
  height: 20px;
  padding-left: 10px;
  border-radius: 15px;
  background: #bbb;
  &-c {
    width: 50%;
    height: 100%;
    line-height: 20px;
    font-size: 14px;
    color: #fff;
    background: greenyellow;
  }
}
</style>
