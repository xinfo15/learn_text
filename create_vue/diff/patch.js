// patch 修补、补丁的意思，跟diff很类似的理念
import vnode from './vnode.js'
import createElement from './createElement.js'
import { isSameVnode, hasText, hasChildren } from './utils.js'
import patchVnode from './patchVnode.js'

export default function patch(oldVnode, newVnode) {
  // 判断 旧vnode 是不是dom节点，如果是就转换为vnode
  if (!oldVnode.sel && oldVnode.nodeType === 1) {
    oldVnode = vnode(oldVnode.tagName.toLowerCase(), undefined, undefined, undefined, oldVnode)
  }

  // 判断两个vnode 的key 和 sel 是否相等，相等则判定是一个vnode
  if (isSameVnode(oldVnode, newVnode)) {
    // console.log('两个虚拟节点相等')
    newVnode.elm = oldVnode.elm
    patchVnode(oldVnode, newVnode)
  } else {
    // console.log('两个虚拟节点不相等')
    // 两个虚拟节点不相等，暴力删除旧的，添加新的
    oldVnode.elm.parentNode.insertBefore(createElement(newVnode), oldVnode.elm)
    oldVnode.elm.parentNode.removeChild(oldVnode.elm)
  }
}
