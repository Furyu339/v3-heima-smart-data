<script setup lang="ts">
import { loginAPI } from "@/apis/user";
import { FORMDATA_KEY } from "@/constants";
import type { FormInstance } from "element-plus";

const formData = ref({
  username: "",
  password: "",
  remember: false,
});
const rules = {
  username: [{ required: true, message: "请输入账号", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

const form = ref<FormInstance | undefined>();

const doLogin = () => {
  form.value!.validate(async (valid) => {
    if (valid) {
      const { username, password } = formData.value;
      const res = await loginAPI({ username, password });
       // 确保登录流程ok后，并且账号密码正确的
       if (formData.value.remember) {
        localStorage.setItem(FORMDATA_KEY, JSON.stringify(formData.value))
      } else {
        localStorage.removeItem(FORMDATA_KEY)
      }
      console.log("登录", res);
    }
  });
};

const testingAutoPassword = () => {
   formData.value = {
    username: "demo",
    password: "Hmzs%001",
    remember: true,
  };
};

</script>

<template>
  <div class="login_body">
    <div class="bg" />
    <div class="box">
      <div class="title">智慧园区-登录</div>
      <el-form ref="form" :model="formData" :rules="rules">
        <el-form-item label="账号" prop="username">
          <el-input v-model="formData.username" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" type="password" />
        </el-form-item>

        <el-form-item prop="remember">
          <el-checkbox v-model="formData.remember">记住我</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="login_btn" @click="doLogin()"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
      <el-button @click="testingAutoPassword">测试自动填充</el-button>
    </div>
  </div>
 
</template>

<style lang="scss" scoped>
.login_body {
  display: flex;
}

.bg {
  width: 60vw;
  height: 100vh;
  background: url("@/assets/login-bg.svg") no-repeat;
  background-position: right top;
  background-size: cover;
}

.box {
  margin: 200px 10% 0;
  flex: 1;

  .title {
    padding-bottom: 76px;
    font-size: 26px;
    font-weight: 500;
    color: #1e2023;
  }

  ::v-deep() {
    .ant-form-item {
      display: flex;
      margin-bottom: 62px;
      flex-direction: column;
    }

    .ant-form-item-label label {
      font-size: 16px;
      color: #8b929d;
    }

    .ant-input,
    .ant-input-password {
      border-radius: 8px;
    }
  }
}

.login_btn {
  width: 100%;
}
</style>
