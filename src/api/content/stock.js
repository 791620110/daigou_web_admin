import fetch from '../fetch.js'
import apiConfig from '../apiConfig.js'

export const doStockList = params => {
  let startIndex = params["startIndex"];
  let endIndex = params["endIndex"];
  let whGoodsName = params["whGoodsName"];
  let whGoodsCode = params["whGoodsCode"];
  let ownerCode = params["ownerCode"];
  return fetch({
    url: apiConfig.STOCK_STOCK_LIST + "?startIndex=" + startIndex
    + "&endIndex=" + endIndex + "&whGoodsName=" + whGoodsName+ "&whGoodsCode=" + whGoodsCode+ "&ownerCode=" + ownerCode,
    method: 'post',
  })
}

export const doDistributeList = params => {
  let medicineCode = params["medicineCode"];
  let whCode = params["whCode"];
  return fetch({
    url: apiConfig.STOCK_DISTRIBUTE_LIST + "?medicineCode=" + medicineCode + "&whCode=" + whCode,
    method: 'post',
  })
}

export const doWareHouseSelectList = params => {
  return fetch({
    url: apiConfig.STOCK_WAREHOUSE_LIST_CODE,
    method:'get'
  })
}

export const getStockInOutDetails = params => {
	  let goodsCode = params["goodsCode"];
	  return fetch({
	    url: apiConfig.STOCK_INOUT_DETAILS + "?goodsCode=" + goodsCode,
	    method: 'get',
	  })
	}



















