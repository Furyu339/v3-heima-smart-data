export interface Role {
  /**
   * 角色描述
   */
  remark?: string;
  /**
   * 角色id
   */
  roleId?: number;
  /**
   * 角色名称
   */
  roleName?: string;
}
export interface RoleData {
  /**
   * 子集
   */
  children?: RoleData[];
  /**
   * id
   */
  id?: number;
  /**
   * 权限功能点信息
   */
  title?: string;
  disabled?: boolean;
}
