import { defineStore } from "pinia";

export const useUserStore = defineStore('hm-user', () => {
  const token = ref('') 
  return {token}
})
