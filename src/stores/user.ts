import { getLocalToken, removeLocalToken, setLocalToken } from "@/utils/auth";
import { defineStore } from "pinia";

export const useUserStore = defineStore("hm-user", () => {
  const token = ref(getLocalToken() || "");

  const setToken = (t: string) => {
    token.value = t;
    setLocalToken(t);
  };

  const clearUserInfo = () => {
    token.value = "";
    removeLocalToken();
  };
  return {
    token,
    setToken,
    clearUserInfo,
  };
});
