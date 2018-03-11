import fetch from '../fetch.js'
import apiConfig from '../apiConfig.js'

export const doResourceList = params => {
  return fetch({
    url: apiConfig.SYS_MENU_ALL + "?withresource=Y",
    method: 'get'
  })
}

export const doResourceSave = params => {
  return fetch({
    url: apiConfig.SYS_RESOURCE_SAVE,
    method: 'post',
    data: params
  })
}

export const doResourceDel = resourceId => {
  return fetch({
    url: apiConfig.SYS_RESOURCE_DEL + resourceId,
    method: 'delete',
  })
}




