import { def } from './utils.js'
import defineReactive from './defineReactive.js'
import Dep from './Dep.js'
import observe from './observe.js'
import rewriteArrPrototype from './rewriteArrPrototype.js'

class Observer {
  constructor(value, dep) {
    // 在要响应式监听的对象上，添加__ob__为不可枚举属性
    def(value, '__ob__', this, false)

    // 每个__ob__实例上面都有一个Dep实例
    if (dep) {
      this.dep = dep
    } else {
      this.dep = new Dep()
    }

    // 通过重写数组原型，实现数组方法响应式监听
    if (Array.isArray(value)) {
      value.__proto__ = rewriteArrPrototype
      // 遍历数组元素，最终实现递归响应式监听所有属性
      this.observeArray(value)
    } else {
      // 遍历对象数组，最终实现递归响应式监听所有属性
      this.walk(value)
    }
  }

  /**
   * 遍历对象数组，最终实现递归响应式监听所有属性
   * @param {*} value
   */
  walk(value) {
    for (const key in value) {
      defineReactive(value, key)
    }
  }

  /**
   * 遍历数组元素，最终实现递归响应式监听所有属性
   * @param {*} arr
   */
  observeArray(arr) {
    for (let i = 0, len = arr.length; i < len; i++) {
      observe(arr[i])
    }
  }
}

export default Observer
