import { TOKEN_KEY } from "@/constants";
import Cookies from "js-cookie";

// 获取token的方法
export const getLocalToken = () => {
  return Cookies.get(TOKEN_KEY);
};

// 设置方法
export const setLocalToken = (token: string) => {
  Cookies.set(TOKEN_KEY, token);
};

// 删除方法
export const removeLocalToken = () => {
  Cookies.remove(TOKEN_KEY);
};
