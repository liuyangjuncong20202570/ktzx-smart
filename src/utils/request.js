import axios from 'axios'
//60.205.178.180
//127.0.0.1
const request = {
    admin: createAPI('http://127.0.0.1:8080/api'),
    course: createAPI('http://127.0.0.1:8082/api'),
    evaluation: createAPI('http://127.0.0.1:8083/api'),
}

// const request = {
//     admin: createAPI('http://60.205.178.180:8080/api'),
//     course: createAPI('http://60.205.178.180:8082/api'),
//     evaluation: createAPI('http://60.205.178.180:8083/api'),
// }


// 60.205.178.180
function createAPI(url) {   // 构建不同端口的异步请求数据
    const axiosData = axios.create({
        baseURL: url,
        timeout: 7000,
    });

    // request 拦截器
    // 可以自请求发送前对请求做一些处理
    // 比如统一加token，对请求参数统一加密
    axiosData.interceptors.request.use(config => {

        if (!(config.data instanceof FormData)) {
            config.headers['Content-Type'] = 'application/json;charset=utf-8';
        }
        const token = sessionStorage.getItem('token'); // 示例获取 token 的代码
        console.log(token)
        if (token) {
            config.headers['token'] = token;  // 设置请求头中的 token
        }
        return config
    }, error => {
        return Promise.reject(error)
    });

    // response 拦截器
    // 可以在接口响应后统一处理结果
    axiosData.interceptors.response.use(
        response => {
            let res = response.data;
            // 如果是返回的文件
            if (response.config.responseType === 'blob') {
                return res
            }
            // 兼容服务端返回的字符串数据
            if (typeof res === 'string') {
                res = res ? JSON.parse(res) : res
            }
            return res;
        },
        error => {
            console.log('err' + error) // for debug
            return Promise.reject(error)
        }
    )

    return axiosData;
}

export default request;

