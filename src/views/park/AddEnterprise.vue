<script setup lang="ts">
// 导入所需的API函数和类型定义
import {
  createEnterpriseAPI,
  getEnterpriseDetailAPI,
  getIndustryListAPI,
  updateEnterpriseAPI,
  uploadAPI,
} from "@/apis/enterprise";
import type { Industry } from "@/types/enterprise";
import { validMobile } from "@/utils/validate";
import {
  type UploadUserFile,
  type UploadRequestOptions,
  ElMessage,
  type UploadRawFile,
} from "element-plus";

const route = useRoute();
const id = computed(() => {
  return route.query.id as string;
});
const loading = ref(false);
// 定义企业信息表单数据结构
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

// 定义表单验证规则
const addRules = ref({
  name: [{ required: true, message: "企业名称为必填", trigger: "blur" }],
  legalPerson: [{ required: true, message: "法人为必填", trigger: "blur" }],
  registeredAddress: [
    { required: true, message: "注册地址为必填", trigger: "blur" },
  ],
  industryCode: [
    { required: true, message: "所在行业为必填", trigger: "change" },
  ],
  contact: [{ required: true, message: "企业联系人为必填", trigger: "blur" }],
  contactNumber: [
    { required: true, message: "企业联系人电话为必填", trigger: "blur" },
    { validator: validMobile, trigger: "blur" },
  ],
  businessLicenseId: [
    { required: true, message: "请上传营业执照", trigger: "blur" },
  ],
});

// 存储已上传的营业执照文件列表
const fileList = ref<UploadUserFile[]>([]);

/**
 * 自定义上传请求处理函数
 * @param options 上传选项，包含文件信息
 */
const uploadRequest = async (options: UploadRequestOptions): Promise<any> => {
  const file = options.file;

  // 处理formData类型参数
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", "businessLicense");
  const res = await uploadAPI(formData);

  // 赋值表单数据
  addForm.value.businessLicenseId = res.data.id;
  addForm.value.businessLicenseUrl = res.data.url;

  // 更新el-upload显示的已上传文件列表
  fileList.value.push({
    name: file.name,
    url: res.data.url,
  });
  ruleForm.value.validateField("businessLicenseId");
};

// 存储行业列表数据
const industryList = ref<Industry[]>([]);

/**
 * 获取行业列表数据
 */
const getIndustryList = async () => {
  const res = await getIndustryListAPI();
  industryList.value = res.data;
};

/**
 * 上传前的文件验证
 * @param file 待上传的文件
 * @returns boolean 是否通过验证
 */
const beforeUpload = (file: UploadRawFile) => {
  const allowImgType = ["image/jpeg", "image/png", "image/jpg"].includes(
    file.type,
  );
  const isLt5M = file.size / 1024 / 1024 < 5;

  if (!allowImgType) {
    ElMessage.error("上传营业执照图片只能是 PNG/JPG/JPEG 格式!");
  }
  if (!isLt5M) {
    ElMessage.error("上传营业执照图片大小不能超过 5MB!");
  }
  return allowImgType && isLt5M;
};

const ruleForm = ref();
const router = useRouter();
const confirmSubmit = () => {
  ruleForm.value.validate(async (valid: boolean) => {
    if (!valid) return;
    if (id.value) {
      // 编辑
      await updateEnterpriseAPI({
        ...addForm.value,
        id: id.value
      })
    } else {
      // 调用接口
      await createEnterpriseAPI(addForm.value)
    } 
    // 返回列表页
    router.push("/park/enterprise").then(() => {
    window.location.reload();
  });
  });
};
const resetForm = () => {
  ruleForm.value.resetFields();
};

const btnBack = () => {
  router.push("/park/enterprise").then(() => {
    window.location.reload();
  });
};

const getEnterpriseDetail = async () => {
  loading.value = true;
  const res = await getEnterpriseDetailAPI(id.value);
  const {
    businessLicenseId,
    businessLicenseUrl,
    contact,
    contactNumber,
    industryCode,
    legalPerson,
    name,
    registeredAddress,
    businessLicenseName,
  } = res.data;
  addForm.value = {
    businessLicenseId,
    businessLicenseUrl,
    contact,
    contactNumber,
    industryCode,
    legalPerson,
    name,
    registeredAddress,
  };
  fileList.value.push({
    name: businessLicenseName,
    url: businessLicenseUrl,
  });
  loading.value = false;
};

// 组件挂载时获取行业列表数据
onMounted(() => {
  getIndustryList();
  if (id.value) {
    getEnterpriseDetail();
  }
});
</script>

<template>
  <!-- 企业添加页面主容器 -->
  <div class="add-enterprise">
    <!-- 页面头部 -->
    <header class="add-header">
      <el-page-header :content="id ? '编辑企业' : '添加企业'" @back="btnBack" />
    </header>
    <!-- 页面主体内容 -->
    <main class="add-main">
      <div class="form-container">
        <div class="title">企业信息</div>
        <div class="form">
          <!-- 企业信息表单 -->
          <el-form
            ref="ruleForm"
            label-width="100px"
            :model="addForm"
            :rules="addRules"
            v-loading="loading"
          >
            <el-form-item label="企业名称" prop="name">
              <el-input v-model="addForm.name" />
            </el-form-item>
            <el-form-item label="法人" prop="legalPerson">
              <el-input v-model="addForm.legalPerson" />
            </el-form-item>
            <el-form-item label="注册地址" prop="registeredAddress">
              <el-input v-model="addForm.registeredAddress" />
            </el-form-item>
            <el-form-item label="所在行业" prop="industryCode">
              <el-select v-model="addForm.industryCode">
                <el-option
                  v-for="item in industryList"
                  :key="item.industryCode"
                  :value="item.industryCode"
                  :label="item.industryName"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="企业联系人" prop="contact">
              <el-input v-model="addForm.contact" />
            </el-form-item>
            <el-form-item label="联系电话" prop="contactNumber">
              <el-input v-model="addForm.contactNumber" />
            </el-form-item>
            <el-form-item label="营业执照" prop="businessLicenseId">
              <el-upload
                action="#"
                :file-list="fileList"
                :http-request="uploadRequest"
                :before-upload="beforeUpload"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">
                  支持扩展名：.png .jpg .jpeg, 文件大小不得超过5M
                </div>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </main>
    <!-- 页面底部按钮 -->
    <footer class="add-footer">
      <div class="btn-container">
        <el-button @click="resetForm">重置</el-button>
        <el-button type="primary" @click="confirmSubmit">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
/* 企业添加页面样式 */
.add-enterprise {
  background-color: #f4f6f8;
  height: 100vh;

  /* 页面头部样式 */
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

  /* 主体内容样式 */
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

      /* 表单布局样式 */
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

  /* 底部固定按钮样式 */
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
