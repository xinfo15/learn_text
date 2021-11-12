import vnode from '../diff/vnode.js'

export default function mixin(Vue) {
  Vue.prototype._c = vnode
  Vue.prototype._s = function (name) {
    return name
  }
  Vue.prototype._l = renderList
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

  return tokens
}
