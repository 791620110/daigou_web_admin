<template lang="html" >
  <div style="border-color: #ffffff">
  <div class="title-logo"><img src="../../static/img/logo.png" class="pic"></div>
    <div class="bg">
      <el-col :span="6" :offset="16">
        <div class="login">
          <div class="login-form">
            <div class="card-block">
              <h2 style="color: #5194d9;margin-bottom: 20px;line-height: 2.25rem;">登录</h2>

              <div class="input-group m-b-1">
                <input type="text" class="form-control" placeholder="用户名" v-model="form.username">
              </div>
              <div class="input-group m-b-2">
                <input type="password" class="form-control" placeholder="密码" v-model="form.password"
                       @keyup.enter="login">
              </div>
              <div class="row">
                <el-row>
                  <i-button type="success" long @click="login" style="background-color: #5194d9;line-height: 2.25rem;" >登录</i-button>
                </el-row>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </div>
    <div class="copy-right">CopyRight@2017-2018 济南同科医药物流有限公司</div>
  </div>
</template>
<script>
  import * as types from '../store/mutation-types'
  import * as api from "../api/apiConfig"
  import auth from '../auth'
  import { mapGetters, mapActions, mapMutations } from 'vuex'
  import swal from 'sweetalert2'

  export default {
    name: 'login',
    data() {
      return {
        form: {
          username: 'swagger',
          password: '123456'
        }
      }
    },
    components: {},
    methods: {
      ...mapMutations({
        setUserInfo: types.SET_USER_INFO
      }),
      ...mapActions({
        loadMenuList: 'loadMenuList' //映射 this.load() 为 this.$store.dispatch('loadMenuList')
      }),
      login(){
        this.$api.login(this.form).then(res => {
        	if(res.status == "S"){
        	  	localStorage.setItem("token",res.result._token);
        	  	this.setUserInfo(res.result);
	          	this.$router.push('/')
	        }else{
            swal({text: '登录失败['+res.result.error+']',type: 'error',showCancelButton: false,width:300});
	        }
        })
      }
    }
  }
</script>

<style>
  .title-logo{
    height: 8rem;
    position: relative
  }
  .title-logo .pic{
    position:absolute;
    padding-top: 0px;
    margin-left: 100px;
    margin-bottom: 10px;
    top:50%;
    transform: translateY(-50%);
  }

  .bg{
    background-image: url(../../static/img/login.png);
    background-repeat:no-repeat;
    background-size:100% 100%;
    -moz-background-size:100% 100%;
    height: 35rem;
    width: 100%;
  }
  .login {
    margin-top: 70px;
    width: 100%;

    margin-right: auto !important;
    margin-left: auto !important;
    display: table;
    table-layout: fixed;
    border-radius: 6px;
  }

  .login .el-button {
    border-radius: 0;
  }

  .login .el-button.forgot, .login .el-button.forgot:hover {
    border: none;

  }

  .login .login-form {
    background-color: #FFFFFF;
    display: inline-block;
    width: 60%;
    display: table-cell;
    height: 25rem;
    border-radius: 6px;
    outline:none;

  }

  .login .login-form .card-block {
    margin: 35px;

  }

  .login .login-form .card-block p {
    margin: 15px 0;
  }

  .input-group {
    width: 100%;
    display: table;
    border-collapse: separate;
    margin-bottom: 20px !important;
  }

  .input-group, .input-group-btn, .input-group-btn > .btn, .navbar {
    position: relative;
  }

  .input-group-addon:not(:last-child) {
    border-right: 0;
  }

  .input-group-addon, .input-group-btn {
    min-width: 40px;
    white-space: nowrap;
    vertical-align: middle;
    width: 1%;
  }

  .btn-link:focus, .btn-link:hover {
    color: #167495;
    text-decoration: underline;
    background-color: transparent;
  }

  .btn-link, .btn-link:active, .btn-link:focus, .btn-link:hover {
    border-color: transparent;
  }

  .btn.focus, .btn:focus, .btn:hover {
    text-decoration: none;
  }

  .input-group-addon {
    padding: .5rem .75rem;
    margin-bottom: 0;
    font-size: .875rem;
    font-weight: 400;
    line-height: 1.75rem;
    color: #607d8b;
    text-align: center;
    background-color: #cfd8dc;
    border: 1px solid rgba(0, 0, 0, .15);
  }

  .input-group .form-control, .input-group-addon, .input-group-btn {
    display: table-cell;
  }

  .input-group .form-control {
    position: relative;
    z-index: 2;
    float: left;
    width: 100%;
    margin-bottom: 0;
    border-radius: 6px;
    border: 1px solid #5194d9;
  }

  .form-control {
    width: 100%;
    padding: .5rem .75rem;
    font-size: .875rem;
    line-height: 2.25rem;
    color: #607d8b;
    background-color: #fff;
    background-image: none;
    background-clip: padding-box;
    border: 1px solid rgba(0, 0, 0, .15);
    transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
  }

  .form-control:focus{
    border: none;
  }

  .login .login-form .card-block .row {
    display: block;
    margin: 15px 0;
  }

  .login .login-register {
    display: table-cell;
    background-color: #20a8d8;
    width: 40%;
    color: #fff;
  }

  .login .login-register .card-block {
    text-align: center !important;
    margin: 30px;
  }

  .login .login-register .card-block p {
    text-align: left !important;
    margin: 15px 0;
    height: 100px;
  }

  .copy-right {
    text-align: center;
    margin-top: 20px;
  }
</style>
