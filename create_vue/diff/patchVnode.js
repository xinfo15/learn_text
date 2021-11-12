import { isSameVnode, hasText, hasChildren, isObject } from './utils.js'
import updateChildren from './updateChildren.js'
import createElement from './createElement.js'

/**
 * 两个vnode相同的情况，抽出来单独做一个函数
 * @param {*} oldVnode
 * @param {*} newVnode
 * @returns
 */
export default function patchVnode(oldVnode, newVnode) {
  // console.log(oldVnode);
  // 如果两个vnode 对象占同一块内存则什么都不做
  if (oldVnode === newVnode) return

  // 如果新 vnode 有 text 属性，则直接设置 old innerText 等于 new 的 text
  if (hasText(newVnode)) {
    if (oldVnode.text !== newVnode.text) {
      oldVnode.elm.textContent = newVnode.text
    }
  }
  // 如果新vnode 有children属性
  else {
    // 如果旧vnode 有 text 属性，清空old的text，加入new的children
    if (hasText(oldVnode)) {
      oldVnode.text = ''
      // 清空旧的字符
      oldVnode.elm.innerText = ''
      // 添加新的dom子节点
      for (const child of newVnode.children) {
        oldVnode.elm.appendChild(createElement(child))
      }
    }
    // 如果旧vnode 有 children 属性
    else {
      // console.log('新旧都有children')
      if (!oldVnode.children) oldVnode.children = []
      // 元素节点最小化比较属性
      patchAttrs(oldVnode, newVnode)

      updateChildren(oldVnode.elm, oldVnode.children, newVnode.children)
      // diff
    }
  }
}

// 最小化比较属性
function patchAttrs(oldVnode, newVnode) {
  const oldData = oldVnode.data
  const newData = newVnode.data

  if (oldData.class !== newData.class) {
    oldVnode.elm.className = newData.class
  }

  if (oldData.style !== newData.style) {
    oldVnode.elm.style = newData.style
  }

  if (isObject(newData.attrs)) {
    const newAttrs = newData.attrs
    const oldAttrs = oldAttrs.attrs
    let attrs = {}
    Object.assign(attrs, newAttrs, oldAttrs)

    for (const attr in attrs) {
      if (newAttrs) {
      }
    }

    console.log(attrs)
  } else if (isObject(oldData.attrs)) {
  }

  // console.log(oldData, newData)
}
