export interface CardListParams {
  /**
   * 状态 '0':可用，'1':已过期
   */
  cardStatus?: string;
  /**
   * 车牌号
   */
  carNumber?: string;
  /**
   * 页数
   */
  page: number;
  /**
   * 条数
   */
  pageSize: number;
  /**
   * 车主姓名
   */
  personName?: string;
}

/**
 * 数据
 */
export interface CardListData {
  rows: Card[];
  /**
   * 数据条数
   */
  total: number;
}

export interface Card {
  /**
   * 车辆品牌
   */
  carBrand: string;
  /**
   * 月卡状态 0可用，1已过期
   */
  cardStatus: number;
  /**
   * 车牌号
   */
  carNumber: string;
  /**
   * 月卡车辆id
   */
  id: number;
  /**
   * 车主姓名
   */
  personName: string;
  /**
   * 联系方式
   */
  phoneNumber: string;
  /**
   * 剩余有效天数
   */
  totalEffectiveDate: number;
}
/**
 * 月卡参数接口
 */
export interface CardParams {
  /** 车主姓名 */
  personName: string;
  /** 联系方式 */
  phoneNumber: string;
  /** 车牌号码 */
  carNumber: string;
  /** 车辆品牌 */
  carBrand: string;
  /** 车辆信息id */
  carInfoId?: number;
}

export interface CardDetail {
  /**
   * 车辆品牌
   */
  carBrand: string;
  /**
   * 最近一次月卡结束时间
   */
  cardEndDate: string;
  /**
   * 最近一次月卡开始时间
   */
  cardStartDate: string;
  /**
   * 名下月卡有效状态 0有效，1已过期
   */
  cardStatus: number;
  /**
   * 车辆信息id
   */
  carInfoId: number;
  /**
   * 车牌号
   */
  carNumber: string;
  /**
   * 支付金额
   */
  paymentAmount: number;
  /**
   * 支付方式 支付方式,支付宝:Alipay,微信:WeChat,线下:Cash
   */
  paymentMethod: PaymentMethod;
  /**
   * 车主姓名
   */
  personName: string;
  /**
   * 联系方式
   */
  phoneNumber: PhoneNumber;
  /**
   * 充值记录id
   */
  rechargeId: number;
  [property: string]: any;
}

/**
 * 缴费信息表单接口
 */
export interface FeeForm {
  rechargeId?: number; // 缴费ID（可选）
  payTime: [string, string]; // 支付时间范围
  paymentAmount?: number; // 支付金额
  paymentMethod: string; // 支付方式
}
