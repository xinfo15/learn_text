const stack = []
const resTokens = []

function addToken(token) {
  // 1. 普通类型判断自己是否在循环内
  //    1. 如果栈不空（在循环内），则push进栈顶数组内
  //    2. 如果栈空（不在循环内），则push进 最后结果tokens里
  if (stack.length) {
    const top = stack[stack.length - 1]
    top[2].push(token)
  } else {
    resTokens.push(token)
  }
}

/**
 * 循环嵌套模板
 * @param {*} tokens
 * @returns
 */
function nestTokens(tokens) {
  for (const token of tokens) {
    const type = token[0]

    // 如果是字符直接安装规则添加即可
    if (type === 'text') {
      addToken(token)
      continue
    }

    const content = token[1]
    // 嵌套是针对 name 类型判断的
    switch (content[0]) {
      case '#':
        // token[2] 是 children
        token[2] = token[2] || []

        // 0. 跟普通类型一样判断自己是否在循环内
        //    1. 如果栈不空（在循环内），则push进栈顶数组内
        //    2. 如果栈空（不在循环内），则push进 最后结果tokens里
        addToken(token)

        // 1. 只要是循环都要进栈
        stack.push(token)
        break

      case '/':
        // 遇到 / 就弹出栈顶（退出循环）
        stack.pop()
        break

      default:
        // 1. 普通 name 类型判断自己是否在循环内
        //    1. 如果栈不空（在循环内），则push进栈顶数组内
        //    2. 如果栈空（不在循环内），则push进 最后结果tokens里
        addToken(token)
    }
  }

  return resTokens
}

export default nestTokens
