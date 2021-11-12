/**
 * 解析数组中的值
 * @param {查值的对象} obj 
 * @param {键值} key 
 * @returns 
 */
function lookup(obj, key) {
  // // key等于 '.' ，即返回本身
  if (key === '.') return obj

  // 默认为key中没点
  let keyArr = [key]
  // 如果有点就进行拆分
  if (key.indexOf('.') !== -1) keyArr = key.split('.')
  for (let i = 0; keyArr[i] !== undefined; i++) {
    obj = obj[keyArr[i]]
  }

  return obj
}

export default lookup
