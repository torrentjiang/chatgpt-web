// @ts-nocheck
import axios from "axios";
// import { message } from "antd";
// import { getToken } from '@/lib/auth'

// 创建axios实例
const service = axios.create({
  timeout: 5000,
});

// request interceptor request拦截器
service.interceptors.request.use(
  (config) => {
    config.headers["Accept"] = "application/json";
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

// response interceptor request拦截器
service.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.message.includes("timeout")) {
      // message.error();
      console.log("网络超时，请重试~");
      return Promise.reject(error);
    }
    return Promise.reject(error);
  },
);

export default service;
