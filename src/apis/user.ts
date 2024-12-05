import type { LoginParams } from "@/types/user";
import { request } from "@/utils/reuqest";

/**
 * @description: 登录函数
 * @param {*} data { mobile,password }
 * @return {*} promise
 */
export const loginAPI = (data: LoginParams) => {
  return request<{ token: string }>("/park/login", "POST", data);
};
