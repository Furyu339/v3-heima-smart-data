import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

import MainLayout from "@/layouts/MainLayout.vue";

export const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    component: () => import("@/views/login/LoginPage.vue"),
    meta: { hidden: true },
  },
  {
    path: "/",
    redirect: "/workbench",
    meta: { hidden: true },
  },
  {
    path: "/workbench",
    component: MainLayout,
    children: [
      {
        path: "",
        component: () => import("@/views/workbench/WorkbenchPage.vue"),
        meta: { title: "工作台", icon: "workbench" },
      },
    ],
  },
  // 新增月卡管理页
  {
    path: "/cardAdd",
    component: () => import("@/views/car/AddCard.vue"),
    meta: { hidden: true },
  },
  {
    path: "/exterpriseAdd",
    component: () => import("@/views/park/AddEnterprise.vue"),
    meta: { hidden: true },
  },
  {
    path: "/exterpriseDetail",
    component: () => import("@/views/park/EnterpriseDetail.vue"),
    meta: { hidden: true },
  },
  {
    path: "/roleAdd",
    component: () => import("@/views/system/AddRole.vue"),
    meta: { hidden: true },
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/NotFound.vue"),
    meta: { hidden: true },
  },
];
export const asyncRoutes: RouteRecordRaw[] = [
  {
    name: "park",
    path: "/park",
    component: MainLayout,
    meta: {
      title: "园区管理",
      icon: "park",
      permission: "park",
    },
    children: [
      {
        name: "building",
        path: "building",
        meta: { title: "楼宇管理", permission: "park:building" },
        component: () => import("@/views/park/ParkBuilding.vue"),
      },
      {
        name: "enterprise",
        path: "enterprise",
        meta: { title: "企业管理", permission: "park:enterprise" },
        component: () => import("@/views/park/ParkEnterprise.vue"),
      },
    ],
  },
  {
    name: "parking",
    path: "/parking",
    component: MainLayout,
    meta: { title: "行车管理", icon: "car", permission: "parking" },
    children: [
      {
        name: "area",
        path: "area",
        component: () => import("@/views/car/CarArea.vue"),
        meta: { title: "区域管理", permission: "parking:area" },
      },
      {
        name: "card",
        path: "card",
        component: () => import("@/views/car/CarCard.vue"),
        meta: { title: "月卡管理", permission: "parking:card" },
      },
      {
        name: "pay",
        path: "pay",
        component: () => import("@/views/car/CarPay.vue"),
        meta: { title: "停车缴费管理", permission: "parking:payment" },
      },
      {
        name: "rule",
        path: "rule",
        component: () => import("@/views/car/CarRule.vue"),
        meta: { title: "计费规则管理", permission: "parking:rule" },
      },
    ],
  },
  {
    name: "propety",
    path: "/propety",
    component: MainLayout,
    meta: { permission: "property", title: "物业费管理", icon: "property" },
    children: [
      {
        name: "cost",
        path: "cost",
        component: () => import("@/views/property/PropertyPage.vue"),
        meta: {
          title: "物业费管理",
          icon: "property",
          permission: "property:propertyFee",
        },
      },
    ],
  },
  {
    name: "pole",
    path: "/pole",
    component: MainLayout,
    meta: {
      title: "一体杆管理",
      icon: "rod",
      permission: "pole",
    },
    children: [
      {
        name: "info",
        path: "info",
        component: () => import("@/views/rod/RodManage.vue"),
        meta: { title: "一体杆管理", permission: "pole:info" },
      },
      {
        name: "waring",
        path: "waring",
        component: () => import("@/views/rod/RodWarn.vue"),
        meta: { title: "告警记录", permission: "pole:warning" },
      },
    ],
  },
  {
    name: "sys",
    path: "/sys",
    component: MainLayout,
    meta: { title: "系统管理", icon: "system", permission: "sys" },
    children: [
      {
        name: "role",
        path: "role",
        component: () => import("@/views/system/SystemRole.vue"),
        meta: { title: "角色管理", permission: "sys:role" },
      },
      {
        name: "user",
        path: "user",
        component: () => import("@/views/system/SystemEmployee.vue"),
        meta: { title: "员工管理", permission: "sys:user" },
      },
    ],
  },
];

/** 重置路由 */
export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name } = route;
    if (name && router.hasRoute(name)) {
      router.removeRoute(name);
    }
  });
}
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes,
});

export default router;
