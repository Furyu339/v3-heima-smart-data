import { useUserStore } from "@/stores/user";
import type { Directive, DirectiveBinding } from "vue";

// 管理员权限特殊处理
const adminPerms = '*:*:*'

export const auth: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
    const { value } = binding;
    const store = useUserStore()
    const perms = store.profile.permissions
    // 管理员账号单独处理
    if(perms.includes(adminPerms)){
      return
    }
    // 其他员工
    if(!perms.includes(value)){
      el.remove()
    }
  },
};