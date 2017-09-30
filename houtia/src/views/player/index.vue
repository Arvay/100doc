<template>
  <div class="playerBox">
    <div class="ckd"></div>
    <div id="id_test_video" style="width:100%; height:auto;">
      <!-- <div class="mask"></div> -->
      <!-- <div class="stopImg" @click="play"></div>
        <div class="errorImg"></div>
        <div class="loadingImg"></div> -->
      <!-- <div class="videoImg"></div> -->
    </div>
    <el-row>
      <el-col :span="6" v-for="queryProgramList in queryProgramList">
        <el-card :body-style="{ padding: '0px' }">
          <img v-bind:src="queryProgramList.coverURL" class="image">
          <div style="padding: 14px;">
            <span class="textHide" v-if="queryProgramList!=''">{{queryProgramList.name}}</span>
            <span class="textHide" v-else>无名称</span>
            <div class="bottom clearfix">
              <time class="time">{{ currentDate }}</time>
              <el-button type="text" class="button" :id="queryProgramList.id" @click="getProgramBtn">播放</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage1" :page-size="8" layout="total, prev, pager, next" :total='totalLength'>
      </el-pagination>
    </div>
  </div>
</template>
<script>
import http2 from '@/utils/http2'
import api from '@/utils/api'
import store from '@/store/index'

export default {
  name: 'playerBox',
  components: {
    store,
    http2,
    api
  },
  data() {
    return {
      currentDate: new Date(),
      totalLength: 1,
      queryProgramList: '',
      snapshotURL: '',//切片
      currentTime: 1, // 当前播放位置
      coverpicUrl: '', // 封面图
      m3u8Url: '', // 原画
      m3u8_hd: '', // 高清
      m3u8_sd: '', // 标清
      currentPage1: 1, // 分页
      maskShow: false,//播放器遮罩
      stopShow: false,
      errotShow: false,
    }
  },
  computed: {
  },
  mounted() {
    this.queryProgram(1, 8)// 视频列表
    this.mousemoveF()
  },
  methods: {
    mousemoveF() {
      $(document).bind("mousemove", function(e) {
        $(".videoImg").css("left", e.pageX - 66).css("top", e.pageY - 90)
        if ($('.vcp-timelabel').html()) {
          var set, url, urlName, format, timeStamp, theSecondPair, yushu, lie, hang, y, x
          set = $('.vcp-timelabel').html().split(' / ')[0].split(':')
          this.currentTime = parseInt(set[0]) * 60 + parseInt(set[1])
          var url = localStorage.getItem('snapshotURL')
          urlName = url.split('&')[0].split('_0.')[0]
          format = url.split('&')[0].split('_0.')[1]
          //切片显示位置
          timeStamp = parseInt(this.currentTime / 10)
          theSecondPair = parseInt(timeStamp / 100)
          yushu = timeStamp % 100// 第N张的 第28张图
          lie = parseInt(yushu / 10)// 28/10  第二列 第8张
          hang = yushu % 10 //第8张
          if (lie != 0 && yushu % 10 == 0) {
            lie = lie - 1
            hang = hang + 9
          } else {
            y = lie * 80
            x = hang * 142
          }
          $('.videoImg').css("background", 'url(' + urlName + '_' + theSecondPair + '.' + format + ') -' + x + 'px -' + y + 'px')
        }
      });
      $('body').on("mousedown", '.vcp-slider-thumb', function() {
        $('.videoImg').show();
      })
      $('body').on("mouseup", '.vcp-slider-thumb', function() {
        $('.videoImg').hide();
      })
      $('body').on('mouseleave', ".vcp-timeline", function() {
        $('.videoImg').hide();
      });
    },
    /**
     * 获取视频播放地址
     */
    windPlayer() {
      var that = this
      that.player = new TcPlayer('id_test_video', {
        'm3u8': this.m3u8Url,
        'm3u8_hd': this.m3u8_hd,
        'm3u8_sd': this.m3u8_sd,
        'autoplay': true,      // iOS下safari浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
        'coverpic': { 'style': 'stretch', 'src': this.coverpicUrl },
        'width': '1056', // 视频的显示宽度，请尽量使用视频分辨率宽度
        'height': '542', // 视频的显示高度，请尽量使用视频分辨率高度
        listener: function(e) {
          console.log(e)
          //loding显示
          if(e.type == 'seeking'){
            $('.mask,.loadingImg').show()
          }else if(e.type === 'pause'){
           $('.mask,.stopImg').show()
          }else{
            $('.mask,.stopImg,.loadingImg').hide()
          }
          //错误显示
          if (e.type === 'error') {
             $('.errorImg').show(), $('video').hide();
          } else {
            $('.errorImg').hide(), $('video').show();
          }
          //暂停显示
          $("body").on('click', '.vcp-playtoggle', function() {
            $('.mask,.stopImg').show()
          })

        }
      })
      // 点击暂停按钮播放
      $('body').on('click','.stopImg',function(){
      $('.mask,.stopImg').hide()
       that.player.play()
      })
      var appendDiv = '<div class="videoImg"></div>' +
        '<div class="mask"></div>' +// 黑色遮罩
        '<div class="stopImg"></div>' + //停止图标
        '<div class="errorImg"></div>' + // 错误图标
        '<div class="loadingImg"></div>' // loding图标
      $('.vcp-player').append(appendDiv);
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.queryProgram(val, 8)// 视频列表
    },
    getProgramBtn(event) {
      const id = event.currentTarget.id
      this.getProgram(id)// 视频详情
      this.getPlayURL(id)// 视频地址
    },
    /**
   * 视频列表
   */
    queryProgram: async function(pageNum, pageSize) {
      const e = await http2.get(api.queryProgram + 'pageNum=' + pageNum + '&pageSize=' + pageSize)
      this.totalLength = parseInt(e.data.total)
      this.queryProgramList = e.data.data
    },
    /**
    * 视频详情
    */
    getProgram: async function(id) {
      const e = await http2.get(api.getProgram + id)
      this.coverpicUrl = e.data.coverURL
      localStorage.setItem('snapshotURL', e.data.snapshotURL)
    },
    // 获取播放地址
    getPlayURL: async function(id) {
      const e = await http2.get(api.getProgramPlaybackURL + id)
      console.log(e)
      for (var i = 0; i < e.data.length; i++) {
        var definition = e.data[i].definition
        if (definition == 210) {
          this.m3u8_sd = e.data[i].playbackURL
        } else if (definition == 220) {
          this.m3u8_hd = e.data[i].playbackURL
        } else if (definition == 230) {
          this.m3u8Url = e.data[i].playbackURL
        }
      }
      if (e.code === 0) {
        this.windPlayer()
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.time {
  font-size: 13px;
  color: #999;
}

.el-col-offset-2 {
  margin-left: 0 !important;
}

.el-col-6 {
  padding: 20px;
}

.errorImg,
.loadingImg,
.stopImg {
  cursor: pointer;
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 9999999;
  width: 70px;
  height: 62px;
  margin-left: -35px;
  margin-top: -120px;
}

.loadingImg {
  width: 200px;
  height: 200px;
  display: none;
  margin-left: -100px;
  margin-top: -130px;
  background: url(../../images/loading.gif); // background: url(../../images/loading.gif) no-repeat;
}

.playerBox {
  position: relative;
}

.errorImg {
  display: none;
  background: url(../../images/live_error.png) no-repeat;
}

.app-wrapper {
  position: relative;
}

.stopImg {
  display: none;
  width: 66px;
  height: 66px;
  margin-top: -60px;
  margin-left: -33px;
  background: url(../../images/live_click_play.png) no-repeat;
}
.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.textHide {
  display: block !important;
  height: 20px !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

#id_test_video {
  clear: both; // overflow: hidden;
  position: relative;
}

.mask {
  position: absolute;
  display: none;
  width: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 999999;
  background: #000;
  opacity: .45;
}

.videoImg {
  display: none;
  position: fixed;
  width: 142px;
  height: 80px;
  z-index: 9999999;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}
</style>
