import type { CarListData, CarListParams } from "@/types/car";
import { request } from "@/utils/reuqest";

/**
 * 获取规则列表
 * @param { page, pageSize} params
 * @returns
 */
export const getRuleListAPI = (params: CarListParams) => {
  return request<CarListData>("parking/rule/list", "GET", params);
};
