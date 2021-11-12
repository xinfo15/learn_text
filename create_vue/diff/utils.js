/**
 * 判断两个虚拟节点是否相等
 * @param {*} vnodeone
 * @param {*} vnodetwo
 * @returns
 */
export const isSameVnode = function isSameVnode(vnodeone, vnodetwo) {
  return vnodeone.key === vnodetwo.key && vnodeone.sel === vnodetwo.sel
}

/**
 * 判断是否有text
 * @param {*} vnode
 */
export const hasText = function (vnode) {
  return vnode.text && (!vnode.children || (Array.isArray(vnode.children) && vnode.children.length === 0))
}

/**
 * 判断是否有children
 * @param {*} vnode
 * @returns
 */
export const hasChildren = function (vnode) {
  return Array.isArray(vnode.children) && vnode.children.length > 0
}

/**
 * 是否是obj类型
 * @param {*} obj
 * @returns
 */
export const isObject = function (obj) {
  return obj && typeof obj === 'object'
}
