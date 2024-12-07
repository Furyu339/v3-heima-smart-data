<script setup lang="ts">
import { getIndustryListAPI } from "@/apis/enterprise";
import type { Industry } from "@/types/enterprise";
import { ref } from "vue";

const addForm = ref({
  name: "", // 企业名称
  legalPerson: "", // 法人
  registeredAddress: "", // 注册地址
  industryCode: "", // 所在行业
  contact: "", // 企业联系人
  contactNumber: "", // 联系人电话
  businessLicenseUrl: "", // 营业执照url
  businessLicenseId: "", // 营业执照id
});

const industryList = ref<Industry[]>([]); // 可选行业列表
const getIndustryList = async () => {
  const res = await getIndustryListAPI();
  industryList.value = res.data;
};

onMounted(() => {
  getIndustryList();
});
</script>

<template>
  <div class="add-enterprise">
    <header class="add-header">
      <el-page-header content="添加企业" @back="$router.back()" />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">企业信息</div>
        <div class="form">
          <el-form ref="ruleForm" label-width="100px">
            <el-form-item label="企业名称">
              <el-input v-model="addForm.name" />
            </el-form-item>
            <el-form-item label="法人">
              <el-input v-model="addForm.legalPerson" />
            </el-form-item>
            <el-form-item label="注册地址">
              <el-input v-model="addForm.registeredAddress" />
            </el-form-item>
            <el-form-item label="所在行业">
              <el-select v-model="addForm.industryCode">
                <el-option
                  v-for="item in industryList"
                  :key="item.industryCode"
                  :value="item.industryCode"
                  :label="item.industryName"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="企业联系人">
              <el-input v-model="addForm.contact" />
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input v-model="addForm.contactNumber" />
            </el-form-item>
            <el-form-item label="营业执照" />
          </el-form>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button>重置</el-button>
        <el-button type="primary">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.add-enterprise {
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
    background: #f4f6f8;
    padding: 20px 130px;

    .form-container {
      background-color: #fff;

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

          .el-form-item {
            width: 50%;
          }
        }
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
  }
}
</style>
