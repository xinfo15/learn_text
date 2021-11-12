import vnode from '../diff/vnode.js'

export default function mixin(Vue) {
  Vue.prototype._c = vnode
  Vue.prototype._s = toString
  Vue.prototype._l = renderList
  Vue.prototype._h = createTextVnode
  Vue.prototype._i = ifConditions
}

// v-for
function renderList(exp, fn) {

  let tokens = []
  for (const idx in exp) {
    if (Object.hasOwnProperty.call(exp, idx)) {
      const item = exp[idx]

      tokens.push(fn(item, idx))
    }
  }

  // if(tokens.length) {
  //   tokens[tokens.length - 1] = tokens[tokens.length - 1].slice(-1, 0)
  // }

  return tokens
}

// 变量转换为字符串
function toString(name) {
  return name
}

// 创建文本vnode
function createTextVnode(text) {
  return vnode(undefined, undefined, undefined, text)
}

function ifConditions(exp, fn) {
  if (exp) return fn()
  else return ''
}
