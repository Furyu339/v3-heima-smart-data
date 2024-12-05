<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';


const store = useUserStore();
const router = useRouter();


const handleCommand = (command:string) =>{
  if (command === 'logout') {
    ElMessageBox.confirm('确定要退出登录吗？', '确认退出', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    })
      .then(() => {
        // 用户点击确定，执行退出登录逻辑
        store.clearUserInfo()
        router.replace('/login')
      })
      .catch(() => {
        // 用户点击取消
        console.log('用户取消退出登录');
      });
  }
}



</script>

<template>
  <div class="nav-bar">
    <!-- breadcrumb -->
    <div></div>
    <!-- dropdown -->
    <el-dropdown @command="handleCommand">
      <div class="user-wrapper">黑马管理员</div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="home">首页</el-dropdown-item>
          <el-dropdown-item command="link">项目地址</el-dropdown-item>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
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
