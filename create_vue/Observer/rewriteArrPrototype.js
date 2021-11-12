import { def } from './utils.js'

/**
 * 原型式继承，在一个对象的基础上生成一个新对象，有浅拷贝的作用
 * @param {*} obj
 */
function object(obj) {
  const temp = function () {}
  temp.prototype = obj
  return new temp()
}

const observeMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']

const arrayPrototype = object(Array.prototype)

observeMethods.forEach((method) => {
  // 保存方法的反射
  const originalMethod = Array.prototype[method]

  def(
    arrayPrototype,
    method,
    function () {
      console.log('监听到了数组的' + method + '变化', this)

      const ob = this.__ob__

      const res = originalMethod.apply(this, arguments)

      // 当前层级dep实例
      const dep = ob.dep
      // 修改当前数组的元素，触发数组修改的watcher回调
      dep.notify()

      switch (method) {
        case 'push':
        case 'unshift':
          ob.observeArray(arguments)
          break
        case 'splice':
          // splice 只有在 两个以上参数的时候，才能插入和修改
          if (arguments.length > 2) {
            ob.observeArray(Array.prototype.slice.call(arguments, 2))
          }
          break
      }
      return res
    },
    false
  )
})

export default arrayPrototype
