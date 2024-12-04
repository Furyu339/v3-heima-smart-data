<script setup lang="ts"></script>

<template>
  <div class="workbench-page">
    <el-row :gutter="20">
      <el-col :span="17">
        <div class="card-container">
          <div class="card-title">园区数据</div>
          <div class="card-statistic">
            <el-statistic :value="56233.03">
              <template #title>年度累计收费（元）</template>
            </el-statistic>
            <el-statistic :value="6">
              <template #title>入驻企业总数（个）</template>
            </el-statistic>
            <el-statistic :value="5">
              <template #title>月卡车辆总数（辆）</template>
            </el-statistic>
            <el-statistic :value="48">
              <template #title>一体杆总数（台）</template>
            </el-statistic>
          </div>
        </div>
        <div class="card-container">
          <div class="card-title">快捷入口</div>
        </div>
        <div class="card-container">
          <div class="card-title">快捷入口</div>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="card-container">
          <div class="card-title">快捷入口</div>
          <div class="card-entry">
            <div class="card-entry-item">
              <img src="@/assets/entry-enterprise.png" alt="" />
              <span>添加企业</span>
            </div>
            <div class="card-entry-item">
              <img src="@/assets/entry-employee.png" alt="" />
              <span>员工管理</span>
            </div>
            <div class="card-entry-item">
              <img src="@/assets/entry-bill.png" alt="" />
              <span>添加账单</span>
            </div>
            <div class="card-entry-item">
              <img src="@/assets/entry-screen.png" alt="" />
              <span>数据大屏</span>
            </div>
          </div>
        </div>
        <div class="card-container">
          <div class="card-title">快捷入口</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.workbench-page {
  background-color: #f4f6f8;
  height: 100%;
  .card-container {
    background-color: #fff;
    padding: 20px;
    margin-bottom: 20px;
  }
  .card-title {
    margin-bottom: 20px;
    font-size: 14px;
    font-weight: 500;
  }
  .card-statistic {
    display: flex;
    justify-content: space-between;
  }
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
  --el-statistic-title-font-size: 13px;
}
:deep(.el-statistic__head) {
  margin-bottom: 12px;
}

.card-entry {
  display: flex;
  justify-content: space-between;
  &-item {
    text-align: center;
    img {
      width: 40px;
    }
    span {
      font-size: 12px;
      display: block;
      margin-top: 8px;
    }
  }
}
</style>
