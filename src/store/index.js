import Vue from "vue";
import Vuex from "vuex";
import VueRouter from "vue-router";
import iview from "iview";
import * as types from "./mutation-types";
import apiConfig from '../api/apiConfig.js'
import routeConfig from "../router";
Vue.use(Vuex)
const router = new VueRouter({
	routes: routeConfig,
})
let callbackFF = () => {
	store.commit(types.LOGOUT)
	router.push({path: '/login'})
} 

const store = new Vuex.Store({
  strict: true,  // process.env.NODE_ENV !== 'production', 直接修改state 抛出异常

  getters: {
    loading: state => state.loading,
    menuList: state => state.menuList,
    sidebar: state => state.sidebar,
    userInfo:state => state.userInfo,
    device:state => state.device,
  },
  // modules: {
  //   app,
  //   menu
  // },
  state: {
    loading: false,
    menuList: {},
    sidebar: {
      collapsed: false,
      show:true,
    },
    device: {
      isMobile: false
    },
    userInfo:{userName:''}
  },
  mutations: {
    //只能同步的函数
    [types.TOGGLE_DEVICE] (state, isMobile) {
      state.device.isMobile = isMobile
    },
    [types.TOGGLE_LOADING] (state) {
      state.loading = !state.loading
    },
    [types.LOAD_MENU] (state, menu) {
      state.menuList = menu;
    },
    [types.SET_USER_INFO] (state, info) {
      state.userInfo = info;
    },
    [types.LOGOUT] (state) {
        state.userInfo={name:''};
        state.menuList = [];
        localStorage.removeItem("token");
    },
    [types.TOGGLE_SIDEBAR] (state, collapsed) {
      if (collapsed == null) collapsed = !state.sidebar.collapsed;
      state.sidebar.collapsed = collapsed;
    },
    [types.TOGGLE_SIDEBAR_SHOW] (state,show) {
      if (show == null) state.sidebar.show = !state.sidebar.show;
      else{
        state.sidebar.show = show;
      }
    },
  }, actions: {
    //异步的函数

    toggleLoading: ({commit}) => commit(types.TOGGLE_LOADING),
    loadMenuList: ({commit}) => {
      Vue.axios.defaults.headers.common['_token'] = localStorage.getItem("token");
      Vue.axios.get(apiConfig.PROFILE).then(res => {
    	   commit(types.SET_USER_INFO, res.data.result.user);
         commit(types.LOAD_MENU, res.data.result.menulist);
      }).catch(
    	exp => {
    		if (exp) { 
 	           switch (exp.response.status) {
 		           case 401:	        	   
 		        	   iview.Modal.error({
 		        		    title: '错误信息',content: '您登录超时， 请重新登录',onOk:callbackFF,width:360
 		        		});
 		               break;
 		           default:
 		        	   iview.Modal.error({title: '错误信息',content: '系统错误， 请稍后重试',width:360});;
 	           }
 	        }
    	}
      );
    }
  },
})

export default store
