<script setup lang="ts">
import {
  delRoleUserAPI,
  getRoleDetailAPI,
  getRoleListAPI,
  getRoleUserAPI,
  getTreeListAPI,
} from "@/apis/system";
import type { Role, RoleData, RoleUser } from "@/types/system";
import { ElMessageBox, ElMessage } from "element-plus";
import { ref } from "vue";

onMounted(() => {
  getRoleList();
  getTreeList();
});
// 1. 获取角色列表
const roleList = ref<Role[]>([]);
const getRoleList = async () => {
  const res = await getRoleListAPI();
  roleList.value = res.data;
  // 第一次加载
  getRoleDetail(roleList.value[0].roleId!);
  getRoleUserList(roleList.value[0].roleId!);
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
    getRoleUserList(roleId);
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
const treeRef = ref();
const perms = ref<number[]>([]); // 当前角色权限点列表
// 封装请求方法
const getRoleDetail = async (roleId: number) => {
  const res = await getRoleDetailAPI(roleId);
  perms.value = res.data.perms;
  treeRef.value.forEach(
    (tree: { setCheckedKeys: (arg0: number) => void }, index: number) => {
      tree.setCheckedKeys(perms.value[index]);
    },
  );
};
// 6. tab切换
const activeName = ref<"tree" | "member">("tree"); // 默认打开tree
// 7. 获取当前角色下的成员
const roleUserList = ref<RoleUser[]>([]);
// 封装获取当前角色下的成员的方法
const getRoleUserList = async (roleId: number) => {
  const res = await getRoleUserAPI(roleId);
  roleUserList.value = res.data.rows;
};
const router = useRouter();
const onCommand = (command: string, roldId: number) => {
  if (command === "edit") {
    router.push(`/roleAdd?id=${roldId}`);
  }
  if (command === "del") {
    ElMessageBox.confirm("是否确认删除当前角色?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(async () => {
      await delRoleUserAPI(roldId + "");
      await getRoleList();
      ElMessage({
        type: "success",
        message: "删除成功!",
      });
    });
  }
};
</script>

<template>
  <div class="role-container">
    <!-- 左侧角色列表 -->
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
          <el-dropdown @command="onCommand($event, item.roleId!)">
            <span class="el-dropdown-link">
              <img src="@/assets/more.svg" class="icon" />
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="edit">编辑角色</el-dropdown-item>
                <el-dropdown-item command="del">删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <el-button class="addBtn" size="small" @click="$router.push('/roleAdd')">
        添加角色
      </el-button>
    </div>
    <!-- 右侧权限和成员 -->
    <div class="right-wrapper">
      <el-tabs v-model="activeName">
        <el-tab-pane label="功能权限" name="tree">
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
        </el-tab-pane>
        <el-tab-pane :label="`成员(${roleUserList.length})`" name="member">
          <div class="user-wrapper">
            <el-table :data="roleUserList">
              <el-table-column type="index" width="250" label="序号" />
              <el-table-column prop="name" label="员工姓名" />
              <el-table-column prop="userName" label="登录账号" />
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
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
