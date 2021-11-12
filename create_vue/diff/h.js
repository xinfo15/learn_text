import vnode from './vnode.js'

export default function h() {
  let sel
  let data
  let children = []
  let text
  let elm

  // console.log(arguments);

  switch (arguments.length) {
    case 3:
      if (Array.isArray(arguments[2])) children = arguments[2]
      else text = arguments[2]
    case 2:
      // chldren是数组，或者是有sel元素的一个vnode对象
      if (Array.isArray(arguments[1]) || (typeof arguments[1] === 'object' && arguments[1].sel !== undefined)) {
        if (Array.isArray(arguments[1])) children = arguments[1]
        else children.push(arguments[1])
      }
      // 普通对象
      else if (typeof arguments[1] === 'object') data = arguments[1]
      // 文本
      else text = arguments[1]
    case 1:
      sel = arguments[0]
      break
    default:
      throw Error('参数错误')
  }

  return vnode(sel, data, children, text, elm)
}
