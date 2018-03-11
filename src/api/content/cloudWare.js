import fetch from '../fetch.js'
import apiConfig from '../apiConfig.js'

export const doCloudWareList = params => {
  let startIndex = params["startIndex"];
  let endIndex   = params["endIndex"];
  let whName = params["whName"];
  let customerName = params["customerName"];
  let asCloud = params["asCloud"];
  return fetch({
    url: apiConfig.CUS_CLOUDWARE_LIST + "?startIndex=" + startIndex + "&endIndex="
     + endIndex  + "&whName=" + whName + "&customerName=" + customerName+ "&asCloud=" + asCloud,
    method: 'post',
  })
}

export const doCloudWareSave = (params,isAdd,customerCode,whOwnerCode) => {
  return fetch({
    url: apiConfig.CUS_CLOUDWARE_SAVE + "?isAdd=" + isAdd + "&customerCode=" + customerCode+ "&whOwnerCode=" + whOwnerCode,
    method: 'post',
    data: params
  })
}

export const doCloudWareDel = whCode => {
  return fetch({
    url: apiConfig.CUS_CLOUDWARE_DEL + whCode,
    method: 'delete',
  })
}

export const doWhCustomerList = () => {
  return fetch({
    url: apiConfig.CUS_WH_CUSTOMER_LIST+"?__spin__",
    method: 'post'
  })
}


export const doCloudWarehouseList = (params) => {
  let showLoading = params["showLoading"];
  return fetch({
    url: apiConfig.CLOUDWARE_LIST+ (('Y' == showLoading)?"":"?__spin__"),
    method: 'get'
  })
}

export const doCloudWarehouseInfo = params => {
  return fetch({
    url: apiConfig.CUS_CLOUDWARE_INFO + params,
    method: 'get',
  })
}

export const doWhOwnerCodeList = (whCode) => {
  return fetch({
    url: apiConfig.CUS_WH_OWNER_LIST+"?whCode="+whCode,
    method: 'post'
  })
}
























