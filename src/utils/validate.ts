export const validMobile = (rule: any, mobile: any, callback: any) => {
  if (/^1[3-9]\d{9}$/.test(mobile)) {
    callback();
  } else {
    callback("请输入正确手机号");
  }
};
