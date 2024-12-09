export interface CarListParams {
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
export interface CarListData {
  rows: Car[];
  /**
   * 数据条数
   */
  total: number;
}

export interface Car {
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
  id: string;
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
