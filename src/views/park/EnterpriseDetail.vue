<script setup lang="ts">
import { downloadContract, getEnterpriseDetailAPI } from "@/apis/enterprise";
import type { EnterpriseDetail } from "@/types/enterprise";

onMounted(() => {
  getDetail();
});
const previewURL = "https://view.officeapps.live.com/op/view.aspx?src="; // 预览地址
const form = ref<EnterpriseDetail>({} as EnterpriseDetail);
const loading = ref(false);
const route = useRoute();
const getDetail = async () => {
  if (!route.query.id) return;
  loading.value = true;
  const res = await getEnterpriseDetailAPI(route.query.id as string);
  // 预处理预览地址
  // PDF：直接浏览器打开
  // 在线预览工具只能浏览 doc 文件，需要拼接前缀预览地址
  res.data.rent.forEach((obj) => {
    const url = obj.contractUrl;
    const extName = url!.slice(url!.lastIndexOf("."));
    if (extName === ".doc") {
      obj.contractUrl = previewURL + obj.contractUrl;
    }
  });
  form.value = res.data;
  loading.value = false;
};

const downloadCon = async (row: any) => {
  const data = await downloadContract(row.contractId);
  // 文件流数据 => File对象（父类 Blob）=> 转临时 URL 地址
  const url = window.URL.createObjectURL(data);
  const a = document.createElement("a");
  a.href = url;
  a.download = row.contractName || "";
  a.click();
};
</script>

<template>
  <div class="detail-enterprise">
    <header class="add-header">
      <el-page-header content="查看企业" @back="$router.back()" />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">租赁记录</div>
        <div class="table-container">
          <el-table
            :data="form.rent"
            style="width: 100%"
            border
            v-loading="loading"
          >
            <el-table-column type="index" label="序号" width="50" />
            <el-table-column prop="buildingName" label="租赁楼宇" width="180" />
            <el-table-column label="租赁起止时间" width="280">
              <template #default="{ row }">
                {{ row.startTime }} - {{ row.endTime }}
              </template>
            </el-table-column>
            <el-table-column label="租赁合同(点击预览)">
              <template #default="{ row }">
                <el-button type="text">
                  <a :href="row.contractUrl" target="_blank">
                    {{ row.contractName }}
                  </a>
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="录入时间" />
            <el-table-column prop="address" label="操作">
              <template #default="{ row }">
                <el-button type="text" @click="downloadCon(row)">
                  合同下载
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
.detail-enterprise {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 64px;
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
    background: #f4f6f8;
    padding: 20px 130px;

    .form-container {
      background-color: #fff;
      margin-bottom: 20px;

      .title {
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
      }
    }

    .table-container {
      padding: 20px;
    }

    .preview {
      img {
        width: 100px;
      }
    }
  }
}
</style>
