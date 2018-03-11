// 导入模块
import validate from './validate'

const install = function (Vue) {
  if (install.installed) return
  install.installed = true

  // 定义属性到Vue原型中
  Object.defineProperties(Vue.prototype, {
    $validate: {
      get () {
        return validate
      }
    }
  })
}

export default {
  install
}
