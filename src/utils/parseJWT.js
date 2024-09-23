const parseJWT = token => {
  // 分割token
  const parts = token.split('.');

  if (parts.length !== 3) {
    throw new Error('Invalid JWT token');
  }

  // 解码 Payload 部分（第 2 部分）
  const base64Url = parts[1];

  // Base64 解码时需要将 '-' 替换为 '+'，将 '_' 替换为 '/'，并添加 '=' 进行补齐
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

  // 解码并解析成 JSON 对象
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
};

export default parseJWT;
