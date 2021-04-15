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

      <!-- 讲师头像：TODO -->

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>
<script>
import teacherApi from '@/api/edu/teacher'
export default {
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
      saveBtnDisabled: false // 保存按钮是否禁用,
    }
  },

  created() { // 页面渲染之前执行
    // 判断路径是否有id值
    if (this.$route.params && this.$route.params.id) {
      // 从路径获取id
      const id = this.$route.params.id
      this.getInfoById(id)
    }
  },

  methods: {
    saveOrUpdate() {
      this.saveBtnDisabled = true
      // 判断是修改还是添加
      if (!this.teacher.id) {
        this.saveData()
      } else {
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
    }
  }
}
</script>
