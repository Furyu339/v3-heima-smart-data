<script setup lang="ts">
import { ref, type PropType } from "vue";
import type { RouteRecordRaw } from "vue-router";
import path from "path-browserify";

const props = defineProps({
  item: {
    type: Object as PropType<RouteRecordRaw>,
  },
  basePath: {
    type: String,
    default: "",
  },
});

const onlyOneChild = ref<RouteRecordRaw>();

function hasOneShowingChild(
  children: RouteRecordRaw[] = [],
  parent: RouteRecordRaw,
) {
  const showingChildren = children.filter((item) => {
    if (item.meta?.hidden) {
      return false;
    } else {
      onlyOneChild.value = item;
      return true;
    }
  });

  if (showingChildren.length === 1) {
    return true;
  }

  if (showingChildren.length === 0) {
    const newChild = { ...parent, path: "" };
    if (newChild.meta) {
      newChild.meta.noShowingChildren = true;
    }
    onlyOneChild.value = newChild;
    return true;
  }
  return false;
}

function resolvePath(routePath: string) {
  const httpReg = /^http(s?):\/\//;
  if (httpReg.test(routePath) || httpReg.test(props.basePath)) {
    return routePath || props.basePath;
  } else {
    // 使用path.posix.resolve替代path.resolve 避免windows环境下使用electron出现盘符问题
    return path.posix.resolve(props.basePath, routePath);
  }
}

import.meta.glob("@/assets/menu/*.{png,jpg}", { eager: true });
const getIcon = (name: string) => {
  return new URL(`/src/assets/menu/${name}.png`, import.meta.url).href;
};
</script>

<template>
  <template v-if="!item?.meta?.hidden">
    <el-menu-item
      v-if="
        hasOneShowingChild(item?.children, item!) &&
        (!onlyOneChild?.children || onlyOneChild.meta?.noShowingChildren)
      "
      :index="resolvePath(onlyOneChild!.path)"
    >
      <img
        v-if="onlyOneChild?.meta?.icon"
        :src="
          getIcon(
            onlyOneChild.meta.icon +
              ($route.path === resolvePath(onlyOneChild!.path)
                ? '-active'
                : ''),
          )
        "
        style="width: 18px; padding-right: 6px"
      />
      <span>{{ onlyOneChild?.meta?.title }}</span>
    </el-menu-item>
    <el-sub-menu v-else :index="resolvePath(item!.path)">
      <template #title>
        <img
          :src="
            getIcon(
              item?.meta?.icon +
                ($route.path.startsWith(resolvePath(item!.path) + '/')
                  ? '-active'
                  : ''),
            )
          "
          style="width: 18px; padding-right: 6px"
        />
        <span
          :class="{
            'active-text': $route.path.startsWith(
              resolvePath(item!.path) + '/',
            ),
          }"
          >{{ item?.meta?.title }}</span
        >
      </template>
      <SliderBarItem
        v-for="child in item?.children"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(child.path)"
      />
    </el-sub-menu>
  </template>
</template>

<style lang="scss" scoped>
.active-text {
  color: var(--el-color-primary);
}
</style>
