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
export interface RoleDetail {
  /**
   * 已选择的路由信息
   */
  perms: number[];
  /**
   * 备注
   */
  remark: string;
  /**
   * 角色id
   */
  roleId: string;
  /**
   * 角色名称
   */
  roleName: string;
  /**
   * 当前角色分配人数
   */
  userTotal: number;
}
export interface RoleUserData {
  rows: RoleUser[];
  /**
   * 当前角色下关联的用户数
   */
  total: number;
}

export interface RoleUser {
  /**
   * 主键id
   */
  id: number;
  /**
   * 员工姓名
   */
  name: string;
  /**
   * 账号名
   */
  userName: string;
}
export interface RoleParams {
  /**
   * 菜单/功能点权限信息
   */
  perms: Array<number[]>;
  /**
   * 角色描述
   */
  remark: string;
  /**
   * 角色名称
   */
  roleName: string;
}
