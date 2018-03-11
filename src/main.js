
import 'babel-polyfill'
import 'eventsource-polyfill'
import Vue from "vue";
import frame from "./frame.vue";
import VueRouter from "vue-router";
import routeConfig from "./router";
import {sync} from "vuex-router-sync";
import store from "./store";
import axios from "axios";
import {TOGGLE_SIDEBAR,LOGOUT} from "./store/mutation-types";
import auth from "./auth";
import api from './api/index.js'
import iview from "iview"


//import 'iview/dist/styles/iview.css';
//import "sweetalert2/dist/sweetalert2.min.css"import '../static/util/validate.js';
import ElementUI from 'element-ui'
import VueLazyload from "vue-lazyload"
import VueProgressBar from "vue-progressbar";
import filters from "./filters";

import commonProperties from "./common/commonProperties.js"
import validate from "../static/util/index"

import elementDataset from "element-dataset"

Vue.use(commonProperties);
Vue.use(ElementUI);
Vue.use(iview);
Vue.use(api);
Vue.use(validate);
Vue.use(elementDataset);

Vue.use(VueLazyload, {
  preLoad: 1.3,
  attempt: 1
})


function getBaseUrl(url) {
  var reg = /^((\w+):\/\/([^\/:]*)(?::(\d+))?)(.*)/;
  reg.exec(url);
  return RegExp.$1;
}

// axios.defaults.baseURL = 'https://www.baidu.com';
axios.defaults.baseURL = getBaseUrl(window.location.href);
//axios.defaults.headers.common['authUid'] = auth.getUid();
//axios.defaults.headers.common['authSid'] = auth.getSid();

Vue.prototype.$http = axios
Vue.axios = axios


//加载路由中间件
Vue.use(VueRouter)

const options = {
  color: '#eeeeee',
  failedColor: '#874b4b',
  thickness: '2px',
  transition: {
    speed: '0.2s',
    opacity: '0.6s'
  },
  autoRevert: true,
  location: 'top',
  inverse: false
}

//定义路由
const router = new VueRouter({
  routes: routeConfig,
  //mode: 'history'
})

sync(store, router)




const {state} = store

router.beforeEach((route, redirect, next) => {

  if (state.device.isMobile && state.sidebar.opened) {
    store.commit(TOGGLE_SIDEBAR, false)
  }
  if (!auth.loggedIn() && route.path !== '/login') {
    next({
      path: '/login',
      query: {redirect: route.fullPath}
    })
  } else {
    next()
  }
})


// const nprogress = new NProgress({parent: '.nprogress-container'})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
  store,
  router,
  el: "#root",
  render: h => h(frame)
})

