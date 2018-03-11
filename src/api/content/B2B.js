import fetch from '../fetch.js'
import apiConfig from '../apiConfig.js'


export const doB2BList = params => {
    let startIndex = params["startIndex"];
    let endIndex   = params["endIndex"];
    let requestId = params["requestId"];
    let requestUsername = params["requestUsername"];
    let requestStatus = params["requestStatus"];
    let requestStartDate = params["requestStartDate"];
    let requestEndDate = params["requestEndDate"];
    return fetch({
      url: apiConfig.B2B_LIST + "?startIndex=" + startIndex + "&endIndex=" + endIndex + "&requestId=" + requestId
        + "&requestUsername=" + requestUsername+ "&requestStatus=" 
        + requestStatus+"&requestStartDate="+requestStartDate+"&requestEndDate="+requestEndDate,
      method: 'post',
    })
}
//暂时不适用， 暂时使用客户列表查询， 将来如果需要特殊过滤再使用此方法
export const doSelectCompanyList = params => {

  return fetch({
    url: apiConfig.B2B_SELECT_COMP_LIST,
    method: 'post',
  })
}



export const getUserRequestDetails = params => {

  return fetch({
    url: apiConfig.B2B_INFO + params,
    method: 'get',
  })
}

export const doBindCus = (params) => {
  return fetch({
    url: apiConfig.B2B_BIND_CUS,
    method: 'post',
    data: params
  })
}































