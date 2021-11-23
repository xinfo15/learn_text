import Scanner from '../mustache/Scanner.js'
import { lineToCamel } from '../diff/utils.js'

// 把ast转换为render函数
// _c => h()
// _l => renderList()
// _s => toString()
export function renderAstToFunction(el) {
  const code = genarate(el)

  console.log(code)

  return new Function(`
    with (this) {
      return ${code}
    }
  `)
}

function genarate(el) {
  // if
  if (el.if) {
    return genIf(el)
  }
  // else
  else if (el.else) {
    return genElse(el)
  } else if (el.elseIf) {
    return genElseIf(el)
  }
  // for
  else if (el.for) {
    return genFor(el)
  }
  // 元素节点
  else if (el.type === 1) {
    return genElement(el)
  }
  // 文本节点
  else if (el.type === 3) {
    return genText(el)
  }
}

// 生成元素节点
function genElement(el) {
  let code = ''

  let children = '['
  for (const child of el.children) {
    children += genarate(child) + ','
  }

  children += ']'

  let data = '{'

  // 与 `v-bind=class` 的 API 相同，
  // 接受一个字符串、对象或字符串和对象组成的数组
  const classValue = el.classBinding ?? el.staticClass
  console.log(classValue)
  if (classValue) {
    data += 'class: ' + classValue + ','
  }
  const key = el.key
  if (key) {
    data += 'key: ' + el.key + ','
  }
  const style = el.style
  if (style) {
    data += 'style: ' + style + ','
  }

  // 普通的 HTML attribute
  data += genAttr(el.attrs)

  // console.log(atCode);

  // DOM property
  const domProps = {
    innerHTML: el.html,
  }
  if (domProps) {
    data += 'domProps: ' + JSON.stringify(domProps) + ','
  }

  // 事件监听器在 `on` 内，
  const events = el.events
  data += genEvents(events)

  data += '}'
  code = `_c("${el.tag}", ${data}${children.length > 0 ? ',' + children : ''})`
  // console.log(data)
  // console.log(code)
  return code
}

// 生成文本节点
function genText(el) {
  const scanner = new Scanner(el.text)
  const tokens = []

  while (scanner.notEnd()) {
    let text = scanner.scanUntilDelimiter('{{')
    text = text && text.trim()
    if (text) {
      tokens.push(`"${text}"`)
    }
    scanner.skipDelimiter('{{')

    let name = scanner.scanUntilDelimiter('}}')
    name = name && name.trim()
    if (name) {
      tokens.push(`_s(${name})`)
    }
    scanner.skipDelimiter('}}')
  }

  return `_h(${tokens.join('+')}), `
}

// 生成属性
function genAttr(attrs) {
  let atCode = ''
  if (Array.isArray(attrs)) {
    atCode += 'attrs: {'
    for (const attr of attrs) {
      // 以-结尾，直接删除-
      if (attr.name[attr.name.length - 1] === '-') {
        attr.name = attr.name.slice(0, -1)
      }
      atCode += lineToCamel(attr.name) + ': ' + attr.value + ','
    }
    atCode += '},'
  }

  return atCode
}

// 生成for
function genFor(el) {
  const exp = el.for
  const alias = el.alias
  const iterator1 = el.iterator1

  return `..._l(${exp}, function(${alias}, ${iterator1}) {
    return ${genElement(el)}
  })`
}

// 生成events
function genEvents(events) {
  let data = ''
  if (events && typeof events === 'object') {
    data += 'on: {'

    for (const event in events) {
      const eventConfig = events[event]
      const func = eventConfig.value
      data += event + ': function($event) {'
      const modifier = eventConfig.modifier
      if (modifier && typeof modifier === 'object') {
        const { stop, prevent } = modifier
        if (stop) {
          data += '$event.stopPropagation();'
        }
        if (prevent) {
          data += '$event.preventDefault();'
        }
      }

      if (func.indexOf('(') !== -1 && func.indexOf(')') !== -1) {
        data += func + ';},'
      } else {
        data += func + '($event);}, '
      }
    }
    data += '},'
  }

  // console.log(data)

  return data
}

// 生成if
function genIf(el) {
  // 生成条件数组，给后面的 else if 或 else 使用
  el.if = [el.if]
  return `_i(${el.if}, function() {
    return ${genElement(el)}
  })`
}

// 生成else
function genElse(el) {
  const children = el.parent.children
  const idx = children.indexOf(el)
  const prevSibling = children[idx - 1]

  if (!prevSibling || (!prevSibling.if && !prevSibling.elseIf)) {
    throw Error('不是正确的v-else语句')
  }

  // 上面所有if 或 elseif 的条件数组
  const prevExp = prevSibling.if || prevSibling.elseIf

  if (!Array.isArray(prevExp)) throw Error('else if语句错误！！！')
  let exp = ''
  // 前面的所有条件，取反后 与 起来
  for (let i = 0, len = prevExp.length; i < len; i++) {
    const item = prevExp[i]

    exp += `!(${item})${i !== len - 1 ? ' && ' : ''}`
  }

  return `_i(${exp}, function() {
    return ${genElement(el)}
  })`
}

// 生成else-if
function genElseIf(el) {
  const children = el.parent.children
  const idx = children.indexOf(el)
  const prevSibling = children[idx - 1]

  if (!prevSibling || (!prevSibling.if && !prevSibling.elseIf)) {
    throw Error('不是正确的v-else语句')
  }

  // 上面所有if 或 elseif 的条件数组
  const prevExp = prevSibling.if || prevSibling.elseIf

  if (!Array.isArray(prevExp)) throw Error('else if语句错误！！！')
  // 前面的所有条件，取反后 与 起来，然后与上自己的条件
  let exp = ''
  for (const item of prevExp) {
    exp += `!(${item}) && `
  }
  exp += el.elseIf

  // 把自己的条件加入条件数组
  prevExp.push(el.elseIf)
  el.elseIf = prevExp

  return `_i(${exp}, function() {
    return ${genElement(el)}
  })`
}
