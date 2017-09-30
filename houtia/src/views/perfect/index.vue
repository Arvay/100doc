<template>
  <div class="echoList">
    <!-- Form -->
    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <el-form :model="form">
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
        <el-button type="primary" @click="dialogFormVisible = false;createProgram()">确 定</el-button>
      </div>
    </el-dialog>
    <el-table :data="tableData" prop="id" stripe style="width: 100%">
      <el-table-column prop="name" label="标题" width="180">
      </el-table-column>
      <el-table-column prop="isDRM" label="DRM" width="180">
      </el-table-column>
      <el-table-column prop="description" label="简介">
      </el-table-column>
      <el-table-column prop="tags" label="标签">
      </el-table-column>
      <el-table-column v-if="filekeyShow" prop="id" label="视频id">
      </el-table-column>
      <el-table-column v-if="filekeyShow" prop="fileKey" label="fileKey">
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage1" :page-size="10" layout="total, prev, pager, next" :total="totalNum">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import http2 from '@/utils/http2'
import api from '@/utils/api'
import store from '@/store/index'
export default {
  name: 'echoList',
  components: {
    store
  },
  data() {
    return {
      tableData: [],
      picArray: [],
      filekeyShow: false,
      getProgramNum: '',
      dialogTableVisible: false,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      coverURL: '',
      sites: [],
      totalNum: 0,
      currentPage1: 1, // 分页显示的位置
      token: { Authorization: 'Bearer ' + localStorage.getItem('yibai_token') },
      dynamicTags: [],
      inputVisible: false,
      fileKey: '',
      fileList: [],
      radioDRM: '0',
      inputValue: '',
      datatags: '',
      dynamicTagsString: '',
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
      }
    }
  },
  computed: {
  },
  mounted() {
    this.queryProgram(1, 10)// 获取视频列表
  },
  methods: {
    handleSizeChange(val) {
      this.queryProgram(val, 10)// 获取视频列表
    },
    handleCurrentChange(val) {
      this.queryProgram(val, 10)// 获取视频列表
      console.log(`当前页: ${val}`)
    },
    fileImgSuccess(response, file, fileList) {
      this.coverURL = response.data.url
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
    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    handlePreview(file) {
    },
    handleRemove(file, fileList) {
    },
    // 上传封面
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleEdit(index, row) {
      this.getProgramNum = row.id
      this.getProgram()
    },
    getProgram: async function() {
      const res = await http2.get(api.getProgram + this.getProgramNum)
      if (res.code === 0) {
        // console.log('上传视频信息' + this.targetUrl)
        // 修改信息回显
        console.log(res.data.tags)
        this.form.vaideName = res.data.name // 标题
        this.form.voidPicture = res.data.description // 简介
        this.fileKey = res.data.fileKey // fileKey
        this.datatags = res.data.tags
        this.dynamicTags = this.datatags.split(',')// 标签
        this.radioDRM = res.data.isDRM.toString()
        this.dialogFormVisible = true
      }
    },
    // 更新视频信息
    createProgram: async function() {
      this.dynamicTagsString = JSON.stringify(this.dynamicTags)
      this.dynamicTagsString = this.dynamicTagsString.replace('[', '').replace(']', '').replace(/\"/g, '')
      var DRM = parseInt(this.radioDRM)
      var params = {
        id: this.getProgramNum,
        name: this.form.vaideName,
        cpID: 'cpid001',
        userID: 'user001',
        description: this.form.voidPicture,
        fileKey: this.fileKey,
        coverURL: this.coverURL,
        isDRM: DRM,
        tags: this.dynamicTagsString
      }
      const res = await http2.post(api.updateProgram, params)
      if (res.code === 0) {
        this.queryProgram(1, 10)
        this.open2('修改成功')
      }
    },
    open2(msg) {
      this.$message({
        message: msg,
        type: 'success'
      })
    },
    queryProgram: async function(pageNum, pageSize) {
      var res = await http2.get(api.queryProgram + 'pageNum=' + pageNum + '&pageSize=' + pageSize)
      for (var i = 0; i < res.data.data.length; i++) {
        if(res.data.data[i].tags != null){
          this.picArray = res.data.data[i].tags.split(',')
        }
      }
      console.log(res)
      this.tableData = res.data.data
      this.sites = res.data.data
      this.totalNum = res.data.total
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

.el-tag {
  margin-right: 10px
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.el-col-12 {
  margin-bottom: 20px;
}

.grid-content {
  box-shadow: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  padding: 20px;
}

.el-tag--primary {
  margin-right: 10px;
  margin-bottom: 10px;
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

.el-col-6 {
  margin-bottom: 20px;
}
</style>
