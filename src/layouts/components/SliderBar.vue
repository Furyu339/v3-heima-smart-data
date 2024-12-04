<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SliderBarItem from './SliderBarItem.vue'

const route = useRoute()
const defaultActive = computed(() => {
  return route.meta.activePath ? route.meta.activePath : route.path
})

const router = useRouter()
const routes = computed(() => {
  return router.options.routes
})
</script>

<template>
  <div class="slider-bar">
    <div class="logo"></div>
    <el-scrollbar>
      <el-menu :default-active="defaultActive" router style="border: none">
        <!-- 菜单中的每一项 -->
        <SliderBarItem
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.slider-bar {
  .logo {
    height: 60px;
    background: #fff url('@/assets/hmzs-logo.png') no-repeat center / contain;
  }
  :deep(.el-menu-item.is-active) {
    background-color: var(--el-menu-hover-bg-color);
  }
  :deep(.el-menu-item:not(.is-active)) {
    &:hover {
      background-color: #fff !important;
      color: var(--el-color-primary);
    }
  }
  :deep(.el-sub-menu__title) {
    &:hover {
      background-color: #fff !important;
      color: var(--el-color-primary);
    }
  }
}
</style>
