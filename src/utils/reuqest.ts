import axios, { type Method } from "axios";
import { getLocalToken } from "./auth";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/user";

// 创建 Axios 实例
const service = axios.create({
  baseURL: "https://api-hmzs.itheima.net/tj",
  timeout: 50000, // request timeout
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = getLocalToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config; // 返回修改后的配置
  },
  (error) => {
    // 请求发送失败时的处理逻辑
    ElMessage.error(error.response.data.msg);
    return Promise.reject(error); // 返回错误信息
  },
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 对响应数据的处理逻辑
    // 例如：直接返回响应数据，简化调用
    return response.data; // 返回响应数据（去掉外层的封装）
  },
  (error) => {
    // 响应失败时的处理逻辑
    // 例如：处理错误提示或重定向
    ElMessage.error(error.response.data.msg);
    if (error.response.status === 401) {
      const store = useUserStore();
      store.clearUserInfo();
    }
    return Promise.reject(error); // 返回错误信息
  },
);

type Data<T> = {
  code: number;
  message: string;
  data: T;
};
// 4. 请求工具函数
const request = <T>(
  url: string,
  method: Method = "get",
  submitData?: object,
) => {
  return service.request<T, Data<T>>({
    url,
    method,
    [method.toLowerCase() === "get" ? "params" : "data"]: submitData,
  });
};

export { request, service };
