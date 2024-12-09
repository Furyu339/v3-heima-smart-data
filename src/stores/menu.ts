import { resetRouter, routes } from "@/router";
import type { RouteRecordRaw } from "vue-router";

export const useMenuStore = defineStore("hm-menu", () => {
  const menuList = ref<RouteRecordRaw[]>([...routes]);
  const setMenuList = (filterRoutes: RouteRecordRaw[]) => {
    menuList.value = [...menuList.value, ...filterRoutes];
  };
  const resetMenu = () => {
    // 重置左侧菜单
    menuList.value = [...routes];
    // 重置路由系统
    resetRouter();
  };
  return { menuList, setMenuList, resetMenu };
});
