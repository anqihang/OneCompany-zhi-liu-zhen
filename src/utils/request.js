import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";
import Vue from 'vue';
// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  baseURL: "http://192.168.1.118:8000", // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
});
// http://192.168.1.118:8000/user/user_login
// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers["Token"] = getToken();
    }
    return config;
  },
  (error) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    // console.log(response);
    if (response.data.code == 1003) {
      Message({
        message:response.data.msg,
        type:'error'
      })
      store.dispatch('user/logout').then(res=>{
        location.reload(true);
      })
      // localStorage.removeItem("Token");
      //   localStorage.removeItem("per");
      //   // must remove  token  first
      //   resetRouter();
        // History.push("/login");
        // History.replace('/login')
        // location.reload()
    }
    let res = JSON.parse(response.data);
    // let r = JSON.stringify(response.data)
    // console.log(r);
    // let  res = JSON.parse(r);
    // res = JSON.parse(res);
    console.log(res);
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      // Message({
      //   message: res.msg,
      //   type: "error",
      //   duration: 5 * 1000,
      // });

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 10500 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm(
          "You have been logged out, you can cancel to stay on this page, or log in again",
          "Confirm logout",
          {
            confirmButtonText: "Re-Login",
            cancelButtonText: "Cancel",
            type: "warning",
          }
        ).then(() => {
          store.dispatch("user/resetToken").then(() => {
            location.reload();
          });
        });
      }
      return Promise.reject(new Error(res.msg || "Error"));
    } else {
      return res;
    }
  },
  (error) => {
    console.log("err" + error); // for debug
    Message({
      message: error.msg,
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

export default service;
