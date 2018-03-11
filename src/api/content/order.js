import fetch from '../fetch.js'
import apiConfig from '../apiConfig.js'

export const doOrderList = params => {
    let showLoading = params["showLoading"];
    let startIndex = params["startIndex"]==null?"":params["startIndex"];
    let endIndex   = params["endIndex"]==null?"":params["endIndex"];
    let extOrderCode   = params["extOrderCode"]==null?"":params["extOrderCode"];
    let status     = params["status"]==null?"":params["status"];
    let orderSource   = params["orderSource"]==null?"":params["orderSource"];
    let receiverName   = params["receiverName"]==null?"":params["receiverName"];
    let warehouseCode   = params["warehouseCode"]==null?"":params["warehouseCode"];
    let orderStartDate   = params["orderStartDate"]==null?"":params["orderStartDate"];
    let orderEndDate   = params["orderEndDate"]==null?"":params["orderEndDate"];
    let receiverMobile = params["receiverMobile"]==null?"":params["receiverMobile"]; 
    return fetch({
      url: apiConfig.ORDER_LIST + "?startIndex=" + startIndex 
        + "&endIndex=" + endIndex +"&extOrderCode="+extOrderCode+ "&status=" + status+ "&orderSource=" + orderSource+ "&receiverName=" + receiverName
        +"&warehouseCode=" + warehouseCode+"&orderStartDate=" + orderStartDate+"&receiverMobile="+receiverMobile+"&orderEndDate=" + orderEndDate+ (('Y' == showLoading)?"":"&__spin__"),
      method: 'post',
    })
}


export const checkExtOrderCode = extOrderCode => {
    let request = new XMLHttpRequest()
    let result = false;
    request.open('POST', apiConfig.ORDER_LIST +'?extOrderCode='+extOrderCode, false);
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('_token', localStorage.getItem("token"));
    request.send(JSON.stringify({}))
    if (request.status === 200) {
        var retunjson = JSON.parse(request.response);
        if(retunjson.status == 'S'){
            if(retunjson.result.total <= 0){
                result =  true;
            }
        }
    }
    return result;
}


export const doOrderSave = (params) => {
    return fetch({
      url: apiConfig.ORDER_SAVE,
      method: 'post',
      data: params
    })
}
//待分仓页面， 点击分仓完成
export const doOrderAction = (params) => {
    let orderId = params["orderId"];
    let action = params["action"];
    let showLoading = params["showLoading"];
    return fetch({
      url: apiConfig.ORDER_INFO+orderId+"/doAction?action="+action+ (('Y' == showLoading)?"":"__spin__"),
      method: 'post',
      data: params
    })
}

export const doOrderDel = params => {
    return fetch({
      url: apiConfig.ORDER_DEL + params,
      method: 'delete',
    })
}

export const doOrderInfo = params => {
    let orderId = params["orderId"];
    let showLoading = params["showLoading"];
    return fetch({
      url: apiConfig.ORDER_INFO + orderId+ (('Y' == showLoading)?"":"?__spin__"),
      method: 'get',
    })
}

export const doOrderInfoByCode = params => {
    let orderCode = params["orderCode"];
    let showLoading = params["showLoading"];
    return fetch({
      url: apiConfig.ORDER_INFO +"searchByCode/" +orderCode+ (('Y' == showLoading)?"":"?__spin__"),
      method: 'get',
    })
}
//待分仓页面确认分仓完成按钮， 显示当前order每个药品都从那些仓库发，发多少
export const doOrderDetailsDistributionInfo = params => {
    let orderId = params["orderId"];
    let showLoading = params["showLoading"];
    return fetch({
      url: apiConfig.ORDER_DETAILS_DISTRIBUTION_INFO + orderId+ "/distribution"+(('Y' == showLoading)?"":"?__spin__"),
      method: 'get',
    })
}

//待分仓页面， 选择药品， 填写订单数量 ， 点击确定保存分仓信息
export const doOrderDetailsDistributionSave = params => {
    return fetch({
      url: apiConfig.ORDER_DETAILS_DISTRIBUTION_INFO + "/distribution",
      method: 'post',
      data: params
    })
}

//按照订单显示分仓信息， 分仓主表 ， 分仓明细
export const doOrderDistributionInfo = params => {
    let orderId = params["orderId"];
    let showLoading = params["showLoading"];
    return fetch({
      url: apiConfig.ORDER_DISTRIBUTION_INFO + orderId+(('Y' == showLoading)?"":"?__spin__"),
      method: 'get',
    })
}

//待发货列表页面
export const doOrderDistrbutionList = params => {
    let startIndex = params["startIndex"];
    let endIndex   = params["endIndex"];
    let extOrderCode   = params["extOrderCode"];
    let orderSource   = params["orderSource"];
    let receiverName   = params["receiverName"];
    let orderStartDate   = params["orderStartDate"];
    let orderEndDate   = params["orderEndDate"];
    let distributionStatus   = params["distributionStatus"]==null ? "":params["distributionStatus"];
    return fetch({
      url: apiConfig.DISTRIBUTION_LIST + "?startIndex=" + startIndex 
        + "&endIndex="  + endIndex +"&extOrderCode="+extOrderCode + "&orderSource=" + orderSource+ "&receiverName=" + receiverName
        +"&orderStartDate=" + orderStartDate+"&orderEndDate=" + orderEndDate+"&distributionStatus="+distributionStatus,
      method: 'post',
    })
}

//审批当前仓库的分库单取消申请
export const doCancellRequestOrderDistrbutionList = params => {
    let startIndex = params["startIndex"];
    let endIndex   = params["endIndex"];
    let extOrderCode   = params["extOrderCode"];
    let orderSource   = params["orderSource"];
    let receiverName   = params["receiverName"];
    let orderStartDate   = params["orderStartDate"];
    let orderEndDate   = params["orderEndDate"];
    let cancelledStatus   = params["cancelledStatus"]==null?"":params["cancelledStatus"];
    return fetch({
      url: apiConfig.DISTRIBUTION_LIST + "/cancellRequestlist?startIndex=" + startIndex 
        + "&endIndex="  + endIndex +"&extOrderCode="+extOrderCode + "&orderSource=" + orderSource+ "&receiverName=" + receiverName
        +"&orderStartDate=" + orderStartDate+"&orderEndDate=" + orderEndDate+"&cancelledStatus="+cancelledStatus,
      method: 'post',
    })
}

//查询当前客户提交的分库单取消申请
export const doMyCancellRequestOrderDistrbutionList = params => {
    let startIndex = params["startIndex"];
    let endIndex   = params["endIndex"];
    let extOrderCode   = params["extOrderCode"];
    let orderSource   = params["orderSource"];
    let receiverName   = params["receiverName"];
    let orderStartDate   = params["orderStartDate"];
    let orderEndDate   = params["orderEndDate"];
    let cancelledStatus   = params["cancelledStatus"]==null?"":params["cancelledStatus"];
    return fetch({
      url: apiConfig.DISTRIBUTION_LIST + "/myCancellRequestlist?startIndex=" + startIndex 
        + "&endIndex="  + endIndex +"&extOrderCode="+extOrderCode + "&orderSource=" + orderSource+ "&receiverName=" + receiverName
        +"&orderStartDate=" + orderStartDate+"&orderEndDate=" + orderEndDate+"&cancelledStatus="+cancelledStatus,
      method: 'post',
    })
}

//代发货页面， 点击> 显示主发货单下的明细信息
export const doDistributionInfo = params => {
    let distributionId = params["distributionId"];
    let showLoading = params["showLoading"];
    return fetch({
      url: apiConfig.DISTRIBUTION_INFO + distributionId+ (('Y' == showLoading)?"":"?__spin__"),
      method: 'get',
    })
}


//取消分库单
export const doCancellDistributionInfo = params => {
    let distributionId = params["distributionId"];
    let showLoading = params["showLoading"];
    return fetch({
      url: apiConfig.DISTRIBUTION_INFO + distributionId+ (('Y' == showLoading)?"":"?__spin__"),
      method: 'delete',
    })
}


//根据订单创建分库单
export const addDistributionInfoByOrderId = params => {
    let orderId = params["orderId"];
    let showLoading = params["showLoading"];
    return fetch({
      url: apiConfig.ORDER_DISTRIBUTION_INFO + orderId+(('Y' == showLoading)?"":"?__spin__"),
      method: 'post',
    })
}

// 订单取消审核页面， 确认审核结果
export const saveDistributionCheckResult = params => {
    let showLoading = params["showLoading"];
    return fetch({
      url: apiConfig.DISTRIBUTION_INFO + "cancelRequest/check"+(('Y' == showLoading)?"":"?__spin__"),
      method: 'post',
      data: params
    })
}

export const doStockOut = params => {
    let showLoading = params["showLoading"];
    let distributionId = params["distributionId"];
    let wmsStockoutCode = params["wmsStockoutCode"];
    return fetch({
      url: apiConfig.DISTRIBUTION_INFO +distributionId+ "/doStockOut?&action=COMMIT_STOCKOUT"+ (('Y' == showLoading)?"":"__spin__"),
      method: 'post',
      data: params
    })
}