import fetch from '../fetch.js'
import apiConfig from '../apiConfig.js'

export const doCustomerList = params => {
  let startIndex = params["startIndex"];
  let endIndex   = params["endIndex"];
  let customerName   = params["customerName"];
  let customerType = params["customerType"];
  let source = params["source"];

  return fetch({
    url: apiConfig.CUS_CUSTOMER_LIST + "?startIndex=" + startIndex + "&endIndex=" + endIndex
     + "&customerName=" + customerName + "&customerType=" + customerType+ "&source=" + source,
    method: 'post',
  })
}

export const doCustomerSave = (params,insertOrUpdate) => {
  return fetch({
    url: apiConfig.CUS_CUSTOMER_SAVE + "?insertOrUpdate=" + insertOrUpdate ,
    method: 'post',
    data: params
  })
}

export const doCustomerDel = customerCode => {
  return fetch({
    url: apiConfig.CUS_CUSTOMER_DEL + "?customerCode=" + customerCode,
    method: 'post',
  })
}
//新增订单页面调用此方法
export const doCustomerInfo = customerCode => {

  return fetch({
    url: apiConfig.CUS_CUSTOMER_INFO + customerCode,
    method: 'get',
  })
}

export const doMemberSave = (params,insertOrUpdate) => {
  let customerCode = params["customerCode"];
  return fetch({
    url: apiConfig.CUS_CUSTOMER_MEMBER_SAVE  + "?insertOrUpdate=" + insertOrUpdate,
    method: 'post',
    data: params
  })
}


export const doCustomerWarehouseList = params => {
  return fetch({
    url: apiConfig.CUSTOMER_WAREHOUSE_LIST+"?__spin__",
    method: 'post',
  })
}












