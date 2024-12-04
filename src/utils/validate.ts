export const isExternal = (path: string) => {
  return /^(https?:|mailto:|tel:)/.test(path);
};

export const validUsername = (str: string) => {
  const valid_map = ["admin", "editor"];
  return valid_map.indexOf(str.trim()) >= 0;
};

export const validMobile = (mobile: string) => {
  return /^1[3-9]\d{9}$/.test(mobile);
};
