import fetch from '../fetch.js'
import apiConfig from '../apiConfig.js'

export const getAllMedicineList = params => {
  return fetch({
    url: apiConfig.WMS_MEDICINE_LIST,
    method: 'get',
  })
}
//按照药品编号精确查询
export const getMedicineStock = medicineCode => {
  return fetch({
    url: apiConfig.WMS_COMMON+"medicines/"+medicineCode+"/stockList",
    method: 'get',
  })
}

//模糊查询
export const searchMedicineStock = params => {
	let showLoading = params["showLoading"];
	return fetch({
	    url: apiConfig.WMS_COMMON+"searchMedicineStock"+(('Y' == showLoading)?"":"?__spin__"),
	    method: 'post',
	    data: params
	})
}