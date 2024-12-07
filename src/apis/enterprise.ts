import type {
  EnterpriseFile,
  EnterpriseListData,
  EnterpriseListParams,
  Industry,
} from "@/types/enterprise";
import { request } from "@/utils/reuqest";

/**
 * 获取企业列表
 * @param { page, pageSize} params
 * @returns
 */
export const getEnterpriseListAPI = (params: EnterpriseListParams) => {
  return request<EnterpriseListData>("/park/enterprise", "GET", params);
};
/**
 * 获取行业列表
 * @returns
 */
export const getIndustryListAPI = () => {
  return request<Industry[]>("/park/industry");
};
/**
 * 上传合同
 * @returns
 */
export const uploadAPI = (data: FormData) => {
  return request<EnterpriseFile>("/upload", "POST", data);
};
