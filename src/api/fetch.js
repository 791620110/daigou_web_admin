// 导入模块
import Vue from "vue";
import axios from 'axios';
import iview from "iview";
import vue from "vue";
import store from "../store";
import VueRouter from "vue-router";
import routeConfig from "../router";
import { SERVER_BASE_URL } from './config'
import * as types from "../store/mutation-types";

axios.defaults.timeout = 60000;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.baseURL = SERVER_BASE_URL;

const router = new VueRouter({
	routes: routeConfig,
})

let callbackFF = () => {
	store.commit(types.LOGOUT)
	router.push({path: '/login'})
}
export default function fetch (options) {

  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: SERVER_BASE_URL,
      headers: {}
    })
    // http request 拦截器
    instance.interceptors.request.use(
      config => {
    	  config.headers._token = localStorage.getItem("token");
        if(config.url.indexOf("__spin__")==-1){
          iview.Spin.show()
        }
    	  return config
      },
      err => {
        return Promise.reject(err)
      })

    // http response 拦截器
    instance.interceptors.response.use(
      response => {
    	  localStorage.setItem("token",response.headers['_token']);
        iview.Spin.hide()

    	  return response
      },
      error => {
    	  iview.Spin.hide()
        if (error) {
           switch (error.response.status) {
	           case 401:
	        	   iview.Modal.error({
	        		    title: '错误信息',content: '您登录超时， 请重新登录',onOk:callbackFF,width:360
	        		});
	               break;
	           default:
	        	   iview.Modal.error({title: '错误信息',content: '系统错误， 请稍后重试',width:360});;
           }
        }
        return Promise.reject(error) // 返回接口返回的错误信息
      })
    // 请求处理
    instance(options)
      .then((res) => {
    	  if(res && res.data){
    		  resolve(res.data)
    	  }
    	  return false
      }).catch((error) => {
        reject(error)
      })
  })
}
