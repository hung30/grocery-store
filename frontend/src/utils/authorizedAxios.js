import axios from "axios";
import { message } from "antd";
import { handleLogoutAPI, refreshTokenAPI } from "../apis/authApis";
import store from "./../redux/store";
import { logout } from "../redux/authSlice";

// Create an axios instance
let authorizedAxiosInstance = axios.create();

// time to wait for the response, otherwise cancel the request
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10;

authorizedAxiosInstance.defaults.withCredentials = true;

// interceptors config
// Add a request interceptor
authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

//phần hay....
// Khởi tạo một cái promise cho việc gọi api refresh-token
//Mục đích là khi nhận yêu cầu refresh token đầu tiên thì hold lại việc gọi api refresh token cho tới khi xong xuôi thì mới retry lại những api bị lỗi trước đó thay vì cứ thế gọi lại api refresh token liên tục với mỗi request lỗi
let refreshTokenPromise = null;

// Add a response interceptor
authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // xử lý refresh token tự động
    if (error.response?.status === 401) {
      handleLogoutAPI().then(() => {
        localStorage.removeItem("userInfo");

        store.dispatch(logout());

        window.location.href = "/login";
      });
    }

    const originalRequest = error.config;
    if (error.response?.status === 410 && originalRequest) {
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenAPI()
          .then((res) => {})
          .catch((_err) => {
            handleLogoutAPI().then(() => {
              localStorage.removeItem("userInfo");

              store.dispatch(logout());

              window.location.href = "/login";
            });

            return Promise.reject(_err);
          })
          .finally(() => {
            refreshTokenPromise = null;
          });
      }
      return refreshTokenPromise.then(() => {
        return authorizedAxiosInstance(originalRequest);
      });
    }

    if (error.response?.status !== 410) {
      message.error(error.response?.data?.message || error?.message);
    }

    return Promise.reject(error);
  }
);

export default authorizedAxiosInstance;
