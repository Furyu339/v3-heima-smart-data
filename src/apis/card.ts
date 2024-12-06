import type { CardListData, CardListParams, CardParams } from "@/types/card";
import { request } from "@/utils/reuqest";

/**
 * 获取月卡列表
 * @param { page, pageSize} params
 * @returns
 */
export const getCardListAPI = (params: CardListParams) => {
  return request<CardListData>("/parking/card/list", "GET", params);
};
/**
 * 新增月卡
 * @data
 * @returns
 */
export const createCardAPI = (data: CardParams) => {
  return request('/parking/card', 'POST', data)
}