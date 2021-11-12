import Scanner from '../mustache/Scanner.js'

// 把ast转换为render函数
// _c => h()
// _l => renderList()
// _s => toString()
export function renderAstToFunction(el) {
  const code = genarate(el)

  // console.log(code)

  return new Function(`
    with (this) {
      return ${code}
    }
  `)
}

function genarate(el) {
  // for
  if (el.for) {
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

  let children = []
  for (const child of el.children) {
    children.push(genarate(child))
  }

  children = '[' + children.join(',') + ']'

  let data = '{'

  // 与 `v-bind=class` 的 API 相同，
  // 接受一个字符串、对象或字符串和对象组成的数组
  const className = el.classBinding ?? el.staticClass
  if (className) {
    data += 'class: ' + className + ','
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
  const attrs = el.attrs
  if (Array.isArray(attrs)) {
    const attrObj = {}
    for (const attr of attrs) {
      attrObj[attr.name] = attr.value
    }
    data += 'attrs: ' + JSON.stringify(attrObj) + ','
  }

  // DOM property
  const domProps = {
    innerHTML: el.html,
  }
  if (domProps) {
    data += 'domProps: ' + JSON.stringify(domProps) + ','
  }

  // 事件监听器在 `on` 内，
  // 但不再支持如 `v-on=keyup.enter` 这样的修饰器。
  // 需要在处理函数中手动检查 keyCode。
  const events = el.events
  if (events && typeof events === 'object') {
    data += 'on: '
    for (const event in events) {
      if (events.hasOwnProperty.call(events, event)) {
        const eventConfig = events[event]
        const func = eventConfig.value
        const modifier = eventConfig.modifier
        data += '{' + event + ': function($event) {'
        if (modifier && typeof modifier === 'object') {
          const { stop, prevent } = modifier
          if (stop) {
            data += '$event.stopPropagation();'
          }
          if (prevent) {
            data += '$event.preventDefault();'
          }
        }
        data += func + '($event);}'

        events[event] = code
        data += '}'
      }
    }
  }

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

  return `_c(undefined, undefined, undefined, ${tokens.join('+')})`
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