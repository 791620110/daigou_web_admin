import fetch from '../fetch.js'
import apiConfig from '../apiConfig.js'

export const doAddressList = params => {
  let startIndex = params["startIndex"];
  let endIndex   = params["endIndex"];
  let username   = params["username"];
  let addrCode     = params["addrCode"];
  let addrType   = params["addrType"];
  let addrName   = params["addrName"];
  let contactPerson   = params["contactPerson"];
  let contactMobile   = params["contactMobile"];
  return fetch({
    url: apiConfig.BASE_ADDRESS_LIST + "?startIndex=" + startIndex 
      + "&endIndex=" + endIndex + "&addrCode=" + addrCode+ "&addrType=" + addrType+ "&addrName=" 
      + addrName+ "&contactPerson=" + contactPerson+"&contactMobile="+contactMobile,
    method: 'post',
  })
}

export const doReceiverAddressList = params => {
  let showLoading = params["showLoading"];
  return fetch({
    url: apiConfig.BASE_RECEIVER_ADDRESS_LIST + ((showLoading=='Y')?"":"?__spin__"),
    method: 'get',
  })
}

export const doAddressSave = (params) => {
  return fetch({
    url: apiConfig.BASE_ADDRESS_SAVE,
    method: 'post',
    data: params
  })
}

export const doAddressDel = params => {
  return fetch({
    url: apiConfig.BASE_ADDRESS_DEL + params,
    method: 'delete',
  })
}

export const doAddressInfo = params => {

  return fetch({
    url: apiConfig.BASE_ADDRESS_INFO + params,
    method: 'get',
  })
}















