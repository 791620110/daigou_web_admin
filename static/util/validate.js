const validatePhone = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入手机号码'));
  } else {
    let regExp = /^1(3|4|5|7|8)\d{9}$/;
    if (regExp.test(value) == false) {
      callback(new Error('请输入正确的手机号码'));
    }
    callback();
  }
};

const validateEmail = (rule, value, callback) => {

  if (value === '') {
    callback();
  } else {

    let regExp = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if (regExp.test(value) == false) {
      callback(new Error('请输入正确的电子邮箱'));
    }
    callback();
  }
};


const validateRealName = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入姓名'));
  } else {
    let regExp = /^.{2,9}$/;
    if (regExp.test(value) == false) {
      callback(new Error('请输入2-9个字符'));
    }
    callback();
  }
};

const validateUserName = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入用户名'));
  } else {
    let regExp = /^[A-Za-z0-9_]{2,15}$/;
    if (regExp.test(value) == false) {
      callback(new Error('请输入2-15字母或数字'));
    }
    callback();
  }
};

const validatePostCode = (rule, value, callback) => {
    let regExp = /[1-9]\d{5}(?!\d)/;
    if(value === '') {
      callback();
    }else {
      if (regExp.test(value) == false) {
        callback(new Error('请输入正确的6位邮编'));
      }
    callback();
   }
};

const validatCode = (rule, value, callback) => {
  let regExp = /^[A-Za-z0-9]{2,30}$/;
  if (value === '') {
    callback();
  }else{
    if(regExp.test(value) == false){
      callback(new Error('请输入正确2-30位字母或数字'));
    }
    callback();
  }
};




const validate = {
  validatePhone,validateEmail,validateRealName,validateUserName,validatePostCode,validatCode
}

export default validate
