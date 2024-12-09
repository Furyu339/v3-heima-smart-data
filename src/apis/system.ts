import type { Role, RoleData } from "@/types/system";
import { request } from "@/utils/reuqest";

/**
 * 获取角色列表
 * @returns
 */
export const getRoleListAPI = () => {
  return request<Role[]>("/park/sys/role");
};
/**
 * 获取tree权限列表
 * @returns
 */
export const getTreeListAPI = () => {
  return request<RoleData[]>("/park/sys/permision/all/tree");
};
