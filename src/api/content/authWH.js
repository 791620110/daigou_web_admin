import fetch from '../fetch.js'
import apiConfig from '../apiConfig.js'


export const doAuthWhList = params => {
  let startIndex = params["startIndex"];
  let endIndex   = params["endIndex"];
  let whName = params["whName"];
   let customerName = params["customerName"];
  let asCloud = params["asCloud"];
  let status = "00";
  return fetch({
    url: apiConfig.CUS_CLOUDWARE_LIST + "?startIndex=" + startIndex + "&endIndex=" 
    + endIndex  + "&whName=" + whName + "&status=" + status+ "&asCloud=" + asCloud+ "&customerName=" + customerName,
    method: 'post',
  })
}

export const doWarehouseCustomerUnSelectList = whCode => {
  return fetch({
    url: apiConfig.CUS_CLOUDWARE_CUSTOMER_UNSELECTED+"?whCode="+ whCode,
    method: 'get'
  })
}

export const doWarehouseCustomerSelectList = whCode => {
  return fetch({
    url: apiConfig.CUS_CLOUDWARE_CUSTOMER_SELECTED+"?whCode="+ whCode,
    method: 'get'
  })
}

export const doWhBindCus = (params,insertOrUpdate) => {
  let wareHouser = 'Y'
  return fetch({
    url: apiConfig.CUS_WH_BIND_SAVE + "?insertOrUpdate=" + insertOrUpdate ,
    method: 'post',
    data: params
  })
}

export const doWhOwnerSelectList = (whCode) => {
  return fetch({
    url: apiConfig.CUS_WH_OWNER_LIST + "?whCode=" + whCode+"&__spin__" ,
    method: 'post'
  })
}

export const doWareBindDel = (whCode,customerCode) => {
  return fetch({
    url: apiConfig.CUS_WH_BIND_DEL + "?whCode=" + whCode + "&customerCode=" + customerCode ,
    method: 'delete',
  })
}





























