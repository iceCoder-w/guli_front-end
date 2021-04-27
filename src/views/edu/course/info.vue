<template>
  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>

    <el-form label-width="120px">

      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <!-- 所属分类 -->
      <el-form-item label="课程分类">
        <!-- 一级分类 -->
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="一级分类"
          @change="subjectLevelOneChanged"> <!-- @change多选一改变，就会触发 -->
          <el-option
            v-for="subject in subjectOneList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
        <!-- 二级分类 -->
        <el-select
          v-model="courseInfo.subjectId"
          placeholder="二级分类">
          <el-option
            v-for="subject in subjectTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
      </el-form-item>

      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <!-- 课程简介 -->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description"/>
      </el-form-item>

      <!-- 课程封面 -->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/eduoss/fileoss'"
          class="avatar-uploader">
          <img :src="courseInfo.cover">
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import course from '@/api/edu/course'
import subject from '@/api/edu/subject'
import Tinymce from '@/components/Tinymce' // 引入富文本编辑器组件
export default { // 声明组件
  name: 'Info',
  components: { Tinymce },
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseInfo: {
        title: '',
        subjectParentId: '', // 一级分类
        subjectId: '', // 二级分类
        teacherId: '',
        lessonNum: 0,
        description: '',
        cover: '/static/01.png',
        price: 0
      }, // 课程基本信息对象，用于数据封装
      teacherList: [], // 封装所有讲师的数据
      subjectOneList: [], // 一级分类
      subjectTwoList: [], // 二级分类
      BASE_API: process.env.BASE_API, // 接口API地址
      // 回显时使用
      courseId: ''
    }
  },

  created() {
    // 获取路由id
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      // 根据课程id回显信息
      this.getInfo()
    } else {
      // 清空表单
      // this.resetData()
      // 初始化所有讲师
      this.getTeacherList()
      // 初始化所有一级分类
      this.getOneSubject()
    }
  },

  methods: {
    // 查询所有的讲师
    getTeacherList() {
      course.getListTeacher()
        .then(response => {
          this.teacherList = response.data.items
        })
    },
    // 添加课程
    addCourse() {
      course.addCourseInfo(this.courseInfo)
        .then(response => {
          // 1.提示
          this.$message({
            type: 'success',
            message: '添加课程信息成功'
          })
          // 2.跳转到第二步
          this.$router.push({ path: '/course/chapter/' + response.data.courseId })
        })
    },
    // 修改课程
    updateCourse() {
      course.updateCourseInfo(this.courseInfo)
        .then(response => {
          // 1.提示
          this.$message({
            type: 'success',
            message: '修改课程信息成功'
          })
          // 2.跳转到第二步
          this.$router.push({ path: '/course/chapter/' + this.courseId })
        })
    },
    // 下一步
    saveOrUpdate() {
      // 判断是添加还是修改
      if (!this.courseId) {
        // 添加
        this.addCourse()
      } else {
        // 修改
        this.updateCourse()
      }
    },

    // 查询所有课程的一级分类
    getOneSubject() {
      subject.getSubjectList()
        .then(response => {
          this.subjectOneList = response.data.list
        })
    },
    // 点击某个一级分类，触发change，显示对应的二级分类
    subjectLevelOneChanged(value) { // value是一级分类的id值（自带，不用在上面的函数里单独指定）
      for (let i = 0; i < this.subjectOneList.length; i++) {
        if (this.subjectOneList[i].id === value) {
          this.subjectTwoList = this.subjectOneList[i].children
          this.courseInfo.subjectId = '' // 每次选完一级，清空一下二级（多次选择一级时，会有上次遗留的二级内容，不美观）
        }
      }
    },

    // 课程封面上传成功调用的方法
    handleAvatarSuccess(res) {
      this.courseInfo.cover = res.data.url
    },
    // 上传之前，添加一些限制条件
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },

    // 回显部分，根据id查询
    getInfo() {
      course.getCourseInfoById(this.courseId)
        .then(response => {
          this.courseInfo = response.data.courseInfoVo
          // 查询所有的分类信息
          subject.getSubjectList()
            .then(response => {
              this.subjectOneList = response.data.list // 一级分类
              // 遍历一级
              for (let i = 0; i < this.subjectOneList.length; i++) {
                const oneSubject = this.subjectOneList[i]
                // 比较当前courseInfo中一级分类的id和新查询的所有一级分类的id
                if (this.courseInfo.subjectParentId === oneSubject.id) {
                  this.subjectTwoList = oneSubject.children
                }
              }
            })
          // 初始化所有讲师
          this.getTeacherList()
        })
    },
    // 清空
    resetData() {
      this.courseInfo = {}
    }
  }
}
</script>

<style scoped>
.tinymce-container {
  /*调整上传图片按钮的高度*/
  line-height: 29px;
}
</style>
