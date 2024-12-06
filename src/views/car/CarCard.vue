<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">车牌号码：</span>
      <el-input clearable placeholder="请输入内容" class="search-main" />
      <span class="search-label">车主姓名：</span>
      <el-input clearable placeholder="请输入内容" class="search-main" />
      <span class="search-label">状态：</span>
      <el-select style="width: 240px">
        <el-option label="全部" value="1" />
      </el-select>
      <el-button type="primary" class="search-btn">查询</el-button>
    </div>
    <!-- 新增删除操作区域 -->
    <div class="create-container">
      <el-button type="primary">添加月卡</el-button>
      <el-button>批量删除</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="cardList" v-loading="loading">
        <el-table-column type="index" label="序号" width="100" />
        <el-table-column align="center" label="车主名称" prop="personName" />
        <el-table-column align="center" label="联系方式" prop="phoneNumber" />
        <el-table-column align="center" label="车牌号码" prop="carNumber" />
        <el-table-column align="center" label="车辆品牌" prop="carBrand" />
        <el-table-column
          align="center"
          label="剩余有效天数"
          prop="totalEffectiveDate"
        />
        <el-table-column align="center" label="操作" fixed="right" width="300">
          <template #default="scope">
            <el-button size="small" type="text">续费</el-button>
            <el-button size="small" type="text">查看</el-button>
            <el-button size="small" type="text">编辑</el-button>
            <el-button size="small" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="page-container" style="float: right; margin-top: 10px">
      <el-pagination
        v-model:current-page="params.page"
        v-model:page-size="params.pageSize"
        :page-sizes="[10, 20, 30, 40]"
        size="default"
        layout="total, prev, pager, next,  sizes"
        :total="total"
        @current-change="pageChange"
        @size-change="sizeChangeFn"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getCardListAPI } from "@/apis/card";
import type { Card, CardListParams } from "@/types/card";

const loading = ref(false);

const params = ref<CardListParams>({
  page: 1,
  pageSize: 10,
  carNumber: undefined, // 车辆号码
  personName: undefined, // 车主姓名
  cardStatus: undefined, // 车辆状态
});
// 月卡列表
const cardList = ref<Card[]>([]);
const total = ref(0);
const getCardList = async () => {
  loading.value = true;
  const res = await getCardListAPI(params.value);
  cardList.value = res.data.rows;
  total.value = res.data.total;
  loading.value = false;
};
const pageChange = (page: number) => {
  params.value.page = page;
  getCardList();
};
const sizeChangeFn = (pageSize: number) => {
  params.value.pageSize = pageSize;
  getCardList();
};
onMounted(() => {
  getCardList();
});
</script>

<style lang="scss" scoped>
.card-container {
  padding: 20px;
  background-color: #fff;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, 0.9);
  padding-bottom: 20px;

  .search-main {
    width: 220px;
    margin-right: 10px;
  }

  .search-btn {
    margin-left: 20px;
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
