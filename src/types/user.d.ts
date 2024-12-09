export interface LoginParams {
  password: string;
  username: string;
}
export interface Profile {
  /**
   * 主键
   */
  id: number;
  menus: string[];
  /**
   * 员工姓名
   */
  name: string;
  /**
   * 用户权限集合
   */
  permissions: string[];
  /**
   * 用户的角色id
   */
  roleId: number;
  /**
   * 用户角色名称
   */
  roleName: string;
}
