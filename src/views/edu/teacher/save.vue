<template>
  <div class="app-container">
    <el-form label-width="120px">

      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>

      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" :min="0" controls-position="right"/>
      </el-form-item>

      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>

      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>

      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">

        <!-- 头像缩略图 -->
        <pan-thumb :image="teacher.avatar"/>
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
        </el-button>

        <!--
    v-show：是否显示上传组件
    :key：类似于id，如果一个页面多个图片上传控件，可以做区分
    :url：后台上传的url地址
    @close：关闭上传组件
    @crop-upload-success：上传成功后的回调 -->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API+'/eduoss/fileoss'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"/>

      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>
<script>
import teacherApi from '@/api/edu/teacher'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  components: { ImageCropper, PanThumb },
  data() {
    return {
      teacher: {
        name: '',
        sort: 0,
        level: 1,
        career: '',
        intro: '',
        avatar: ''
      },
      imagecropperShow: false, // 上传头像弹框组件是否显示
      imagecropperKey: 0, // 上传组件唯一标识key值
      BASE_API: process.env.BASE_API, // 获取dev.env.js中请求地址
      saveBtnDisabled: false // 保存按钮是否禁用,
    }
  },

  watch: { // 监听，路由发生变化，方法执行
    $route(to, from) {
      // console.log('watch $route 路由发生变化')
      this.init()
    }
  },

  created() {
    this.init()
  },

  methods: {
    init() {
      // 判断路径是否有id值
      if (this.$route.params && this.$route.params.id) {
        // 从路径获取id
        const id = this.$route.params.id
        this.getInfoById(id)
      } else {
        // 清空表单
        this.resetData()
      }
    },

    // 判断是修改还是添加
    saveOrUpdate() {
      this.saveBtnDisabled = true
      if (!this.teacher.id) {
        // 新增
        this.saveData()
      } else {
        // 修改
        this.updateDate()
      }
    },

    // 修改
    updateDate() {
      teacherApi.updateTeacherInfo(this.$route.params.id, this.teacher)
        .then(response => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.$router.push({ path: '/teacher/table' })
        })
        .catch((response) => {
          // console.log(response)
          this.$message({
            type: 'error',
            message: '保存失败'
          })
        })
    },

    // 保存
    saveData() {
      teacherApi.save(this.teacher)
        .then(response => {
          return this.$message({
            type: 'success',
            message: '保存成功!'
          })
        }).then(resposne => {
          this.$router.push({ path: '/teacher/table' })
        }).catch((response) => {
          // console.log(response)
          this.$message({
            type: 'error',
            message: '保存失败'
          })
        })
    },

    // 根据id查询讲师
    getInfoById(id) {
      teacherApi.getTeacherInfoById(id)
        .then(response => {
          this.teacher = response.data.teacher
        }).catch(response => {
          this.$message({
            type: 'error',
            message: '获取数据失败'
          })
        })
    },

    // 清空
    resetData() {
      this.teacher = {}
    },

    // 关闭上传弹框
    close() {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
    },

    // 上传成功
    cropSuccess(data) {
      this.imagecropperShow = false
      // 上传成功后返回头像url地址
      this.teacher.avatar = data.url
      this.imagecropperKey = this.imagecropperKey + 1
    }
  }
}
</script>
