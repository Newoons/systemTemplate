import axios from "axios";
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { message } from "ant-design-vue";

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api", // 从环境变量获取API基础URL
  timeout: 15000, // 请求超时时间
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在请求发送前做一些处理
    const token = localStorage.getItem("token");
    if (token) {
      // 让每个请求携带token
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error) => {
    // 处理请求错误
    console.error("请求错误：", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;

    // 根据自定义错误码判断请求是否成功
    if (res.code && res.code !== 200) {
      // 处理业务错误
      message.error(res.message || "请求失败");

      // 401: 未登录或token过期
      if (res.code === 401) {
        // 清除用户信息并重定向到登录页
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

      return Promise.reject(new Error(res.message || "请求失败"));
    } else {
      // 请求成功
      return res;
    }
  },
  (error) => {
    // 处理HTTP错误
    let errorMessage = "网络错误，请稍后重试";

    if (error.response) {
      // 根据HTTP状态码定制错误信息
      switch (error.response.status) {
        case 400:
          errorMessage = "请求错误";
          break;
        case 401:
          errorMessage = "未授权，请重新登录";
          // 清除用户信息并重定向到登录页
          localStorage.removeItem("token");
          window.location.href = "/login";
          break;
        case 403:
          errorMessage = "拒绝访问";
          break;
        case 404:
          errorMessage = "请求的资源不存在";
          break;
        case 500:
          errorMessage = "服务器错误";
          break;
        default:
          errorMessage = `连接错误 ${error.response.status}`;
      }
    } else if (error.service) {
      // 请求已发出但未收到响应
      errorMessage = "服务器无响应";
    }

    message.error(errorMessage);
    console.error("响应错误：", error);
    return Promise.reject(error);
  }
);

// 定义通用请求方法
export const http = {
  get<T = any>(url: string, params?: object): Promise<T> {
    return service({
      method: "get",
      url,
      params,
    });
  },

  post<T = any>(url: string, data?: object): Promise<T> {
    return service({
      method: "post",
      url,
      data,
    });
  },

  put<T = any>(url: string, data?: object): Promise<T> {
    return service({
      method: "put",
      url,
      data,
    });
  },

  delete<T = any>(url: string, params?: object): Promise<T> {
    return service({
      method: "delete",
      url,
      params,
    });
  },
};
// export default service;
