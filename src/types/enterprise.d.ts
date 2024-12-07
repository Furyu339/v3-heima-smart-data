export interface EnterpriseListParams {
  /**
   * 根据企业名称模糊搜索
   */
  name?: string;
  /**
   * 不传值默认是1
   */
  page?: number;
  /**
   * 不传值，默认是10
   */
  pageSize?: number;
}

/**
 * 报文数据
 */
export interface EnterpriseListData {
  /**
   * 分页数据
   */
  rows: Enterprise[];
  /**
   * 总记录数
   */
  total: number;
}

export interface Enterprise {
  /**
   * 企业联系人
   */
  contact: string;
  /**
   * 企业联系电话
   */
  contactNumber: string;
  /**
   * 是否是演示数据，1是0不是，演示数据不可以删除和编辑
   */
  demoFlag: number;
  /**
   * 企业id
   */
  id: number;
  /**
   * 企业名称
   */
  name: string;
}
export interface Industry {
  /**
   * 行业code
   */
  industryCode: number;
  /**
   * 行业名称
   */
  industryName: string;
}
