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
      // 注释节点 &&
      if (tag.indexOf('!--') === 0) {
        // 如果tag末尾不是--，则说明匹配到了注释里面的内容，则跳过注释
        if (tag.lastIndexOf('--') !== tag.length - '--'.length) {
          // 注释节点移动到-->，用来跳过多行注释
          scanner.scanUntilDelimiter('-->')
          scanner.skipDelimiter('-->')
        }
      }
      // 首节点
      else if (tag[0] !== '/') {
        const newTag = { tag, type: 1, attrs: [], children: [], parent: stack[stack.length - 1] }

        // 加入栈顶的children里
        stack[stack.length - 1].children.push(newTag)

        // 双节点，需要加入栈；单节点则不需要
        if (tag[tag.length - 1] !== '/') {
          // 加入栈
          stack.push(newTag)
        }
        // 单节点，删除tagName中最后的'/'
        else {
          newTag.tag = newTag.tag.slice(0, -1)
        }
        // 将attrs从tag里面解析出来
        parseAttrs(newTag)
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
