import Observer from './Observer.js'

/**
 * 给obj设置__ob__监听属性(具体在Observe类构造函数中设置的)，跟Observer() -> defineReactive() -> observe() 形成一个多函数递归响应式监听所有属性
 * @param {*} obj
 * @returns
 */
function observe(obj, dep) {
  if (obj === null || typeof obj !== 'object') return

  let ob
  // 如果当前对象属性层级已经被响应式监听
  if (obj.__ob__ !== undefined) {
    ob = obj.__ob__
  } else {
    ob = new Observer(obj, dep)
  }

  return ob
}

export default observe
