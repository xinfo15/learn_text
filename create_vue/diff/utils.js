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

/**
 * 驼峰变为横线格式
 */
export const camelToLine = function(str) {
  
  return str.replace(/([a-z])([A-Z])/, (...args) => args[1] + '-' + args[2].toLowerCase())
}

/**
 * 横线格式变为驼峰
 * @param {*} str 
 * @returns 
 */
export const lineToCamel = function(str) {
  return str.replace(/([a-z])-([a-z])/, (...args) => args[1] + args[2].toUpperCase())
}
