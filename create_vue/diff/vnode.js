export default function vnode(sel, data, children, text, elm) {
  let key
  if (typeof data === 'object') {
    key = data.key
  }

  return { sel, data, children, text, elm, key }
}
