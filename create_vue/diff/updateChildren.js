import createElement from './createElement.js'
import patch from './patch.js'
import { isSameVnode } from './utils.js'

/**
 * 子节点更新策略，diff核心
 * @param {*} parentNode
 * @param {*} oldVnode
 * @param {*} newVnode
 */
export default function updateChildren(parentNode, oldChildren, newChildren) {
  // 旧前
  let oldStartIdx = 0
  let oldStartVnode = oldChildren[oldStartIdx]
  // 旧后
  let oldEndIdx = oldChildren.length - 1
  let oldEndVnode = oldChildren[oldEndIdx]

  // 新前
  let newStartIdx = 0
  let newStartVnode = newChildren[newStartIdx]
  // 新后
  let newEndIdx = newChildren.length - 1
  let newEndVnode = newChildren[newEndIdx]

  // key 到 节点下标的 映射，用于存放 old 的映射，然后 new 用key实现O(1)时间复杂度映射到节点
  let keyMap

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 由于在旧子节点中，移动dom元素，会把对应的vnode置为undefined，所以需要特判一下
    if (!oldChildren[oldStartIdx]) {
      oldStartVnode = oldChildren[++oldStartIdx]
    } else if (!oldChildren[oldEndIdx]) {
      oldEndVnode = oldChildren[--oldEndIdx]
    } else if (!newChildren[newStartIdx]) {
      newStartVnode = newChildren[++newStartIdx]
    } else if (!newChildren[newEndIdx]) {
      newEndVnode = newChildren[--newEndIdx]
    }
    // 新前 和 旧前
    else if (isSameVnode(newStartVnode, oldStartVnode)) {
      // newStartVnode.elm = oldStartVnode.elm
      patch(oldStartVnode, newStartVnode)
      newStartVnode = newChildren[++newStartIdx]
      oldStartVnode = oldChildren[++oldStartIdx]
    }
    // 新后 和 旧后
    else if (isSameVnode(newEndVnode, oldEndVnode)) {
      // newEndVnode.elm = oldEndVnode.elm
      patch(oldEndVnode, newEndVnode)
      newEndVnode = newChildren[--newEndIdx]
      oldEndVnode = oldChildren[--oldEndIdx]
    }
    // 新后 和 旧前
    else if (isSameVnode(newEndVnode, oldStartVnode)) {
      // newEndVnode.elm = oldStartVnode.elm
      patch(oldStartVnode, newEndVnode)
      // 将新后和旧前的dom节点移动到旧后之后
      parentNode.insertBefore(oldChildren[oldStartIdx].elm, oldChildren[oldEndIdx].elm.nextSibling)
      // 然后置vnode 为 undefined
      oldChildren[oldStartIdx] = undefined

      newEndVnode = newChildren[--newEndIdx]
      oldStartVnode = oldChildren[++oldStartIdx]
    }
    // 新前 和 旧后
    else if (isSameVnode(newStartVnode, oldEndVnode)) {
      // newStartVnode.elm = oldEndVnode.elm
      patch(oldEndVnode, newStartVnode)
      // 将新前和旧后的dom节点移动到旧前之前
      parentNode.insertBefore(oldChildren[oldEndIdx].elm, oldChildren[oldStartIdx].elm)
      // 然后置vnode 为 undefined
      oldChildren[oldEndIdx] = undefined

      newStartVnode = newChildren[++newStartIdx]
      oldEndVnode = oldChildren[--oldEndIdx]
    }
    // 循环 在旧子节点中 找与新前匹配的节点
    else {
      if (keyMap === undefined) {
        keyMap = {}

        for (let i = 0; i < oldChildren.length; i++) {
          const child = oldChildren[i]
          if (!child) continue

          keyMap[child.key] = i
        }
      }

      // 新前节点在 旧子节点中的下标位置
      const oldVnodeIdx = keyMap[newStartVnode.key]

      // 如果新前节点在 旧子节点中不存在，则插入到旧前之前
      if (oldVnodeIdx === undefined) {
        parentNode.insertBefore(createElement(newStartVnode), oldStartVnode.elm)
      }
      // 如果存在，则将旧子节点中的相同节点移动到旧前之前
      else {
        // newStartVnode.elm = oldChildren[oldVnodeIdx].elm
        patch(oldChildren[oldVnodeIdx], newStartVnode)
        // 新前节点在 旧子节点中的相同节点 oldChildren[oldVnodeIdx]
        parentNode.insertBefore(oldChildren[oldVnodeIdx].elm, oldStartVnode.elm)

        // 移动后，将vnode置为undefined
        oldChildren[oldVnodeIdx] = undefined
      }
      // 操作完新前后，移动新前的位置
      newStartVnode = newChildren[++newStartIdx]
    }
  }

  // 如果新子节点还没遍历完，则需要新增
  if (newStartIdx <= newEndIdx) {
    // reference 是 insertBefore 的参照子节点
    // 1. 当oldChildren[newStartIdx] 被置为undefined的时候 会插入到末尾 有问题？？？？？？？？？？？？？？？？？？？？？？？
    // const reference = oldChildren[newStartIdx] ? oldChildren[newStartIdx].elm : undefined
    // 2. 直接在dom子节点中，找到该插入的位置，就没有undefined的问题
    const reference = parentNode.children[newStartIdx]

    for (let i = newStartIdx; i <= newEndIdx; i++) {
      parentNode.insertBefore(createElement(newChildren[i]), reference)
    }
  }
  // 如果旧子节点还没遍历完，则需要删减
  else if (oldStartIdx <= oldEndIdx) {
    for (let i = oldStartIdx; i <= oldEndIdx; i++) {
      if (!oldChildren[i]) continue
      parentNode.removeChild(oldChildren[i].elm)
    }
  }
}
