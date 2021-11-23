import { isSameVnode, hasText, hasChildren, isObject, camelToLine } from './utils.js'
import { patchAttrs } from './patchAttrs.js'

/**
 * 将vnode 转换成 dom
 * @param {*} vnode
 * @returns
 */
export default function createElement(vnode) {
  let domEl
  // 元素节点
  if (vnode.sel) {
    domEl = document.createElement(vnode.sel)
    // 属性上树，模拟一个属性为空的vnode
    patchAttrs({ elm: domEl }, vnode)
  }
  // 文本节点
  else {
    domEl = document.createTextNode(vnode.text)
  }
  // 设置vnode和dom节点的关系
  vnode.elm = domEl

  // 当前节点有文本
  if (hasText(vnode)) {
    domEl.innerHTML = vnode.text
  } else if (hasChildren(vnode)) {
    // 当前节点有 children

    for (const child of vnode.children) {
      if (isObject(child)) domEl.appendChild(createElement(child))
    }
  }

  return domEl
}

// // 属性上树
// function addAttrs(domEl, data) {
//   if (!data || typeof data !== 'object') return
//   const { style, attrs, on, domProps } = data

//   if (data.class) {
//     domEl.className = data.class
//   }

//   if (style) {
//     domEl.style = style
//   }

//   if (attrs && typeof attrs === 'object') {
//     for (const attr in attrs) {
//       if (Object.hasOwnProperty.call(attrs, attr)) {
//         const value = attrs[attr]
//         domEl.setAttribute(camelToLine(attr), value)
//       }
//     }
//   }

//   if (isObject(on)) {
//     for (const event in on) {
//       if (Object.hasOwnProperty.call(on, event)) {
//         const func = on[event]

//         domEl.addEventListener(event, func, false)
//       }
//     }
//   }
// }
