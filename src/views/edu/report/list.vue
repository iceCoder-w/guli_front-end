<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="searchObj.name" placeholder="用户名"/>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="searchObj.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchObj.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row>

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          <!--渲染得到1、2、3、4、5...-->
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="userName" label="用户名" width="100" />
      <el-table-column prop="title" label="标题" width="80" />
      <el-table-column prop="result" label="结果" width="80" />
      <el-table-column type="String" prop="description" label="详细内容" >
        <template slot-scope="scope">
          <p v-html="scope.row.description"/>
        </template>
      </el-table-column>

      <el-table-column prop="gmtCreate" label="添加时间" width="160"/>

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="fetchData"
    /><!--每次点击按钮自动调方法，会传参page，在下面方法里改造-->

  </div>
</template>
<script>
// 引入调用teacher.js文件
import teacherApi from '@/api/edu/teacher'
import reportApi from '@/api/edu/report'

export default {
  // 定义变量和初始值
  data() {
    return {
      listLoading: true, // 是否显示loading信息
      list: null, // 数据列表
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 5, // 每页记录数
      searchObj: {}// 查询条件
    }
  },

  // 页面渲染之前执行，一般是调用methods定义的方法
  created() {
    this.fetchData()
  },
  methods: {
    // 调用api层获取数据库中的数据
    fetchData(page = 1) {
      // 针对分页单独改造，增加 page = 1，因为elementUI的分页会自动传参page
      this.page = page
      this.listLoading = true
      reportApi.getListReport(this.page, this.limit, this.searchObj).then(response => {
        if (response.success === true) {
          this.list = response.data.items
          this.total = response.data.totalPage
        }
        this.listLoading = false
      })
    },

    // 清空条件查询信息，重新查询全部
    resetData() {
      this.searchObj = {}
      this.fetchData()
    },

    // 删除讲师
    removeDataById(id) {
      // debugger
      // console.log(memberId)
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return teacherApi.removeById(id)
      }).then(() => {
        this.fetchData()
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
    }
  }
}
</script>
