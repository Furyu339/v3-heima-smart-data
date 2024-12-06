import type {
  CardDetail,
  CardListData,
  CardListParams,
  CardParams,
} from "@/types/card";
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
export const getCardDetailAPI = (id: string) => {
  return request<CardDetail>(`/parking/card/detail/${id}`, "GET");
};

/**
 * 更新月卡
 * @param {*} data
 * @returns
 */
export const updateCardAPI = (data: CardParams) => {
  return request("/parking/card/edit", "PUT", data);
};
/**
 * 删除月卡
 * @param {*} id
 * @returns
 */
export const delCardAPI = (id: string) => {
  return request(`/parking/card/${id}`, "DELETE");
};
/**
 * 批量删除月卡
 * @param {*} ids [1,2,3]
 * @returns
 */
export const delAllCardAPI = (ids: number[]) => {
  return request(`/parking/card/${ids.join(",")}`, "DELETE");
};
