import { isSameVnode, hasText, hasChildren, isObject, camelToLine } from './utils.js'

// 最小化比较属性
export function patchAttrs(oldVnode, newVnode) {
  if (!isObject(oldVnode.data)) oldVnode.data = {}
  if (!isObject(newVnode.data)) newVnode.data = {}
  const oldData = oldVnode.data
  const newData = newVnode.data

  if (oldData.class !== newData.class) {
    patchClass(oldVnode.elm, oldData, newData)
  }

  if (oldData.style !== newData.style) {
    oldVnode.elm.style = newData.style
  }

  patchCommonAttrs(oldVnode.elm, oldData, newData)

  patchEvens(oldVnode.elm, oldData, newData)
}

function patchClass(domEl, oldData, newData) {
  const className = newData.class
  // 对象格式的class 转换为字符串
  if (isObject(className)) {
    let classStr = ''
    for (const classKey in className) {
      const isIn = className[classKey]
      if (isIn) {
        classStr += classKey + ' '
      }
    }
    newData.class = classStr
  }

  if (oldData.class !== newData.class) {
    domEl.className = newData.class
  }
}

function patchCommonAttrs(domEl, oldData, newData) {
  if (!isObject(newData.attrs)) newData.attrs = {}
  if (!isObject(oldData.attrs)) oldData.attrs = {}

  const newAttrs = newData.attrs
  const oldAttrs = oldData.attrs
  let attrs = {}
  Object.assign(attrs, newAttrs, oldAttrs)

  for (const attr in attrs) {
    const newAt = newAttrs[attr]
    const oldAt = oldAttrs[attr]

    // 如果新旧都有该属性
    if (newAt && oldAt) {
      if (newAt !== oldAt) {
        domEl.setAttribute(camelToLine(attr), newAt)
      }
    } else if (newAt) {
      domEl.setAttribute(camelToLine(attr), newAt)
    } else {
      domEl.removeAttribute(attr)
    }
  }
}

function patchEvens(domEl, oldData, newData) {
  // on只在旧oldVnode中没有on属性的时候，才绑定事件，即第一上树时才绑定
  if (!isObject(oldData.on) && isObject(newData.on)) {
    const on = newData.on
    for (const event in on) {
      if (Object.hasOwnProperty.call(on, event)) {
        const func = on[event]

        domEl.addEventListener(event, func, false)
      }
    }
  }
}
