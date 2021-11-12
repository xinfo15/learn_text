import Scanner from '../mustache/Scanner.js'
import parseAttrs from './parseAttrs.js'

export default function parse(templateStr) {
  // 新建一个扫描器
  const scanner = new Scanner(templateStr)
  // 初始化一个栈顶，children保存解析完的ast树
  const stack = [{ children: [] }]

  while (scanner.notEnd()) {
    // 文本节点
    let text = scanner.scanUntilDelimiter('<')
    text = text && text.trim()
    if (text) {
      const newText = { text, type: 3 }
      // 加入栈顶的children里
      stack[stack.length - 1].children.push(newText)
    }
    scanner.skipDelimiter('<')
    // 元素节点
    let tag = scanner.scanUntilDelimiter('>')
    tag = tag && tag.trim()
    if (tag) {
      // 首节点
      if (tag[0] !== '/') {
        const newTag = { tag, type: 1, attrs: [], children: [] }
        // 将attrs从tag里面解析出来
        parseAttrs(newTag)
        // 加入栈顶的children里
        stack[stack.length - 1].children.push(newTag)
        // 加入栈
        stack.push(newTag)
      }
      // 尾节点
      else {
        // 出栈
        stack.pop()
      }
    }
    scanner.skipDelimiter('>')
  }

  // 找到唯一的根节点

  return stack[0].children[0]
}
