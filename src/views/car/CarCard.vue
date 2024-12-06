<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">车牌号码：</span>
      <el-input
        v-model="params.carNumber"
        clearable
        placeholder="请输入内容"
        class="search-main"
      />
      <span class="search-label">车主姓名：</span>
      <el-input
        v-model="params.personName"
        clearable
        placeholder="请输入内容"
        class="search-main"
      />
      <span class="search-label">状态：</span>
      <el-select v-model="params.cardStatus" style="width: 240px">
        <el-option
          v-for="item in cardStatusList"
          :key="item.id"
          :value="item.id"
          :label="item.name"
        />
      </el-select>
      <el-button type="primary" class="search-btn" @click="doSearch">
        查询
      </el-button>
    </div>
    <!-- 新增删除操作区域 -->
    <div class="create-container">
      <el-button type="primary" @click="$router.push('/cardAdd')"
        >添加月卡</el-button
      >
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
          <template #default="{row:{id}}">
            <el-button size="small" type="text">续费</el-button>
            <el-button size="small" type="text">查看</el-button>
            <el-button size="small" type="text" @click="editCard(id)">编辑</el-button>
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
        layout="total, prev, pager, next, sizes"
        :total="total"
        @current-change="pageChange"
        @size-change="sizeChangeFn"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
// 导入所需的 API 和类型
import { getCardListAPI } from "@/apis/card";
import type { Card, CardListParams } from "@/types/card";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

// 定义加载状态
const loading = ref(false);
const router = useRouter()
const editCard = (id: string) => {
  router.push({
    path: '/cardAdd',
    query: {
      id
    }
  })
}
const params = ref<CardListParams>({
  page: 1,
  pageSize: 10,
  carNumber: undefined, // 车辆号码
  personName: undefined, // 车主姓名
  cardStatus: undefined, // 车辆状态
});

// 定义月卡列表和总数
const cardList = ref<Card[]>([]);
const total = ref(0);

// 定义卡片状态列表
const cardStatusList = [
  {
    id: -1,
    name: "全部",
  },
  {
    id: 0,
    name: "可用",
  },
  {
    id: 1,
    name: "已过期",
  },
];

// 获取月卡列表的函数
const getCardList = async () => {
  loading.value = true;
  const tempParams = { ...params.value };
  console.log("tempParams", tempParams);
  if (Number(tempParams.cardStatus) === -1) {
    delete tempParams.cardStatus;
  }

  const res = await getCardListAPI(tempParams);
  cardList.value = res.data.rows;
  total.value = res.data.total;
  loading.value = false;
};

// 页码变化的处理函数
const pageChange = (page: number) => {
  params.value.page = page;
  getCardList();
};

// 每页条数变化的处理函数
const sizeChangeFn = (pageSize: number) => {
  params.value.pageSize = pageSize;
  getCardList();
};

// 组件挂载时获取月卡列表
onMounted(() => {
  getCardList();
});

// 查询按钮的处理函数
const doSearch = () => {
  // 调用接口之前把页数参数重置为 1
  // （防止页码在其他页时，搜索时数据不够，导致还在原来页码停留）
  params.value.page = 1;
  getCardList();
};
</script>

<style lang="scss" scoped>
.card-container {
  padding: 20px;
  background-color: #fff;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(237, 237, 237, 0.9);
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
  margin: 10px 0;
}

.table {
  margin-top: 20px;
}

.page-container {
  padding: 4px 0;
  text-align: right;
}

.form-container {
  padding: 0 80px;
}
</style>
