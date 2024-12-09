<script setup lang="ts">
import { createRoleUserAPI } from "@/apis/enterprise";
import { getRoleDetailAPI, getTreeListAPI, updateRoleAPI } from "@/apis/system";
import type { RoleData, RoleParams } from "@/types/system";
import { ElTree, ElMessage } from "element-plus";
import { ref } from "vue";

// 0. 编辑缓存roleId
const route = useRoute();
const roldId = computed(() => {
  return route.query.id as string;
});

onMounted(() => {
  getTreeList();
  if (roldId.value) {
    editRoleDetail();
  }
});

const editRoleDetail = async () => {
  const res = await getRoleDetailAPI(Number(roldId.value));
  const { perms, remark, roleId, roleName } = res.data;
  // 回填基础表单
  //@ts-ignore
  roleForm.value = { perms, remark, roleId, roleName };
  // 回填Tree
  treeRef.value!.forEach((tree, index) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    tree.setCheckedKeys(roleForm.value.perms[index]);
  });
};
const router = useRouter();
const confirmAdd = async () => {
  if (roldId.value) {
    await updateRoleAPI(roleForm.value as RoleParams);
  } else {
    // 添加
    await createRoleUserAPI(roleForm.value as RoleParams);
  }

  ElMessage({
    type: "success",
    message: `${roldId.value ? "编辑" : "新增"}角色成功`,
  });
  router.back();
};
const activeStep = ref(0);

// 上一步按钮逻辑
const decreseStep = () => {
  if (activeStep.value === 0) return;
  activeStep.value--;

  addAbled(treeList.value);
};

// 树控件的引用
const treeRef = ref<InstanceType<typeof ElTree>[]>();
const diabledTreeRef = ref<InstanceType<typeof ElTree>[]>();

// 下一步按钮逻辑
const increseStep = () => {
  if (activeStep.value === 2) return;

  if (activeStep.value === 0) {
    // 第一步：角色信息状态，进行表单校验
    roleFormRef.value.validate((valid: boolean) => {
      if (valid) {
        activeStep.value++; // 校验通过，进入下一步
      }
    });
  } else if (activeStep.value === 1) {
    // 第二步：权限信息状态，重置并收集选中权限
    roleForm.value.perms = [];
    treeRef.value?.forEach((tree) => {
      roleForm.value.perms.push(tree.getCheckedKeys()); // 获取选中的权限
    });

    // 检查是否选中权限
    if (roleForm.value.perms.flat().length === 0) {
      ElMessage({
        type: "error",
        message: "请至少选择一个权限点",
      });
    } else {
      activeStep.value++; // 进入第三步

      // 禁用权限树
      addDisabled(treeList.value);

      // 回填选中数据到只读权限树
      diabledTreeRef.value?.forEach((tree, index) => {
        // @ts-ignore
        tree.setCheckedKeys(roleForm.value.perms[index]);
      });
    }
  }
};

// 权限树数据结构
const treeList = ref<RoleData[]>([]);

// 添加禁用属性到权限树的每个节点
const addDisabled = (treeList: RoleData[]) => {
  treeList.forEach((item) => {
    item.disabled = true; // 禁用当前节点
    if (item.children) {
      addDisabled(item.children); // 递归禁用子节点
    }
  });
};

// 添加禁用属性到权限树的每个节点
const addAbled = (treeList: RoleData[]) => {
  treeList.forEach((item) => {
    item.disabled = false; // 禁用当前节点
    if (item.children) {
      addAbled(item.children); // 递归禁用子节点
    }
  });
};

// 获取权限树列表
const getTreeList = async () => {
  const res = await getTreeListAPI();
  treeList.value = res.data;
};

// 角色表单数据和校验规则
const roleForm = ref<{
  roleName: string;
  remark: string;
  perms: object[];
}>({
  roleName: "",
  remark: "",
  perms: [], // 初始化为空
});

const roleRules = ref({
  roleName: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
});

const roleFormRef = ref();
</script>

<template>
  <div class="add-role">
    <header class="add-header">
      <el-page-header content="添加角色" @back="$router.back()" />
    </header>
    <main class="add-main">
      <div class="step-container">
        <el-steps direction="vertical" :active="activeStep">
          <el-step title="角色信息" />
          <el-step title="权限信息" />
          <el-step title="检查并完成" />
        </el-steps>
      </div>
      <div v-show="activeStep === 0" class="form-container">
        <div class="title">角色信息</div>
        <div class="form">
          <el-form
            ref="roleFormRef"
            class="form-box"
            :model="roleForm"
            :rules="roleRules"
          >
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="roleForm.roleName" />
            </el-form-item>
            <el-form-item label="角色描述">
              <el-input v-model="roleForm.remark" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div v-show="activeStep === 1" class="form-container">
        <div class="title">权限配置</div>
        <div class="form">
          <div class="tree-wrapper">
            <div v-for="item in treeList" :key="item.id" class="tree-item">
              <div class="tree-title">{{ item.title }}</div>
              <el-tree
                ref="treeRef"
                :data="item.children"
                show-checkbox
                default-expand-all
                node-key="id"
                highlight-current
                :props="{ label: 'title' }"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-show="activeStep === 2" class="form-container">
        <div class="title">检查并完成</div>
        <div class="form">
          <div class="info">
            <div class="form-item">角色名称：{{ roleForm.roleName }}</div>
            <div class="form-item">角色描述：{{ roleForm.remark }}</div>
            <div class="form-item">角色权限：</div>
            <div class="tree-wrapper">
              <div v-for="item in treeList" :key="item.id" class="tree-item">
                <div class="tree-title">{{ item.title }}</div>
                <el-tree
                  ref="diabledTreeRef"
                  :data="item.children"
                  show-checkbox
                  default-expand-all
                  node-key="id"
                  :highlight-current="false"
                  :props="{ label: 'title', disabled: () => true }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button v-if="activeStep > 0" @click="decreseStep">上一步</el-button>
        <el-button v-if="activeStep < 2" type="primary" @click="increseStep"
          >下一步</el-button
        >
        <el-button v-if="activeStep === 2" type="primary" @click="confirmAdd">{{
          roldId ? "确认修改" : "确认添加"
        }}</el-button>
        >
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.add-role {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: 64px;
    line-height: 64px;
    font-size: 16px;
    font-weight: bold;
    background-color: #fff;

    .left {
      span {
        margin-right: 4px;
      }

      .arrow {
        cursor: pointer;
      }
    }

    .right {
      text-align: right;
    }
  }

  .add-main {
    position: fixed;
    top: 64px;
    bottom: 88px;
    width: 100%;
    overflow-y: auto;
    background: #f4f6f8;
    padding: 20px 230px;
    display: flex;

    .step-container {
      height: 400px;
      width: 200px;
    }

    .form-container {
      flex: 1;
      background-color: #fff;
      overflow-y: auto;

      .title {
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
      }

      .form {
        margin-bottom: 20px;
        padding: 20px 65px 24px;

        .el-form {
          display: flex;
          flex-wrap: wrap;
        }

        .info {
          font-size: 14px;
          color: #666;

          .form-item {
            margin-bottom: 20px;
          }
        }
      }

      .form-box {
        width: 600px;
        display: flex;
        flex-direction: column;
      }
    }
  }

  .add-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 24px 50px;
    color: #000000d9;
    font-size: 14px;
    background: #fff;
    text-align: center;
    z-index: 10001;
  }

  .tree-wrapper {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .tree-item {
      flex: 1;
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
}
</style>
