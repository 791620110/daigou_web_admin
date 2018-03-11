import fetch from '../fetch.js'
import apiConfig from '../apiConfig.js'

export const doParamList = params => {
  let startIndex = params["startIndex"];
  let endIndex   = params["endIndex"];
  let category   = params["category"];
  let refKey   = params["refKey"];
  return fetch({
    url: apiConfig.SYS_PARAM_LIST + "?startIndex=" + startIndex + "&endIndex=" + endIndex
    	+ "&category=" + category + "&refKey=" +refKey,
    method: 'post',
  })
}

export const doParamSave = params => {
  return fetch({
    url: apiConfig.SYS_PARAM_SAVE,
    method: 'post',
    data: params
  })
}

export const doParamDel = params => {
  let refId = params["refId"];
  return fetch({
    url: apiConfig.SYS_PARAM_DEL + refId,
    method: 'delete',
  })
}

export const doParamInfo = params => {
  let refId = params["refId"];
  return fetch({
    url: apiConfig.SYS_PARAM_INFO + refId,
    method: 'get',
  })
}


export const getParamCategory = params => {
  let category = params["category"];
  let showLoading = params["showLoading"];
  return fetch({
    url: apiConfig.SYS_PARAM_CATEGORY + category+((showLoading=='Y')?"":"?__spin__"),
    method: 'get',
  })
}

