import type { Role, RoleData, RoleDetail, RoleUserData } from "@/types/system";
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
/**
 * 查询当前角色详情-权限和分配人数
 * @returns
 */
export const getRoleDetailAPI = (roleId: number) => {
  return request<RoleDetail>(`/park/sys/role/${roleId}`);
};
/**
 * 获取角色成员列表
 * @returns
 */
export const getRoleUserAPI = (roleId: number) => {
  return request<RoleUserData>(`/park/sys/roleUser/${roleId}`);
};
