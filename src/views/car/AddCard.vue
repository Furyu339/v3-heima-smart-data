<template>
  <div class="add-card">
    <header class="add-header">
      <el-page-header content="增加月卡" @back="$router.back()" />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">车辆信息</div>
        <div class="form">
          <el-form
            ref="carInfoFormRef"
            :model="carInfoForm"
            :rules="carInfoRules"
            label-width="100px"
          >
            <el-form-item label="车主姓名" prop="personName">
              <el-input v-model="carInfoForm.personName" />
            </el-form-item>
            <el-form-item label="联系方式" prop="phoneNumber">
              <el-input v-model="carInfoForm.phoneNumber" />
            </el-form-item>
            <el-form-item label="车辆号码" prop="carNumber">
              <el-input v-model="carInfoForm.carNumber" />
            </el-form-item>
            <el-form-item label="车辆品牌" prop="carBrand">
              <el-input v-model="carInfoForm.carBrand" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="form-container">
        <div class="title">最新一次月卡缴费信息</div>
        <div class="form">
          <el-form
            label-width="100px"
            :model="feeForm"
            :rules="feeFormRules"
            ref="feeFormRef"
          >
            <el-form-item label="有效日期" prop="payTime">
              <el-date-picker
                v-model="feeForm.payTime"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
            <el-form-item label="支付金额" prop="paymentAmount">
              <el-input v-model="feeForm.paymentAmount" />
            </el-form-item>
            <el-form-item label="支付方式" prop="paymentMethod">
              <el-select v-model="feeForm.paymentMethod" clearable>
                <el-option
                  v-for="item in payMethodList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button @click="resetForm">重置</el-button>
        <el-button type="primary" @click="confirmAdd">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import type { FormRules } from "element-plus";
import type { CardParams } from "@/types/card";
import { validateCarNumber } from "@/utils/validate";
import { useRouter } from "vue-router";
import { createCardAPI } from "@/apis/card";




const carInfoFormRef = ref();
const feeFormRef = ref();
const router = useRouter();

// 车辆信息表单
const carInfoForm = ref<CardParams>({
  personName: "", // 车主姓名
  phoneNumber: "", // 联系方式
  carNumber: "", // 车牌号码
  carBrand: "", // 车辆品牌
});

// 车辆信息表单规则
const carInfoRules: FormRules<CardParams> = {
  personName: [
    {
      required: true,
      message: "请输入车主姓名",
      trigger: "blur",
    },
  ],
  phoneNumber: [
    {
      required: true,
      message: "请输入联系方式",
      trigger: "blur",
    },
    { pattern: /^1[34578]\d{9}$/, message: "请输入正确格式手机号" },
  ],
  carNumber: [
    {
      required: true,
      message: "请输入车辆号码",
      trigger: "blur",
    },
    {
      validator: validateCarNumber,
      trigger: "blur",
    },
  ],
  carBrand: [
    {
      required: true,
      message: "请输入车辆品牌",
      trigger: "blur",
    },
  ],
};

// 缴费信息表单
const feeForm = ref({
  payTime: [], // 支付时间
  paymentAmount: undefined, // 支付金额
  paymentMethod: undefined, // 支付方式
});

// 缴费规则
const feeFormRules = {
  payTime: [
    {
      required: true,
      message: "请选择支付时间",
    },
  ],
  paymentAmount: [
    {
      required: true,
      message: "请输入支付金额",
      trigger: "blur",
    },
  ],
  paymentMethod: [
    {
      required: true,
      message: "请选择支付方式",
      trigger: "change",
    },
  ],
};

// 支付方式列表
const payMethodList = [
  {
    id: "Alipay",
    name: "支付宝",
  },
  {
    id: "WeChat",
    name: "微信",
  },
  {
    id: "Cash",
    name: "线下",
  },
];

// 确定添加按钮
const confirmAdd = () => {
  carInfoFormRef.value.validate((valid: any) => {
    if (valid) {
      feeFormRef.value.validate( async  (valid: any) => {
        if (valid) {
            const payload = {
            paymentAmount: feeForm.value.paymentAmount,
            paymentMethod: feeForm.value.paymentMethod,
            ...carInfoForm.value,
            // 单独处理时间
            cardStartDate: feeForm.value.payTime[0],
            cardEndDate: feeForm.value.payTime[1]
          }
          console.log(payload)
          await createCardAPI(payload)
          router.back()
        }
      });
    }
  });
};

// 重置表单
const resetForm = () => {
  // el-form 会用默认 v-model 的初始值作为重置的数据
  feeFormRef.value.resetFields()
  carInfoFormRef.value.resetFields()
}

</script>

<style scoped lang="scss">
.add-card {
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

    .preview {
      img {
        width: 100px;
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
