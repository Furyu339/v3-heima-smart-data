import { routes } from "@/router";
import type { Profile } from "@/types/user";
import { getLocalToken, removeLocalToken, setLocalToken } from "@/utils/auth";
import { defineStore } from "pinia";
import type { RouteRecordRaw } from "vue-router";

export const useUserStore = defineStore("hm-user", () => {
  const token = ref(getLocalToken() || "");

  const setToken = (t: string) => {
    token.value = t;
    setLocalToken(t);
  };
  // 个人信息
  const profile = ref<Profile>({} as Profile);
  const setProfile = (p: Profile) => {
    profile.value = p;
  };
  const clearUserInfo = () => {
    token.value = "";
    removeLocalToken();
  };
  return { token, setToken, clearUserInfo, profile, setProfile };
});
