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
        <el-input v-model="courseInfo.description" placeholder=" 示例：机器学习是一门多领域交叉学科，专门研究计算机怎样模拟或实现人类的学习行为。"/>
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
export default {
  name: 'Info',
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
      BASE_API: process.env.BASE_API // 接口API地址
    }
  },

  created() {
    // 初始化所有讲师
    this.getTeacherList()
    // 初始化所有一级分类
    this.getOneSubject()
  },

  methods: {
    // 查询所有的讲师
    getTeacherList() {
      course.getListTeacher()
        .then(response => {
          this.teacherList = response.data.items
        })
    },
    // 下一步
    saveOrUpdate() {
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
    }
  }
}
</script>

<style scoped>

</style>
