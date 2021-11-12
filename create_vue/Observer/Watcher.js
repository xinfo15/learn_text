import Dep from './Dep.js'
import { parsePath, stringify } from './utils.js'

let uid = 0
export default class Watcher {
  // target表示watch的对象，expression表示对象的属性， callback是watch到target变化的回调函数
  // 创建watcher实例的时候当前实例watcher也会读取数据，在第一次读取数据的时候绑定上了依赖
  constructor(target, expOrFn, callback) {
    this.id = uid++
    this.target = target

    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      // getter表示拆分属性完成，传入同结构对象即可拿到想要的属性值
      this.getter = parsePath(expression)
    }

    this.callback = callback

    // this.value 表示上一次当前对象的当前属性的值，如果是数组或对象则需要浅拷贝
    let value = this.get()
    if (Array.isArray(value)) value = [...value]
    else if (typeof value === 'object') value = { ...value }
    this.value = value
  }

  // 获取当前target的expression属性的最新值
  get() {
    // 1. 由于当前watcher正在读取数据，所以设置Dep.target为当前watcher实例
    Dep.target = this

    let value
    try {
      // 2. 然后通过触发expression属性绑定的 defineReactive 的 get 来为expression添加依赖
      value = this.getter(this.target)
      // 如果watcher是组件的renderWatcher
      // 那么会触发_render()，也就会重新读取被视图依赖的属性，由于Dep.target = this，也就会重新收集依赖
      // 所以不用担心被赋值后的对象或数组，会失去__ob__和dep中的watcher，因为会重新收集
    } finally {
      // 当前watcher读取完数据之后，要立马让出位置给其他watcher使用
      Dep.target = null
    }

    return value
  }

  // 当前watch的属性值发生了改变，然后当前属性的dep通知所有watcher触发update方法
  update() {
    this.run()
  }

  run() {
    this.getAndInvoke(this.callback)
  }

  // 获得当前属性的最新值，并判断是否真正改变了，如果改变了就唤醒watch的回调函数
  getAndInvoke(callback) {
    const newVal = this.get()

    // 判断新值不等于旧值，但是为什么要判断是否是对象 ？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？
    // 解答：因为数组和对象保存引用值会导致最后传给callback的newVal和oldVal相同，所以在最开始进行了浅复制。因此，只要是数组和对象的话就代表改变了值！！！！！

    // console.log(`getAndInvoke函数输出的 -》 newval = ${stringify(newVal)} oldval=${stringify(this.value)}`)
    if (newVal !== this.value || typeof newVal === 'object') {
      const oldVal = this.value
      this.value = newVal

      callback.call(this.target, newVal, oldVal)
    }
  }
}
