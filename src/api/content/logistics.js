import fetch from '../fetch.js'
import apiConfig from '../apiConfig.js'

export const doWaybillTrace = params => {
  let waybillCode = params["waybillCode"];
  let vendor = params["vendor"];
  return fetch({
    url: apiConfig.LOG_WAYBILL_TRACE + "?waybillCode=" + waybillCode + "&vendor="+vendor,
    method: 'get',
  })
}

export const getWaybillInfo = params => {
  let waybillCode = params["waybillCode"];
  let vendor = params["vendor"];
  return fetch({
	 url: apiConfig.LOG_WAYBILL_INFO + "?waybillCode=" + waybillCode + "&vendor=" + vendor,
	 method: 'get',
  })
}

export const doWaybillList = params => {
  let startIndex = params["startIndex"];
  let endIndex   = params["endIndex"];
  let waybillCode   = params["waybillCode"];
  let vendor   = params["vendor"];
  let invoiceCode   = params["invoiceCode"];
  let status   = params["status"];
  let startDate   = params["startDate"];
  let endDate   = params["endDate"];
  return fetch({
    url: apiConfig.LOG_WAYBILL_LIST + "?startIndex=" + startIndex + "&endIndex=" + endIndex
    	+ "&waybillCode=" + waybillCode + "&status=" + status+ "&vendor=" + vendor
    	+ "&invoiceCode=" + invoiceCode + "&startDate=" + startDate+ "&endDate=" + endDate,
    method: 'get',
  })
}

export const updatePackageNumber = params => {
  let waybillCode = params["waybillCode"];
  let packageNumber = params["packageNumber"];
  let vendor = params["vendor"];
  return fetch({
    url: apiConfig.LOG_PACKAGE_UPDATE + "?waybillCode=" + waybillCode + "&packageCount="+packageNumber + "&vendor="+vendor,
    method: 'post',
  })
}

export const updateWaybillInfo = params => {
  return fetch({
    url: apiConfig.LOG_WAYBILL_UPDATE,
    method: 'post',
    data: params
  })
}

export const doLogiticsList = params => {
  let startIndex = params["startIndex"];
  let endIndex = params["endIndex"];
  let clientId = params["clientId"];
  let vendor = params["vendor"];
  let status = params["status"];
  return fetch({
    url: apiConfig.LOG_LIST + "?startIndex=" + startIndex + "&endIndex=" + endIndex 
    + "&clientId=" + clientId+ "&status=" + status+ "&vendor=" + vendor,
    method: 'post',
  })
}

export const getPickupList = params => {
	  let startIndex = params["startIndex"];
	  let endIndex   = params["endIndex"];
	  return fetch({
	    url: apiConfig.LOG_PICKUP_LIST + "?startIndex=" + startIndex + "&endIndex=" + endIndex,
	    method: 'get',
	  })
}

export const doPickupOrder = params => {
	  let waybillCode = params["waybillCode"];
	  let vendor = params["vendor"];
	  let pickupId = params["pickupId"];
	  let desc = params["desc"];
	  return fetch({
	    url: apiConfig.LOG_PICKUP_SEND + "?waybillCode=" + waybillCode + "&vendor=" + vendor + "&pickupId=" + pickupId + "&desc=" + desc,
	    method: 'post'
	  })
}

export const doPickupConfirm = params => {
	  let waybillCode = params["waybillCode"];
	  let vendor = params["vendor"];
	  return fetch({
	    url: apiConfig.LOG_PICKUP_CONFIRM + "?waybillCode=" + waybillCode + "&vendor=" + vendor,
	    method: 'post'
	  })
}

export const doWaybillPrint = params => {
	  let waybillCode = params["waybillCode"];
	  let vendor = params["vendor"];
	  return fetch({
	    url: apiConfig.LOG_WAYBILL_PRINT + "?waybillCode=" + waybillCode + "&vendor=" + vendor,
	    method: 'post',
	    contentType:"application/json; charset=utf-8"
	  })
}

export const getStockOutDetails = params => {
	  let distributionId = params["distributionId"];
	  return fetch({
	    url: apiConfig.LOG_STOCKOUT_DETAILS + "?distributionId=" + distributionId,
	    method: 'get',
	  })
}

export const doLogisticsSave = (params,insertOrUpdate) => {
  return fetch({
    url: apiConfig.LOG_SAVE + "?insertOrUpdate=" + insertOrUpdate,
    method: 'post',
    data:params
  })
}

export const doLogisticsDel = (logisticsCode) => {
  return fetch({
    url: apiConfig.LOG_DEL + logisticsCode,
    method: 'delete',
  })
}

//export const generatePdf11 = params => {
//	let waybillCode = params["waybillCode"];
//	let vendor = params["vendor"];
//	let url =apiConfig.LOG_WAYBILL_PDF+"?waybillCode=" + waybillCode + "&vendor=" + vendor;
//	window.open(url, "_blank") ;
//}

export const generatePdf = params => {
	let waybillCode = params["waybillCode"];
	let vendor = params["vendor"];
	return fetch({
	    url: apiConfig.LOG_WAYBILL_PRINT + "?waybillCode=" + waybillCode + "&vendor=" + vendor,
	    method: 'post',
	    contentType:"application/json; charset=utf-8"
	})
}





