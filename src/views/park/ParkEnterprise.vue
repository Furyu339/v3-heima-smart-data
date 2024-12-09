<script lang="ts" setup>
// 导入需要的API方法和类型，以及Element Plus的组件和类型
import {
  createRentAPI,
  delEnterpriseAPI, // 删除企业API
  getEnterpriseListAPI, // 获取企业列表API
  getRentBuildListAPI,
  getRentListAPI,
  uploadAPI, // 获取楼宇列表API
} from "@/apis/enterprise";

import type {
  Enterprise,
  EnterpriseListParams,
  RentForm,
} from "@/types/enterprise"; // 导入类型定义

import {
  ElMessageBox,
  ElMessage,
  type FormRules,
  type UploadRawFile,
  type UploadRequestOptions,
} from "element-plus"; // Element Plus的消息提示组件及表单验证规则类型

// 定义是否显示添加合同弹框的状态
const rentDialogVisible = ref(false);

// 定义加载状态
const loading = ref(false);

// 定义企业列表的总数
const total = ref(0);

// 上传合同
const contractList = ref<any>([]);
const addForm = ref();
// 楼宇列表数据
const buildList = ref<{ id: string; name: string }[]>([]);
// 企业列表数据
const exterpriseList = ref<Enterprise[]>([]);

// 租赁合同表单数据
const rentForm = ref<RentForm>({
  buildingId: "", // 楼宇ID
  contractId: "", // 合同ID
  contractUrl: "", // 合同URL
  enterpriseId: "", // 企业ID
  type: 0, // 合同类型
  rentTime: [], // 租赁时间范围
});

// 打开添加合同弹框的方法
const addRent = async (id: string) => {
  rentDialogVisible.value = true; // 显示弹框
  const res = await getRentBuildListAPI(); // 调用API获取楼宇列表
  buildList.value = res.data; // 更新楼宇列表
  rentForm.value.enterpriseId = id;
};

// 关闭添加合同弹框的方法
const closeDialog = () => {
  rentDialogVisible.value = false; // 隐藏弹框
  addForm.value.resetFields();
};

// 上传前验证
const beforeUpload = (file: UploadRawFile) => {
  const allowImgType = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
  ].includes(file.type);
  const isLt5M = file.size / 1024 / 1024 < 5;

  if (!allowImgType) {
    ElMessage.error("上传合同文件只能是 .doc, .pdf 格式!");
  }
  if (!isLt5M) {
    ElMessage.error("上传合同文件大小不能超过 5MB!");
  }
  return allowImgType && isLt5M;
};

const uploadHandle = async (fileData: UploadRequestOptions) => {
  // 1. 处理FormData
  const { file } = fileData;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", "contract");
  // 2. 上传并赋值
  const res = await uploadAPI(formData);
  const { id, url } = res.data;
  rentForm.value.contractId = id;
  rentForm.value.contractUrl = url;
  contractList.value.push({ name: file.name, url: url });
  // 单独校验表单
  addForm.value.validateField("contractId");
};

const confirmAdd = () => {
  addForm.value.validate(async (valid: boolean) => {
    if (valid) {
      const { buildingId, contractId, contractUrl, enterpriseId, type } =
        rentForm.value;
      await createRentAPI({
        buildingId,
        contractId,
        contractUrl,
        enterpriseId,
        type,
        startTime: rentForm.value.rentTime[0],
        endTime: rentForm.value.rentTime[1],
      });
      ElMessage.success({ message: "添加合同成功" });
      // 更新列表
      getExterpriseList();
      // 关闭弹框
      rentDialogVisible.value = false;
      // 重置表单
      addForm.value.resetFields();
      rentForm.value.contractUrl = "";
      rentForm.value.contractId = "";
      contractList.value = [];
    }
  });
};

const expandRowKeys = ref<string[]>([]);
const rentListloading = ref(false);
const expandHandle = async (row: any, rows: any[]) => {
  // // rows 中包含当前展开行数据，说明是展开状态
  const isExpend = rows.find((item) => item.id === row.id);
  // 因为展开/关闭都会触发此事件函数，做个判断只有展开时获取数据
  if (isExpend) {
    rentListloading.value = true;
    const res = await getRentListAPI(row.id);
    res.data.forEach((obj) => {
      row.rentList.push(obj);
    });
    rentListloading.value = false;
    expandRowKeys.value.push(row.id); // 把当前行的 ID 加入到 expandRowKeys 数组中
  } else {
    // 关闭时，把当前行的合同列表清空，防止下次打开时不断 push 叠加
    row.rentList.splice(0);
    expandRowKeys.value = expandRowKeys.value.filter(
      (value) => value !== row.id,
    );
  }
};

// 格式化 tag 类型
const formatInfoType = (status: number) => {
  switch (status) {
    case 0:
      return "warning";
    case 1:
      return "success";
    case 2:
      return "info";
    case 3:
      return "danger";
  }
};

// 格式化 status
const formatStatus = (type: number) => {
  switch (type) {
    case 0:
      return "待生效";
    case 1:
      return "生效中";
    case 2:
      return "已到期";
    case 3:
      return "已退租";
  }
};

// 合同表单的验证规则
const rentRules = ref<FormRules>({
  buildingId: [{ required: true, message: "请选择楼宇", trigger: "change" }], // 楼宇必填
  rentTime: [{ required: true, message: "请选择租赁日期", trigger: "change" }], // 租赁时间必填
  contractId: [{ required: true, message: "请上传合同文件" }], // 合同文件必填
});

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
  exterpriseList.value = res.data?.rows.map((item) => {
    return {
      ...item,
      rentList: [],
    };
  }); // 更新企业列表数据
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
      <el-button type="primary" @click="$router.push('/exterpriseAdd')"
        >添加企业</el-button
      >
    </div>

    <!-- 表格区域 -->
    <div class="table" v-loading="loading">
      <el-table
        style="width: 100%"
        :data="exterpriseList"
        @expand-change="expandHandle"
        row-key="id"
        :expand-row-keys="expandRowKeys"
      >
        <!-- 新增：展开部分 -->
        <el-table-column type="expand">
          <template #default="{ row }">
            <el-table :data="row.rentList" v-loading="rentListloading">
              <el-table-column
                label="租赁楼宇"
                width="320"
                prop="buildingName"
              />
              <el-table-column label="租赁起始时间" prop="startTime" />
              <el-table-column align="center" label="合同状态">
                <template #default="scope">
                  <el-tag :type="formatInfoType(scope.row.status)">
                    {{ formatStatus(scope.row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="250">
                <template>
                  <el-button size="small" type="text">续租</el-button>
                  <el-button size="small" type="text">退租</el-button>
                  <el-button size="small" type="text">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <!-- 序号列 -->
        <el-table-column align="center" type="index" label="序号" width="120" />
        <!-- 企业名称列 -->
        <el-table-column
          align="center"
          label="企业名称"
          width="320"
          prop="name"
        />
        <!-- 联系人列 -->
        <el-table-column align="center" label="联系人" prop="contact" />
        <!-- 联系电话列 -->
        <el-table-column align="center" label="联系电话" prop="contactNumber" />
        <!-- 操作列 -->
        <el-table-column align="center" label="操作" width="350">
          <template #default="{ row: { id } }">
            <el-button size="small" type="text" @click="addRent(id)"
              >添加合同</el-button
            >
            <el-button size="small" type="text">查看</el-button>
            <el-button size="small" type="text" @click="editRent(id)"
              >编辑</el-button
            >
            <el-button size="small" type="text" @click="delExterprise(id)"
              >删除</el-button
            >
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
              value-format="YYYY-MM-DD"
            />
          </el-form-item>

          <el-form-item label="租赁合同" prop="contractId">
            <el-upload
              action="#"
              :http-request="uploadHandle"
              :before-upload="beforeUpload"
              :file-list="contractList"
            >
              <el-button size="small" type="primary" plain
                >上传合同文件</el-button
              >
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
        <el-button size="small" type="primary" @click="confirmAdd"
          >确 定</el-button
        >
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
