import axios from 'axios';
import { ElMessage } from 'element-plus';
//60.205.178.180
//127.0.0.1

// 图片上传用到的域名
export const host = 'http://120.46.201.4:10203';

// const request = {
//   admin: createAPI('http://localhost:8080/api'),
//   course: createAPI('http://localhost:8082/api'),
//   evaluation: createAPI('http://localhost:8083/api'),
//   page: createAPI('http://120.46.201.4:10203/page'),
//   fork: createAPI('http://120.46.201.4:10203/fork'),
//   common: createAPI('http://120.46.201.4:10203/common'),
//   term: createAPI('http://120.46.201.4:10203/term')
// };
// 图片上传用到的域名
// export const host = 'http://120.46.201.4:10203';

// const request = {
//   admin: createAPI('http://localhost:8080/api'),
//   course: createAPI('http://localhost:8082/api'),
//   evaluation: createAPI('http://localhost:8083/api'),
//   page: createAPI('http://120.46.201.4:10203/page'),
//   fork: createAPI('http://120.46.201.4:10203/fork'),
//   common: createAPI('http://120.46.201.4:10203/common'),
//   term: createAPI('http://120.46.201.4:10203/term')
// };

// const request = {
//   admin: createAPI('http://120.46.201.4:9000/api'),
//   course: createAPI('http://120.46.201.4:9000/api'),
//   evaluation: createAPI('http://120.46.201.4:9000/api'),
//   page: createAPI('http://120.46.201.4:10203/page'),
//   fork: createAPI('http://120.46.201.4:10203/fork'),
//   common: createAPI('http://120.46.201.4:10203/common'),
//   term: createAPI('http://120.46.201.4:10203/term')
// };

const request = {
  admin: createAPI('http://120.46.201.4:8080/api'),
  course: createAPI('http://120.46.201.4:8082/api'),
  evaluation: createAPI('http://120.46.201.4:8083/api'),
  page: createAPI('http://120.46.201.4:10203/page'),
  fork: createAPI('http://120.46.201.4:10203/fork'),
  common: createAPI('http://120.46.201.4:10203/common'),
  term: createAPI('http://120.46.201.4:10203/term')
};

// 60.205.178.180
function createAPI(url) {
  // 构建不同端口的异步请求数据
  const axiosData = axios.create({
    baseURL: url
    // timeout: 70000
  });

  // request 拦截器
  // 可以自请求发送前对请求做一些处理
  // 比如统一加token，对请求参数统一加密
  axiosData.interceptors.request.use(
    config => {
      if (!(config.data instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json;charset=utf-8';
      }
      const token = sessionStorage.getItem('token'); // 示例获取 token 的代码
      console.log(token);
      if (token) {
        config.headers['token'] = token; // 设置请求头中的 token
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  // response 拦截器
  // 可以在接口响应后统一处理结果
  axiosData.interceptors.response.use(
    response => {
      let res = response.data;
      // 课程、课堂、问卷、实验、组卷异常提示
      if (res?.result === false) {
        ElMessage.error(res.message);
      }
      // console.log('res----', res)
      // 如果是返回的文件
      if (response.config.responseType === 'blob') {
        return res;
      }
      // 兼容服务端返回的字符串数据
      if (typeof res === 'string') {
        res = res ? JSON.parse(res) : res;
      }
      return res;
    },
    error => {
      console.log('err' + error); // for debug
      return Promise.reject(error);
    }
  );

  return axiosData;
}

export default request;
