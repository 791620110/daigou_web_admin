import fetch from '../fetch.js'
import apiConfig from '../apiConfig.js'

export const doUserList = params => {
  let startIndex = params["startIndex"];
  let endIndex   = params["endIndex"];
  let username   = params["username"];
  let status   = params["status"];
  let userType   = params["userType"];
  return fetch({
    url: apiConfig.SYS_USER_LIST + "?startIndex=" + startIndex + "&endIndex=" + endIndex
    	+ "&username=" + username + "&status=" + status+ "&userType=" + userType,
    method: 'get',
  })
}

export const doUserSave = params => {
  return fetch({
    url: apiConfig.SYS_USER_SAVE,
    method: 'post',
    data: params
  })
}

export const doUserDel = params => {
  let userId = params["userId"];
  return fetch({
    url: apiConfig.SYS_USER_DEL + userId,
    method: 'delete',
  })
}

export const doUserInfo = params => {
  let userId = params["userId"];
  return fetch({
    url: apiConfig.SYS_USER_INFO + userId,
    method: 'get',
  })
}

export const doUserRoles = (params) => {
  return fetch({
    url: apiConfig.SYS_ROLE_LIST +(!params?"":"?__spin__") ,
    method: 'get',
  })
}

export const doBindRoles = params => {
  let userId = params["userId"];
  let roleList = params["roleList"];
  return fetch({
    url: apiConfig.SYS_USER_BIND_ROLES + userId + "/roles?roleList=" + roleList,
    method: 'post'
  })
}

export const doUserRoleInfo = params => {
  let userId = params["userId"];
  return fetch({
    url: apiConfig.SYS_USER_ROLE_INFO + userId + "/roles",
    method: 'get',
  })
}


export const doResetPwd = params => {
  return fetch({
    url: apiConfig.SYS_USER_RESET_PWD,
    method: 'post',
    data: params
  })
}

export const doResetPwdLogin = params => {
  let oldpassword = params["oldpassword"];
  let newpassword = params["newpassword"];
  return fetch({
    url: apiConfig.SYS_USER_RESET_PWD_LOIGN + "?oldpassword=" + oldpassword + "&newpassword=" + newpassword,
    method: 'post',
    data: params
  })
}

