<script setup lang="ts">
import {
  getRoleDetailAPI,
  getRoleListAPI,
  getTreeListAPI,
} from "@/apis/system";
import type { Role, RoleData } from "@/types/system";
import { ref } from "vue";

onMounted(() => {
  getRoleList();
  getTreeList();
});
const roleList = ref<Role[]>([]);
const getRoleList = async () => {
  const res = await getRoleListAPI();
  roleList.value = res.data;
  // 第一次加载
  getRoleDetail(roleList.value[0].roleId!);
};
// 2. 点击激活交互
const activeIndex = ref(0);
const changeRole = (idx: number) => {
  activeIndex.value = idx;
  // 获取当前角色下的权限点数据列表
  // 注意角色 id，不是索引
  const roleId = roleList.value[idx].roleId;
  if (roleId) {
    getRoleDetail(roleId);
  }
};
// 3. 获取权限列表
const treeList = ref<RoleData[]>([]);
const getTreeList = async () => {
  const res = await getTreeListAPI();
  treeList.value = res.data;
  // 禁用
  // 目标：treeList里面的每一项以及嵌套的子项都添加一个disabled = true
  addDisabled(treeList.value);
};
// 4. 递归处理函数
const addDisabled = (treeList: RoleData[]) => {
  treeList.forEach((item) => {
    item.disabled = true;
    // 递归处理
    if (item.children) {
      addDisabled(item.children);
    }
  });
};
// 5. 获取当前角色权限点
const treeRef = ref()
const perms = ref<number[]>([]); // 当前角色权限点列表
// 封装请求方法
const getRoleDetail = async (roleId: number) => {
  const res = await getRoleDetailAPI(roleId);
  perms.value = res.data.perms;
  treeRef.value.forEach((tree: { setCheckedKeys: (arg0: number) => void; }, index: number) => {
    tree.setCheckedKeys(perms.value[index])
  })
};
</script>

<template>
  <div class="role-container">
    <div class="left-wrapper">
      <div
        v-for="(item, index) in roleList"
        :key="item.roleId"
        class="role-item"
        :class="{ active: index === activeIndex }"
        @click="changeRole(index)"
      >
        <div class="role-info">
          <img src="@/assets/user.svg" class="icon" />
          <!-- <img :src="index === activeIndex ? activeUser : user" class="icon" /> -->
          {{ item.roleName }}
        </div>
        <div class="more">
          <img src="@/assets/more.svg" class="icon" />
        </div>
      </div>
      <el-button class="addBtn" size="small">添加角色</el-button>
    </div>
    <!-- 右侧权限和成员 -->
    <div class="right-wrapper">
      <div class="tree-wrapper">
        <div v-for="item in treeList" :key="item.id" class="tree-item">
          <div class="tree-title">{{ item.title }}</div>
          <el-tree
            ref="treeRef"
            :data="item.children"
            node-key="id"
            :props="{ label: 'title' }"
            show-checkbox
            check-strictly
            :default-expand-all="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.role-container {
  display: flex;
  font-size: 14px;
  background-color: #fff;

  .left-wrapper {
    width: 200px;
    border-right: 1px solid #e4e7ec;
    padding: 4px;
    text-align: center;

    .role-item {
      position: relative;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      cursor: pointer;

      &.active {
        background: #edf5ff;
        color: #4770ff;
      }
    }

    .role-info {
      display: flex;
      align-items: center;

      .icon {
        margin-right: 10px;
        width: 20px;
      }
    }

    .more {
      display: flex;
      align-items: center;
      .icon {
        width: 15px;
      }
    }

    .addBtn {
      width: 100%;
      margin-top: 20px;
    }
  }

  .right-wrapper {
    flex: 1;

    .tree-wrapper {
      display: flex;
      justify-content: space-between;

      .tree-item {
        flex: 1;
        border-right: 1px solid #e4e7ec;
        padding: 0px 4px;
        text-align: center;

        .tree-title {
          background: #f5f7fa;
          text-align: center;
          padding: 10px 0;
          margin-bottom: 12px;
        }
      }
    }

    ::v-deep .el-tabs__nav-wrap {
      padding-left: 20px;
    }

    .user-wrapper {
      padding: 20px;
    }
  }
}
</style>
