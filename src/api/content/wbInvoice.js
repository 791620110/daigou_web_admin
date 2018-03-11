import fetch from '../fetch.js'
import apiConfig from '../apiConfig.js'

export const doWbInvoiceList = params => {
  let startIndex = params["startIndex"];
  let endIndex = params["endIndex"];
  let pickupName = params["pickupName"];
  let pickupTel = params["pickupTel"];
  let customerCode = params["customerCode"];
  return fetch({
    url: apiConfig.WB_INVOICE_LIST + "?startIndex=" + startIndex
    + "&endIndex=" + endIndex + "&pickupName=" + pickupName + "&pickupTel=" + pickupTel+ "&customerCode=" + customerCode,
    method: 'post',
  })
}

export const doDelInvoice = (pickupId) => {
  return fetch({
    url: apiConfig.WB_INVOICE_DEL + pickupId ,
    method: 'delete',
  })
}

export const doInvoiceSave = (params,insertOrUpdate) => {
  return fetch({
    url: apiConfig.WB_INVOICE_SAVE  + "?insertOrUpdate=" + insertOrUpdate ,
    method: 'post',
    data: params
  })
}






























