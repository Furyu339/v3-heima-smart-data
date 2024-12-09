import type {
  CreateRentAPIParams,
  Datum,
  EnterpriseDetail,
  EnterpriseFile,
  EnterpriseListData,
  EnterpriseListParams,
  EnterpriseParams,
  Industry,
  Rent,
} from "@/types/enterprise";
import { request, service } from "@/utils/reuqest";

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
/**
 * 创建公司
 * @param {*} data
 * @returns
 */
export const createEnterpriseAPI = (data: EnterpriseParams) => {
  return request("/park/enterprise", "POST", data);
};
/**
 * 获取企业详情
 * @param {*} id
 * @returns
 */
export const getEnterpriseDetailAPI = (id: string) => {
  return request<EnterpriseDetail>(`/park/enterprise/${id}`);
};
/**
 * 更新企业
 * @param {*} data
 * @returns
 */
export const updateEnterpriseAPI = (data: EnterpriseParams) => {
  return request("/park/enterprise", "PUT", data);
};
/**
 * 删除企业
 * @param {*} id
 * @returns
 */
export const delEnterpriseAPI = (id: string) => {
  return request(`/park/enterprise/${id}`, "DELETE");
};
/**
 * 获取空置中楼宇列表（未租赁）
 * @param {*}
 * @returns
 */
export const getRentBuildListAPI = () => {
  return request<{ id: string; name: string }[]>("/park/rent/building");
};
/**
 * 给当前企业添加合同
 * @param {CreateRentAPIParams} data
 * @returns
 */
export const createRentAPI = (data: CreateRentAPIParams) => {
  return request("/park/enterprise/rent", "POST", data);
};

/**
 * 获取企业下合同列表
 * @param {string} id
 * @returns
 */
export const getRentListAPI = (id: string) => {
  return request<Datum[]>(`/park/enterprise/rent/${id}`);
};
/**
 * 退租
 * @param {string} rentId
 * @returns
 */
export const outRentAPI = (rentId: string) => {
  return request(`/park/enterprise/rent/${rentId}`, "PUT");
};

/**
 * 下载合同文件
 */
export const downloadContract = (id: string) => {
  return service<null, Blob>({
    url: `/download/${id}`,
    // method: 'POST',
    responseType: "blob", // axios 会把响应的文件流格式化成 Blob 数据块对象
  });
};
