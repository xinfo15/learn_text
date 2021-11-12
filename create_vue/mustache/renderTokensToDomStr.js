import lookup from './lookup.js'

/**
 * 把tokens渲染从dom字符串
 * @param {*} tokens 
 * @param {*} data 
 * @returns 
 */
function renderTokensToDomStr(tokens, data) {
  let domStr = ''

  for (const token of tokens) {
    const type = token[0]
    const content = token[1]

    // 字符类型直接累加
    if (type === 'text') {
      domStr += content
      continue
    }

    // name类型需要判断是不是循环
    switch (content[0]) {
      case '#':
        // 是循环就dfs返回解析后的template
        const children = token[2]
        const dataArr = lookup(data, content.substr(1))
        for (const item of dataArr) domStr += renderTokensToDomStr(children, item)
        break

      default:
        // 如果结果是对象，则返回stringify
        let str = lookup(data, content)
        str = str instanceof Object ? JSON.stringify(str) : str
        domStr += str
    }
  }

  return domStr
}

export default renderTokensToDomStr
