import axios from "axios";

// 创建 Axios 实例
const service = axios.create({
  baseURL: "https://api-hmzs.itheima.net/api", // 基础请求地址
  timeout: 5000, // 请求超时时间（单位：毫秒）
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 请求发送前的处理逻辑
    // 例如：添加认证 token 或修改请求头
    return config; // 返回修改后的配置
  },
  (error) => {
    // 请求发送失败时的处理逻辑
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
    return Promise.reject(error); // 返回错误信息
  },
);

export default service; // 导出 Axios 实例供其他模块使用
