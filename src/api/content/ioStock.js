import fetch from '../fetch.js'
import apiConfig from '../apiConfig.js'

export const doIoStockList = params => {
  let startIndex = params["startIndex"];
  let endIndex = params["endIndex"];
  let wmsStockoutCode = params["wmsStockoutCode"];
  let extOrderCode = params["extOrderCode"];
  let distributionStatus = params["distributionStatus"];
  let waybillCode =  params["waybillCode"];
  let orderStartDate = params["orderStartDate"];
  let orderEndDate = params["orderEndDate"];
  return fetch({
    url: apiConfig.STOCK_IO_STOCK_LIST + "?isAll=Y&startIndex=" + startIndex+"&waybillCode="+waybillCode
    + "&endIndex=" + endIndex + "&wmsStockoutCode=" + wmsStockoutCode+ "&extOrderCode=" + extOrderCode
    +"&distributionStatus="+distributionStatus+"&orderStartDate="+orderStartDate+"&orderEndDate="+orderEndDate,
    method: 'post',
  })
}





















