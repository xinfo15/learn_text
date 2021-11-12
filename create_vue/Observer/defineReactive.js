import Dep from './Dep.js'
import observe from './observe.js'
import { def } from './utils.js'

/**
 * 实现响应式监听一个对象
 * @param {*} obj
 * @param {*} key
 * @param {*} val
 */
function defineReactive(obj, key, val) {
  if (arguments.length === 2) val = obj[key]

  // 1 新建一个dep实例，闭包中的dep，跟__ob__中的dep不一样
  // 闭包dep，用于当前val被新值覆盖了，但是闭包dep不受影响，dep里面依然有watcher
  const dep = new Dep()
  // 2 复用__ob__中的dep (不可行，当前层级的属性的watcher会被收集到一个dep实例中，当前中一个属性改变，其他属性的watcher都会触发)
  // const dep = obj.__ob__.dep

  // 检查当前对象的属性层级是否被响应式监听
  let childOb = observe(val)

  Object.defineProperty(obj, key, {
    enumerable: true,
    get: function () {
      // console.log(`获取了对象的${key}属性`)

      // 如果现在正处于依赖收集阶段
      if (Dep.target) {
        // debugger
        dep.depend()

        // 如果watch的属性值是对象，则这个对象属性层级的dep也要收集当前watcher作为依赖
        // 感觉跟深度watch类似，如果当前对象的属性改变了，那么属性就可以触发父对象的dep.notify通知父对象watcher
        if (childOb) {
          childOb.dep.depend()
        }
      }

      return val
    },
    set: function (newVal) {
      // console.log(`设置了对象的${key}属性为${newVal}`)

      // 重新设置了属性，要重新监听
      // 重新设置值非常重要
      childOb = observe(newVal)
      val = newVal

      // // （测试！！！）用于只要修改了数据，就重新渲染模板
      // window.mustacheRender()

      // 1 改变了当前值就发布订阅通知
      dep.notify()

      // 2 改变当前值给 当前值的父对象 发布通知 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      obj.__ob__.dep.notify()
    },
  })
}

export default defineReactive
