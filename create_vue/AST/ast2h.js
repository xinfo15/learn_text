import h from '../diff/h.js'

// ast 转换为 h 函数
export default function ast2h(ast) {
  const vnodeChildren = []

  if (ast.type === 1) {
    for (const child of ast.children) {
      vnodeChildren.push(ast2h(child))
    }
  }

  const vnode = h(ast.tag, {
    // 与 `v-bind:class` 的 API 相同，
    // 接受一个字符串、对象或字符串和对象组成的数组
    class: ast.classBinding ?? ast.staticClass,
    key: ast.key,
    style: ast.style,
    // 普通的 HTML attribute
    attrs: ast.attrs,
    // DOM property
    domProps: {
      innerHTML: ast.html,
    },
    // 事件监听器在 `on` 内，
    // 但不再支持如 `v-on:keyup.enter` 这样的修饰器。
    // 需要在处理函数中手动检查 keyCode。
    on: ast.events,
  })
  console.log(vnode)
}
