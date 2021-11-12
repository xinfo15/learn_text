import mixin from './mixin.js'
import { renderAstToFunction } from '../AST/renderAstToFunction.js'
import parse from '../AST/parse.js'
import patch from '../diff/patch.js'
import observe from '../Observer/observe.js'
import proxy from './proxy.js'
import Watcher from '../Observer/Watcher.js'

function Vue(options) {
  const vm = this
  vm.$options = options

  if (options.data) {
    initData(vm)
    // console.log(options.data)
  }
  if (options.methods) {
    initMethods(vm)
  }

  // 调用生命周期函数
  const created = options.created
  if (typeof created === 'function') {
    created.call(vm)
  }

  const el = document.querySelector(options.el)
  let template = options.template
  if (template.indexOf('#') === 0) {
    template = document.querySelector(template).innerText
  }
  const ast = parse(template)
  const render = renderAstToFunction(ast)
  // console.log(render)
  const vnode = render.call(vm)
  // console.log(vnode);
  // console.log(el);
  patch(el, vnode)

  // 调用生命周期函数
  const mounted = options.mounted
  if (typeof mounted === 'function') {
    mounted.call(vm)
  }

  vm._vnode = vnode
  vm._render = render
  vm.$el = el

  // 每个属性变化都触发组件更新
  new Watcher(
    vm,
    () => {
      const preVnode = vm._vnode
      const vnode = (vm._vnode = vm._render())
      // console.log(preVnode, vnode)

      patch(preVnode, vnode)
    },
    () => {}
  )
}

mixin(Vue)

/**
 * 初始化data
 * @param {*} vm
 */
function initData(vm) {
  const options = vm.$options
  const data = (vm._data = options.data)
  const keys = Object.getOwnPropertyNames(data)
  // 响应式监听
  observe(data)

  for (const key of keys) {
    proxy(vm, key, data)
  }
}

/**
 * 初始化方法
 * @param {*} vm
 */
function initMethods(vm) {
  const options = vm.$options
  const methods = (vm._methods = options.methods)
  const keys = Object.getOwnPropertyNames(methods)

  for (const key of keys) {
    proxy(vm, key, methods)
  }
}

export default Vue
