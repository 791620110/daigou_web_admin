<template>
  <div>
  <Breadcrumb>
    <BreadcrumbItem>首页</BreadcrumbItem>
    <BreadcrumbItem>修改密码</BreadcrumbItem>
  </Breadcrumb>
  <Form ref="form" :model="form" style="margin-top: 20px" :rules="ruleValidate">
    <FormItem label="旧密码" prop="oldpassword">
      <Input v-model="form.oldpassword" placeholder="请输入旧密码" type="password"></Input>
    </FormItem>
    <FormItem label="新密码" prop="newpassword">
      <Input v-model="form.newpassword" placeholder="请输入新密码" type="password"></Input>
    </FormItem>
    <FormItem label="重复新密码" prop="resetNewpassword" >
      <Input v-model="form.resetNewpassword" placeholder="请再次输入新密码" type="password"></Input>
    </FormItem>
    <Col span="24">
    <Button type="primary" style="margin-bottom: 10px" @click="onSubmit()">提交</Button>
    </Col>
  </Form>
  </div>
</template>
<script>
  import * as api from "../api"
  import swal from 'sweetalert2'
  export  default{
    data(){
      return {
        form: {
          oldpassword: '',
          newpassword: '',
          resetNewpassword: ''
        },
        ruleValidate: {
          oldpassword: [
            {required: true, message: '旧密码不能为空', trigger: 'change'}
          ],
          newpassword: [
            {required: true, message: '新密码不能为空', trigger: 'blur'},
            {type: "string", min: 6, message: '密码不能少于6个字符', trigger: 'blur'}
          ],
          resetNewpassword: [
            {required: true, message: '重复新密码不能为空', trigger: 'blur'},
            {type: "string", min: 6, message: '密码不能少于6个字符', trigger: 'blur'}
          ],
        },
      }
    },
    methods: {
      onSubmit(){
        let isValid = true;
        this.$refs['form'].validate(function (valid) {
          if (!valid) {
            isValid = valid;
            return;
          }
        })
        if (!isValid) {
          return;
        }
        if(this.form.newpassword != this.form.resetNewpassword){
          swal({text: '您输入的两次密码不一致', type: 'error', showCancelButton: false, width: 300}).then((isConfirm) => {});
          return;
        }
        let params = {
          oldpassword:this.form.oldpassword,
          newpassword:this.form.newpassword
        };
        this.$api.doResetPwdLogin(params).then(res => {
          if (res.status == "S") {
            swal({text: '操作成功!', type: 'success', showCancelButton: false, width: 300}).then((isConfirm) => {
              this.form={
                oldpassword: '',
                newpassword: '',
                resetNewpassword: ''
              }
            });
          } else {
            swal({text: res.message, type: 'error', showCancelButton: false, width: 300}).then((isConfirm) => {});
          }
        })
      }
    }
  }
</script>
