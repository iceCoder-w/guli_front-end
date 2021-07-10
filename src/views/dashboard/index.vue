<template>
  <div class="dashboard-container">
    <el-card class="box-card" style="width: 400px">
      <div slot="header" class="clearfix">
        <span>至诚周报管理系统</span>
        <br>
        <router-link :to="'/report/info/'">
          <el-button type="text">写一篇周报</el-button>
        </router-link>
      </div>
      <div class="dashboard-text">用户名:{{ name }}</div>
      <!--      <div class="dashboard-text">用户昵称:{{ nick }}</div>-->
      <div class="dashboard-text">用户角色:<span v-for="role in roles" :key="role">{{ role }}</span></div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles',
      'nick'
    ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
