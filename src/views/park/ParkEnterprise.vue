<script lang="ts" setup>

// 导入需要的API方法和类型，以及Element Plus的组件和类型
import {
  delEnterpriseAPI, // 删除企业API
  getEnterpriseDetailAPI, // 获取企业详情API
  getEnterpriseListAPI, // 获取企业列表API
  getRentBuildListAPI, // 获取楼宇列表API
} from "@/apis/enterprise";

import type { Enterprise, EnterpriseListParams } from "@/types/enterprise"; // 导入类型定义

import { ElMessageBox, ElMessage, type FormRules } from "element-plus"; // Element Plus的消息提示组件及表单验证规则类型

// 定义是否显示添加合同弹框的状态
const rentDialogVisible = ref(false); 

// 定义加载状态
const loading = ref(false);

// 定义企业列表的总数
const total = ref(0);

// 打开添加合同弹框的方法
const addRent = async () => {
  rentDialogVisible.value = true; // 显示弹框
  const res = await getRentBuildListAPI(); // 调用API获取楼宇列表
  buildList.value = res.data; // 更新楼宇列表
};

// 关闭添加合同弹框的方法
const closeDialog = () => {
  rentDialogVisible.value = false; // 隐藏弹框
};

// 楼宇列表数据
const buildList = ref<{ id: string; name: string }[]>([]);

// 租赁合同表单数据
const rentForm = ref({
  buildingId: undefined, // 楼宇ID
  contractId: undefined, // 合同ID
  contractUrl: "", // 合同URL
  enterpriseId: undefined, // 企业ID
  type: 0, // 合同类型
  rentTime: [], // 租赁时间范围
});

// 合同表单的验证规则
const rentRules = ref<FormRules>({
  buildingId: [{ required: true, message: "请选择楼宇", trigger: "change" }], // 楼宇必填
  rentTime: [{ required: true, message: "请选择租赁日期", trigger: "change" }], // 租赁时间必填
  contractId: [{ required: true, message: "请上传合同文件" }], // 合同文件必填
});

// 企业列表数据
const exterpriseList = ref<Enterprise[]>([]);

// 查询参数
const params = ref<EnterpriseListParams>({
  page: 1, // 当前页码
  pageSize: 10, // 每页显示条数
  name: "", // 企业名称（用于搜索）
});

// 组件加载时调用获取企业列表的方法
onMounted(() => {
  getExterpriseList(); // 获取企业列表
});

// 路由对象，用于重定向页面
const router = useRouter();

// 跳转到编辑企业页面的方法
const editRent = (id: string) => {
  router.push({
    path: "/exterpriseAdd", // 路径
    query: {
      id, // 企业ID
    },
  });
};

// 删除企业的方法
const delExterprise = (id: string) => {
  // 弹出确认框
  ElMessageBox.confirm("确认删除该企业吗?", "提示", {
    confirmButtonText: "确定", // 确认按钮文本
    cancelButtonText: "取消", // 取消按钮文本
    type: "warning", // 类型：警告
  }).then(async () => {
    await delEnterpriseAPI(id); // 调用删除API
    getExterpriseList(); // 重新获取企业列表
    ElMessage({
      type: "success", // 通知类型：成功
      message: "删除成功!", // 提示信息
    });
  });
};

// 搜索企业的方法
const doSearch = () => {
  params.value.page = 1; // 重置页码为1
  getExterpriseList(); // 调用获取企业列表的方法
};

// 获取企业列表的方法
const getExterpriseList = async () => {
  loading.value = true; // 显示加载状态
  const res = await getEnterpriseListAPI(params.value); // 调用API获取企业列表
  exterpriseList.value = res.data?.rows; // 更新企业列表数据
  total.value = res.data?.total; // 更新总数
  loading.value = false; // 隐藏加载状态
};

// 分页切换时调用的方法
const pageChange = (page: number) => {
  params.value.page = page; // 更新当前页码
  getExterpriseList(); // 重新获取企业列表
};

</script>

<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <!-- 企业名称 -->
      <div class="search-label">企业名称：</div>
      <el-input
        v-model="params.name" 
        clearable 
        placeholder="请输入企业名称" 
        class="search-main" 
        @clear="doSearch" 
      />
      <el-button type="primary" @click="doSearch">查询</el-button>
    </div>

    <!-- 添加企业按钮 -->
    <div class="create-container">
      <el-button type="primary" @click="$router.push('/exterpriseAdd')">添加企业</el-button>
    </div>

    <!-- 表格区域 -->
    <div class="table" v-loading="loading">
      <el-table style="width: 100%" :data="exterpriseList">
        <!-- 序号列 -->
        <el-table-column align="center" type="index" label="序号" width="120" />
        <!-- 企业名称列 -->
        <el-table-column align="center" label="企业名称" width="320" prop="name" />
        <!-- 联系人列 -->
        <el-table-column align="center" label="联系人" prop="contact" />
        <!-- 联系电话列 -->
        <el-table-column align="center" label="联系电话" prop="contactNumber" />
        <!-- 操作列 -->
        <el-table-column align="center" label="操作" width="350">
          <template #default="{ row: { id } }">
            <el-button size="small" type="text" @click="addRent()">添加合同</el-button>
            <el-button size="small" type="text">查看</el-button>
            <el-button size="small" type="text" @click="editRent(id)">编辑</el-button>
            <el-button size="small" type="text" @click="delExterprise(id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="page-container" style="float: right">
      <el-pagination
        layout="total, prev, pager, next"
        :total="total"
        :page-size="params.pageSize"
        @current-change="pageChange"
      />
    </div>

    <!-- 添加合同弹框 -->
    <el-dialog
      title="添加合同"
      v-model="rentDialogVisible"
      width="580px"
      @close="closeDialog"
    >
      <!-- 表单区域 -->
      <div class="form-container">
        <el-form
          ref="addForm"
          :model="rentForm"
          :rules="rentRules"
          label-position="top"
        >
          <!-- 楼宇选择 -->
          <el-form-item label="租赁楼宇" prop="buildingId">
            <el-select v-model="rentForm.buildingId" placeholder="请选择">
              <el-option
                v-for="item in buildList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <!-- 租赁日期 -->
          <el-form-item label="租赁起止日期" prop="rentTime">
            <el-date-picker
              v-model="rentForm.rentTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>

          <!-- 上传合同文件 -->
          <el-form-item label="租赁合同" prop="contractId">
            <el-upload action="#">
              <el-button size="small" type="primary" plain>上传合同文件</el-button>
              <div slot="tip" class="el-upload__tip">
                支持扩展名：.doc .pdf, 文件大小不超过5M
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>

      <!-- 弹框底部操作按钮 -->
      <template #footer>
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" type="primary">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
/* 容器样式 */
.building-container {
  padding: 20px;
}

/* 搜索区域样式 */
.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, 0.9);
  padding-bottom: 20px;

  .search-label {
    width: 100px;
  }

  .search-main {
    width: 220px;
    margin-right: 10px;
  }
}

/* 添加按钮样式 */
.create-container {
  margin: 10px 0px;
}

/* 分页容器样式 */
.page-container {
  padding: 4px 0px;
  text-align: right;
}

/* 表单容器样式 */
.form-container {
  padding: 0px 80px;
}
</style>