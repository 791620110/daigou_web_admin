// 导入模块
import tableCommon from './tableCommon'
import dateCommon from './dateCommon'
import treeUtils from "./treeUtils"

const install = function (Vue) {
  if (install.installed) return
  install.installed = true

  // 定义属性到Vue原型中
  Object.defineProperties(Vue.prototype, {
    $table: {
      get () {
        return tableCommon
      }
    },
    $tree: {
      get () {
        return treeUtils
      }
    },
    $date:{
      get () {
        return dateCommon
      }
    }
  })
}
export default {
  install
}
