// 权限控制
import type { RouteRecordRaw } from "vue-router";
import { getProfileAPI } from "./apis/user";
import router, { asyncRoutes } from "./router";
import { getLocalToken } from "./utils/auth";
import { useUserStore } from "./stores/user";
import { useMenuStore } from "./stores/menu";

/**
 * 处理一级路由数据
 */
const getFirstRoutePerms = (permsArr: string[]) => {
  const newArr = permsArr.map((item) => {
    return item.split(":")[0];
  });
  return [...new Set(newArr)];
};

// 处理二级路由权限数据
const getSecondRoutePerms = (permsArr: string[]) => {
  const newArr = permsArr.map((item) => {
    const arr = item.split(":");
    return `${arr[0]}:${arr[1]}`;
  });
  return [...new Set(newArr)];
};
// 根据权限标识过滤路由表
const getRoutes = (
  firstRoutePerms: string[],
  secondRoutePerms: string[],
  asyncRoutes: RouteRecordRaw[],
) => {
  if (firstRoutePerms.includes("*")) {
    // 管理员（拷贝 - 防止重复登录同一个用户时，此变量值返回给外面后不断 push * 地址，导致左侧菜单 key 重复报错问题）
    return [...asyncRoutes];
  }
  // 根据一级和二级对动态路由表做过滤 return出去过滤之后的路由表
  // 1. 根据一级路由对动态路由表做过滤
  const firstRoutes = asyncRoutes.filter((route: RouteRecordRaw) => {
    return firstRoutePerms.includes(route.meta!.permission!);
  });
  console.log(firstRoutes);

  // 2. 对二级路由做过滤
  const lastRoutes = firstRoutes.map((item: RouteRecordRaw) => {
    return {
      ...item,
      children: item!.children!.filter((obj) =>
        secondRoutePerms.includes(obj.meta!.permission!),
      ),
    };
  });
  return lastRoutes;
};
const WHITE_LIST = ["/login", "/404"];
router.beforeEach(async (to, from, next) => {
  const token = getLocalToken();
  // 有token
  if (token) {
    next();
    const store = useUserStore();
    if (!store.profile.id) {
      const res = await getProfileAPI();
      store.setProfile(res.data);
      const firstRoutePerms = getFirstRoutePerms(res.data.permissions);
      const secondRoutePerms = getSecondRoutePerms(res.data.permissions);
      const perRoutes = getRoutes(
        firstRoutePerms,
        secondRoutePerms,
        asyncRoutes,
      );
      // 4. 把动态路由表加入到路由系统中（当浏览器中访问路由的路径 显示渲染出来对应的组件）
      perRoutes.push(
        // 404 地址配置为*=》匹配不存在的地址，放到过滤动态路由规则后边
        {
          path: "/:pathMatch(.*)*",
          component: () => import("@/views/NotFound.vue"),
          meta: { hidden: true },
          children: [],
        },
      );
      perRoutes.forEach((route) => {
        router.addRoute(route);
      });
      // 5. 存入Pinia渲染左侧菜单
      const menuStore = useMenuStore();
      menuStore.setMenuList(perRoutes);
      next({ ...to });
    }
  } else {
    // 没有token
    if (WHITE_LIST.includes(to.path)) {
      next();
    } else {
      next("/login");
    }
  }
});
