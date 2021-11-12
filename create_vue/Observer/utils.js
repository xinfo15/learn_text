/**
 * 通过defineProperty定义属性值，可设置限定属性
 * @param {*} obj
 * @param {*} key
 * @param {*} value
 * @param {*} enumerable
 */
export const def = function (obj, key, value, enumerable) {
  Object.defineProperty(obj, key, {
    value,
    enumerable,
  })
}

/**
 * parsePath返回一个用来拆分同结构obj.a.b.c类似的表达式，然后返回最终的属性值的函数
 * @param {*} key
 * @returns
 */
export const parsePath = function (key) {
  const keyArr = key.split('.')

  return (obj) => {
    for (let i = 0, len = keyArr.length; i < len; i++) {
      if (!obj) return
      obj = obj[keyArr[i]]
    }

    return obj
  }
}

/**
 * 用于通过stringify输出对象，不是对象则原样返回
 * @param {*} value
 * @returns
 */
export const stringify = function (value) {
  return typeof value === 'object' ? JSON.stringify(value) : value
}
