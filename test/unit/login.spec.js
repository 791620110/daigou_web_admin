import Vue from "vue";
import login from '../../src/pages/login.vue'

describe('test login.vue',() =>{
  it('组件加载后,应该是login',() =>{
    let vm = new Vue(login).$mount();
    expect(vm.title).toEqual('login');
  });
});
