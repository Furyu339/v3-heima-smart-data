<script setup lang="ts"></script>

<template>
  <div class="nav-bar">
    <!-- breadcrumb -->
    <div></div>
    <!-- dropdown -->
    <el-dropdown>
      <div class="user-wrapper">黑马管理员</div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>首页</el-dropdown-item>
          <el-dropdown-item>项目地址</el-dropdown-item>
          <el-dropdown-item>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style lang="scss" scoped>
.nav-bar {
  height: 60px;
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;

  .user-wrapper {
    outline: none;
    cursor: default;
    color: var(--el-color-black);
  }
}
</style>
