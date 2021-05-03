<template>
  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>

    <el-button type="text" @click="openChapterDialog">添加章节</el-button>
    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 章节 -->
    <ul class="chapterList">
      <li
        v-for="chapter in chapterVideoList"
        :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
            <el-button type="text" @click="openVideo(chapter.id)">添加课时</el-button>
            <el-button type="text" @click="openEditChapter(chapter.id)">编辑</el-button>
            <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
          </span>
        </p>

        <!-- 视频 -->
        <ul class="chapterList videoList">
          <li
            v-for="video in chapter.children"
            :key="video.id">
            <p>{{ video.title }}
              <span class="acts">
                <el-button type="text" @click="openEditVideo(video.id)">编辑</el-button>
                <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>

    <el-form label-width="120px">
      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
      </el-form-item>
    </el-form>

    <!-- 添加和修改x小节课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="1">免费</el-radio>
            <el-radio :label="0">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API+'/eduvod/video/uploadAliyunVideo'"
            :limit="1"
            class="upload-demo">
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">最大支持1G，<br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import chapter from '@/api/edu/chapter'
import video from '@/api/edu/video'
export default {
  name: 'Chapter',
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseId: '',
      chapterVideoList: [],
      chapter: {
        courseId: '',
        title: '',
        sort: 0
      }, // 封装章节数据
      video: {
        title: '',
        sort: 0,
        isFree: 0,
        videoSourceId: '',
        videoOriginalName: '' // 视频名称
      }, // 封装小节数据
      dialogChapterFormVisible: false, // 添加和修改章节表单弹框是否显示
      dialogVideoFormVisible: false, // 添加和修改小节表单弹框是否显示
      fileList: [], // 上传文件列表
      BASE_API: process.env.BASE_API // 接口API地址
    }
  },

  created() {
    // 获取路由的id值
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      // 根据课程id查询章节和小节
      this.getChapterVideo()
    }
  },

  methods: {
    // -----------------------------------章节操作-----------------------------------
    // 根据课程id获得章节、小节列表
    getChapterVideo() {
      chapter.getAllChapterVideo(this.courseId)
        .then(response => {
          this.chapterVideoList = response.data.allChapterVideo
        })
    },
    previous() {
      console.log('previous')
      this.$router.push({ path: '/course/info/' + this.courseId })
    },

    next() {
      console.log('next')
      this.$router.push({ path: '/course/publish/' + this.courseId })
    },

    // 弹出‘添加章节’的框
    openChapterDialog() {
      this.dialogChapterFormVisible = true
      // 清空数据
      this.chapter.title = ''
      this.chapter.sort = 0
    },

    // 添加章节
    addChapter() {
      // 设置课程id到chapter对象里
      this.chapter.courseId = this.courseId
      chapter.addChapter(this.chapter)
        .then(response => {
          // 关闭弹框
          this.dialogChapterFormVisible = false
          // 提示信息
          this.$message({
            type: 'success',
            message: '添加章节成功!'
          })
          // 刷新页面
          this.getChapterVideo()
        })
    },

    // 判断是添加还是修改
    saveOrUpdate() {
      // 根据有无id判断是添加还是修改
      if (!this.chapter.id) {
        this.addChapter()
      } else {
        this.updateChapter()
      }
    },

    // 弹框修改章节
    openEditChapter(chapterId) {
      // 弹框
      this.dialogChapterFormVisible = true
      // 数据回显
      chapter.getChapter(chapterId)
        .then(response => {
          this.chapter = response.data.chapter
        })
    },

    // 执行修改操作
    updateChapter() {
      chapter.updateChapter(this.chapter)
        .then(response => {
          // 关闭弹框
          this.dialogChapterFormVisible = false
          // 提示信息
          this.$message({
            type: 'success',
            message: '修改章节成功!'
          })
          // 刷新页面
          this.getChapterVideo()
        })
    },

    // 删除章节
    removeChapter(chapterId) {
      this.$confirm('此操作将永久删除章节, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return chapter.deleteChapter(chapterId)
      }).then(() => {
        this.getChapterVideo()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch((response) => { // 失败
        if (response === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        } else {
          this.$message({
            type: 'error',
            message: '删除失败'
          })
        }
      })
    },
    // -----------------------------------小节操作-----------------------------------

    // 添加小节弹框
    openVideo(chapterId) {
      this.dialogVideoFormVisible = true
      this.video = {}
      // this.video.title = '' // 重置章节标题
      // this.video.sort = 0 // 重置章节标题
      // this.video.isFree = 0 // 重置类型
      // this.video.videoSourceId = '' // 重置视频资源id
      this.video.chapterId = chapterId // 设置章节id
      this.video.courseId = this.courseId // 设置课程id
    },

    // 添加小节
    addVideo() {
      video.addVideo(this.video)
        .then(response => {
          // 关闭弹框
          this.dialogVideoFormVisible = false
          // 提示信息
          this.$message({
            type: 'success',
            message: '添加小节成功!'
          })
          // 刷新页面
          this.getChapterVideo()
        })
    },

    // 删除小节
    removeVideo(videoId) {
      this.$confirm('此操作将永久删除小节, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return video.deleteVideo(videoId)
      }).then(() => {
        this.getChapterVideo()
        this.$message({
          type: 'success',
          message: '删除小节成功!'
        })
      }).catch((response) => { // 失败
        if (response === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        } else {
          this.$message({
            type: 'error',
            message: '删除失败'
          })
        }
      })
    },

    // 修改小节
    updateVideo() {
      video.updateVideo(this.video)
        .then(response => {
          // 关闭弹框
          this.dialogVideoFormVisible = false
          // 提示信息
          this.$message({
            type: 'success',
            message: '修改小节成功!'
          })
          // 刷新页面
          this.getChapterVideo()
        })
    },

    saveOrUpdateVideo() {
      // 根据有无id判断是添加还是修改
      if (!this.video.id) {
        this.addVideo()
      } else {
        this.updateVideo()
      }
    },

    // 弹框修改小节
    openEditVideo(videoId) {
      // 弹框
      this.dialogVideoFormVisible = true
      // 数据回显
      video.getVideo(videoId)
        .then(response => {
          this.video = response.data.video
        })
    },

    // 上传视频成功调用的方法
    handleVodUploadSuccess(response, file, fileList) {
      this.video.videoSourceId = response.data.videoId
      this.video.videoOriginalName = file.name
    },
    // 上传视频之前调用的方法
    handleUploadExceed() {
      this.$message.warning('想要重新上传视频，请先删除已上传的视频')
    }
  }
}
</script>

<style scoped>
.chapterList{
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chapterList li{
  position: relative;
}
.chapterList p{
  /*float: left;*/
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chapterList .acts {
  float: right;
  font-size: 14px;
}

.videoList{
  padding-left: 50px;
}
.videoList p{
  /*float: left;*/
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}
</style>
