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
/**
 * empty object
 */
export interface EnterpriseParams {
  /**
   * 上传文件id
   */
  businessLicenseId: string;
  /**
   * 上传文件rl
   */
  businessLicenseUrl: string;
  /**
   * 企业联系人
   */
  contact: string;
  /**
   * 企业联系方式
   */
  contactNumber: string;
  /**
   * 行业编号
   */
  industryCode: string;
  /**
   * 企业法人
   */
  legalPerson: string;
  /**
   * 企业名称
   */
  name: string;
  /**
   * 注册地址
   */
  registeredAddress: string;

  id?: string;
}

export interface EnterpriseFile {
  /**
   * 主键id
   */
  id: string;
  /**
   * 上传文件名称
   */
  name: string;
  /**
   * 上传附件url
   */
  url: string;
}
export interface EnterpriseDetail {
  /**
   * 上传文件id
   */
  businessLicenseId: string;
  /**
   * 上传的营业执照名字
   */
  businessLicenseName: string;
  /**
   * 上传文件url
   */
  businessLicenseUrl: string;
  /**
   * 企业联系人
   */
  contact: string;
  /**
   * 企业联系方式
   */
  contactNumber: string;
  /**
   * 企业id
   */
  id: number;
  /**
   * 行业编号
   */
  industryCode: string;
  /**
   * 行业名称
   */
  industryName: string;
  /**
   * 企业法人
   */
  legalPerson: string;
  /**
   * 企业名称
   */
  name: string;
  /**
   * 注册地址
   */
  registeredAddress: string;
  rent: Rent[];
}

export interface Rent {
  /**
   * 租赁合同id
   */
  contractId: number;
  /**
   * 租赁合同名称
   */
  contractName: string;
  /**
   * 租赁合同url
   */
  contractUrl: string;
  /**
   * 信息录入时间
   */
  createTime: string;
  /**
   * 租赁截止时间
   */
  endTime: string;
  /**
   * 租赁主键
   */
  id: number;
  /**
   * 楼宇名称
   */
  name: string;
  /**
   * 租赁起始时间
   */
  startTime: string;
  /**
   * 合同的租赁状态0待生效1生效中2已到期3已退租。
   * 生效中，只能续签一次，续签后，续签的合同退租后，才可以退租
   */
  status: number;
}
