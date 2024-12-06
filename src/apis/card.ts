import type { CardDetail, CardListData, CardListParams, CardParams } from "@/types/card";
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
  return request("/parking/card", "POST", data);
};
/**
 * 获取月卡详情
 * @data
 * @returns
 */
export const  getCardDetailAPI = (id: string) => {
  return request<CardDetail>(`/parking/card/detail/${id}`, 'GET')
}

/**
 * 更新月卡
 * @param {*} data
 * @returns
 */
export const updateCardAPI = (data: CardParams) => {
  return request('/parking/card/edit', 'PUT', data)
}