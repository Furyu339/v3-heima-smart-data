<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">企业名称：</div>
      <el-input v-model="params.name" clearable placeholder="请输入企业名称" class="search-main" @clear="doSearch" />
  <el-button type="primary" @click="doSearch">查询</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary" @click="$router.push('/exterpriseAdd')">添加企业</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table" v-loading="loading">
      <el-table style="width: 100%" :data="exterpriseList">
        <el-table-column align="center" type="index" label="序号" width="120" />
        <el-table-column
          align="center"
          label="企业名称"
          width="320"
          prop="name"
        />
        <el-table-column align="center" label="联系人" prop="contact" />
        <el-table-column align="center" label="联系电话" prop="contactNumber" />
        <el-table-column align="center" label="操作" width="350">
          <template>
            <el-button size="small" type="text">添加合同</el-button>
            <el-button size="small" type="text">查看</el-button>
            <el-button size="small" type="text">编辑</el-button>
            <el-button size="small" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container" style="float: right">
      <el-pagination
        layout="total, prev, pager, next"
        :total="total"
        :page-size="params.pageSize"
        @current-change="pageChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getEnterpriseListAPI } from "@/apis/enterprise";
import type { Enterprise, EnterpriseListParams } from "@/types/enterprise";

const loading = ref(false);
const total = ref(0);

// 1. 获取企业列表
const exterpriseList = ref<Enterprise[]>([]);
const params = ref<EnterpriseListParams>({
  page: 1,
  pageSize: 10,
  name: '' // 增加字段name
});

onMounted(() => {
  getExterpriseList();
});

const doSearch = () => {
  params.value.page = 1
  getExterpriseList()
}

const getExterpriseList = async () => {
  loading.value = true;
  const res = await getEnterpriseListAPI(params.value);
  exterpriseList.value = res.data?.rows;
  total.value = res.data?.total;
  loading.value = false;
};
const pageChange = (page: number)=>{
  // 更改参数
  params.value.page = page
  // 重新获取数据渲染
  getExterpriseList()
}

</script>

<style lang="scss" scoped>
.building-container {
  padding: 20px;
}

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

.create-container {
  margin: 10px 0px;
}

.page-container {
  padding: 4px 0px;
  text-align: right;
}

.form-container {
  padding: 0px 80px;
}
</style>
