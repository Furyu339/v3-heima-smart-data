<script lang="ts" setup>
import { getRuleListAPI } from "@/apis/car";
import type { Car, CarListParams } from "@/types/car";
import { ref } from "vue";
import { utils, writeFileXLSX } from "xlsx";

const ruleList = ref<Car[]>([]);
const params = ref<CarListParams>({
  page: 1,
  pageSize: 5,
});
const total = ref(0);
const dialogVisible = ref(false);
const loading = ref(false);
// 获取规则列表
const getRuleList = async () => {
  loading.value = true;
  const res = await getRuleListAPI(params.value);
  ruleList.value = res.data.rows;
  total.value = res.data.total;
  loading.value = false;
};
onMounted(() => {
  getRuleList();
});
const chargeType: any = {
  duration: "时长收费",
  turn: "按次收费",
  partition: "分段消费",
};
const exportToExcel = () => {
  // 表头英文字段key（需要导出字段）
  const tableHeaderKeys = [
    "ruleNumber",
    "ruleName",
    "freeDuration",
    "chargeCeiling",
    "chargeType",
    "ruleNameView",
  ];
  // 表头中文字段value（设置表头使用）
  const tableHeaderValues = [
    "计费规则编号",
    "计费规则名称",
    "免费时长(分钟)",
    "收费上线(元)",
    "计费方式",
    "计费规则",
  ];
  // 获取要导出的业务数据
  // 以excel表格的顺序调整后端数据（过滤）
  const sheetData = ruleList.value.map((item: any) => {
    const obj: any = {};
    tableHeaderKeys.forEach((key) => {
      // 针对计费规则做处理
      if (key === "chargeType") {
        obj[key] = chargeType[item[key]];
      } else {
        obj[key] = item[key];
      }
    });
    return obj;
  });
  // 1. 创建一个新的工作簿
  const workbook = utils.book_new();
  // 2. 创建一个工作表 要求一个对象数组格式（可以根据需要创建多个）
  const worksheet = utils.json_to_sheet(sheetData);
  // 3. 把工作表添加到工作簿  Data为工作表名称
  utils.book_append_sheet(workbook, worksheet, "Data");
  // 改写表头
  utils.sheet_add_aoa(worksheet, [tableHeaderValues], { origin: "A1" });
  // 4. 导出方法进行导出
  writeFileXLSX(workbook, "停车计费规则.xlsx");
};
</script>

<template>
  <div class="rule-container">
    <div class="create-container">
      <el-button type="primary">增加停车计费规则</el-button>
      <el-button @click="exportToExcel">导出Excel</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table :data="ruleList" style="width: 100%" v-loading="loading">
        <el-table-column align="center" type="index" label="序号" width="100" />
        <el-table-column
          align="center"
          label="计费规则编号"
          prop="ruleNumber"
        />
        <el-table-column align="center" label="计费规则名称" prop="ruleName" />
        <el-table-column
          align="center"
          label="免费时长(分钟)"
          prop="freeDuration"
        />
        <el-table-column
          align="center"
          label="收费上限(元)"
          prop="chargeCeiling"
        />
        <el-table-column align="center" label="计费方式">
          <template #default="scope">
            {{ chargeType[scope.row.chargeType] }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="计费规则" prop="ruleNameView" />
        <el-table-column align="center" label="操作" fixed="right" width="200">
          <template #default>
            <el-button size="small" type="text">编辑</el-button>
            <el-button size="small" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.rule-container {
  padding: 20px;
  background-color: #fff;
}

.rules .el-form-item {
  padding: 0 10px;
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
