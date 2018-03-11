import fetch from '../fetch.js'
import apiConfig from '../apiConfig.js'

export const doMenuAll = params => {
  let startIndex = params["startIndex"];
  let endIndex   = params["endIndex"];
  let menuname   = params["menuname"];
  let status   = params["status"];
  let menuType   = params["menuType"];
  return fetch({
    url: apiConfig.SYS_MENU_ALL,
    method: 'get',
  })
}

export const doMenuSave = params => {
  return fetch({
    url: apiConfig.SYS_MENU_SAVE,
    method: 'post',
    data: params
  })
}

export const doMenuDel = menuId => {
  return fetch({
    url: apiConfig.SYS_MENU_DEL + menuId,
    method: 'delete',
  })
}

export const doMenuInfo = params => {
  let menuId = params["menuId"];
  return fetch({
    url: apiConfig.SYS_MENU_INFO + menuId,
    method: 'get',
  })
}

