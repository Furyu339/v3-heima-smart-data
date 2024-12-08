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
  {
    path: "/park",
    component: MainLayout,
    meta: {
      title: "园区管理",
      icon: "park",
      permission: "park",
    },
    children: [
      {
        path: "building",
        meta: { title: "楼宇管理", permission: "park:building" },
        component: () => import("@/views/park/ParkBuilding.vue"),
      },
      {
        path: "enterprise",
        meta: { title: "企业管理", permission: "park:enterprise" },
        component: () => import("@/views/park/ParkEnterprise.vue"),
      },
      {
        path: "/exterpriseAdd",
        component: () => import("@/views/park/AddEnterprise.vue"),
        meta: { hidden: true },
      },
    ],
  },

  {
    path: "/parking",
    component: MainLayout,
    meta: { title: "行车管理", icon: "car", permission: "parking" },
    children: [
      {
        path: "area",
        component: () => import("@/views/car/CarArea.vue"),
        meta: { title: "区域管理", permission: "parking:area" },
      },
      {
        path: "card",
        component: () => import("@/views/car/CarCard.vue"),
        meta: { title: "月卡管理", permission: "parking:card" },
      },
      // 新增月卡管理页
      {
        path: "/cardAdd",
        component: () => import("@/views/car/AddCard.vue"),
        meta: { hidden: true },
      },
      {
        path: "pay",
        component: () => import("@/views/car/CarPay.vue"),
        meta: { title: "停车缴费管理", permission: "parking:payment" },
      },
      {
        path: "rule",
        component: () => import("@/views/car/CarRule.vue"),
        meta: { title: "计费规则管理", permission: "parking:rule" },
      },
    ],
  },
  {
    path: "/propety",
    component: MainLayout,
    children: [
      {
        path: "cost",
        component: () => import("@/views/property/PropertyPage.vue"),
        meta: { title: "物业费管理", icon: "property" },
      },
    ],
  },
  {
    path: "/pole",
    component: MainLayout,
    meta: {
      title: "一体杆管理",
      icon: "rod",
      permission: "pole",
    },
    children: [
      {
        path: "info",
        component: () => import("@/views/rod/RodManage.vue"),
        meta: { title: "一体杆管理", permission: "pole:info" },
      },
      {
        path: "waring",
        component: () => import("@/views/rod/RodWarn.vue"),
        meta: { title: "告警记录", permission: "pole:warning" },
      },
    ],
  },
  {
    path: "/sys",
    component: MainLayout,
    meta: { title: "系统管理", icon: "system", permission: "sys" },
    children: [
      {
        path: "role",
        component: () => import("@/views/system/SystemRole.vue"),
        meta: { title: "角色管理", permission: "sys:role" },
      },
      {
        path: "user",
        component: () => import("@/views/system/SystemEmployee.vue"),
        meta: { title: "员工管理", permission: "sys:user" },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/NotFound.vue"),
    meta: { hidden: true },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes,
});

export default router;
