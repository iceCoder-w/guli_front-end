<template>
  <div class="app-container">

    <h2 style="text-align: center;">周报提交</h2>

    <el-form label-width="120px">

      <el-form-item label="标题">
        <el-input v-model="reportInfo.title" placeholder=" 示例：第13周周报"/>
      </el-form-item>

      <el-form-item label="成果">
        <el-input v-model="reportInfo.result" placeholder=" 示例：第13周成果"/>
      </el-form-item>

      <el-form-item label="问题">
        <tinymce :height="300" v-model="reportInfo.description"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="saveOrUpdate">提交</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import reportApi from '@/api/edu/report'
import Tinymce from '@/components/Tinymce' // 引入富文本编辑器组件
export default { // 声明组件
  name: 'Info',
  components: { Tinymce },
  data() {
    return {
      reportInfo: {
        userId: 'admin',
        userName: '管理员'
      },
      BASE_API: process.env.BASE_API, // 接口API地址
      // 回显时使用
      reportId: ''
    }
  },

  created() {
    // 获取路由id
    if (this.$route.params && this.$route.params.id) {
      this.reportId = this.$route.params.id
      // 根据课程id回显信息
      this.getReportInfo()
    } else {
      // 清空表单
      // this.resetData()
      // this.fetchData()
    }
  },

  methods: {

    saveOrUpdate() {
      // 判断是添加还是修改
      if (!this.reportId) {
        // 添加
        this.submitReport()
      } else {
        // 修改
        this.updateReport()
      }
    },

    // 提交
    submitReport() {
      reportApi.addReportInfo(this.reportInfo)
        .then(response => {
          // 提示发布成功
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
          this.$router.push({ path: '/report/mylist' })
        })
    },

    // 修改
    updateReport() {
      reportApi.updateReport(this.reportId, this.reportInfo)
        .then(response => {
          // 提示发布成功
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.$router.push({ path: '/report/mylist' })
        })
    },

    // 数据回显
    getReportInfo() {
      reportApi.getReportInfoById(this.reportId)
        .then(response => {
          this.reportInfo = response.data.report
        })
    },

    // 取消提交
    cancel() {
      this.$router.back()
    }

    // // 查询所有的讲师
    // getTeacherList() {
    //   course.getListTeacher()
    //     .then(response => {
    //       this.teacherList = response.data.items
    //     })
    // },
    // // 添加课程
    // addCourse() {
    //   course.addCourseInfo(this.courseInfo)
    //     .then(response => {
    //       // 1.提示
    //       this.$message({
    //         type: 'success',
    //         message: '添加课程信息成功'
    //       })
    //       // 2.跳转到第二步
    //       this.$router.push({ path: '/course/chapter/' + response.data.courseId })
    //     })
    // },
    // // 修改课程
    // updateCourse() {
    //   course.updateCourseInfo(this.courseInfo)
    //     .then(response => {
    //       // 1.提示
    //       this.$message({
    //         type: 'success',
    //         message: '修改课程信息成功'
    //       })
    //       // 2.跳转到第二步
    //       this.$router.push({ path: '/course/chapter/' + this.courseId })
    //     })
    // },
    // // 下一步
    // saveOrUpdate() {
    //   // 判断是添加还是修改
    //   if (!this.courseId) {
    //     // 添加
    //     this.addCourse()
    //   } else {
    //     // 修改
    //     this.updateCourse()
    //   }
    // },
    //
    // // 课程封面上传成功调用的方法
    // handleAvatarSuccess(res) {
    //   this.courseInfo.cover = res.data.url
    // },
    // // 上传之前，添加一些限制条件
    // beforeAvatarUpload(file) {
    //   const isJPG = file.type === 'image/png'
    //   const isLt2M = file.size / 1024 / 1024 < 2
    //
    //   if (!isJPG) {
    //     this.$message.error('上传头像图片只能是 PNG 格式!')
    //   }
    //   if (!isLt2M) {
    //     this.$message.error('上传头像图片大小不能超过 2MB!')
    //   }
    //   return isJPG && isLt2M
    // },
    //
    // // 回显部分，根据id查询
    // getInfo() {
    //   course.getCourseInfoById(this.courseId)
    //     .then(response => {
    //       this.courseInfo = response.data.courseInfoVo
    //       // 查询所有的分类信息
    //       subject.getSubjectList()
    //         .then(response => {
    //           this.subjectOneList = response.data.list // 一级分类
    //           // 遍历一级
    //           for (let i = 0; i < this.subjectOneList.length; i++) {
    //             const oneSubject = this.subjectOneList[i]
    //             // 比较当前courseInfo中一级分类的id和新查询的所有一级分类的id
    //             if (this.courseInfo.subjectParentId === oneSubject.id) {
    //               this.subjectTwoList = oneSubject.children
    //             }
    //           }
    //         })
    //       // 初始化所有讲师
    //       this.getTeacherList()
    //     })
    // },
    // // 清空
    // resetData() {
    //   this.courseInfo = {}
    // }
  }
}
</script>

<style scoped>
.tinymce-container {
  /*调整上传图片按钮的高度*/
  line-height: 29px;
}
</style>
