import type {
  Role,
  RoleData,
  RoleDetail,
  RoleParams,
  RoleUserData,
} from "@/types/system";
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
/**
 * 更改角色
 * @returns
 */
export const updateRoleAPI = (data: RoleParams) => {
  return request("/park/sys/role", "PUT", data);
};
/**
 * 删除角色
 * @returns
 */
export const delRoleUserAPI = (roleId: string) => {
  return request(`/park/sys/role/${roleId}`, "DELETE");
};
