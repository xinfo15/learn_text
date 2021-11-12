export default function vnode(sel, data, children, text, elm) {
  let key
  if (typeof data === 'object') {
    key = data.key
  }
  // 删除空的子元素
  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      if (!child) {
        children.splice(i, 1)
        i--
      }
    }
  }

  return { sel, data, children, text, elm, key }
}
