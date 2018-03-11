import fetch from '../fetch.js'
import apiConfig from '../apiConfig.js'

export const doMemberList = params => {
  let startIndex = params["startIndex"];
  let endIndex   = params["endIndex"];
  let memeberName = params["memeberName"];
  let memberPhone = params["memberPhone"];
  let memberEmail = params["memberEmail"];

  return fetch({
    url: apiConfig.SYS_MEMBER_LIST + "?startIndex=" + startIndex + "&endIndex=" + endIndex 
    +  "&memeberName=" + memeberName + "&memberEmail=" + memberEmail+ "&memberPhone=" + memberPhone,
    method: 'post',
  })
}


export const doMemberUserSave = (params,insertOrUpdate) => {
  return fetch({
    url: apiConfig.SYS_MEMBER_SAVE + "?insertOrUpdate=" + insertOrUpdate ,
    method: 'post',
    data: params
  })
}


export const doMemberDel = (memberId) => {
  return fetch({
    url: apiConfig.SYS_MEMBER_DEL + "?memberId=" + memberId ,
    method: 'post',
  })
}

export const doMemberRoles = () => {
  return fetch({
    url: apiConfig.SYS_MEMBER_ROLES ,
    method: 'post',
  })
}

export const doMemberRolesBind = (param) => {
  return fetch({
    url: apiConfig.SYS_MEMBER_ROLES_BIND ,
    method: 'post',
    data:param
  })
}


export const doMemberInfo = params => {

  return fetch({
    url: apiConfig.SYS_MEMBER_COMMON + params+"?__spin__",
    method: 'get',
  })
}



























