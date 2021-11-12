// 将attrs从tag里面解析出来(注意：不能使用split空格分隔属性，因为class里面也有空格)
// 使用循环检测是否在引号里面，合理处理空格，爆赞算法
export default function parseAttrs(newTag) {
  const tagName = newTag.tag
  let attrStr = ''
  // tag 中第一个空格之前是标签名，之后是全部属性
  const firstSpaceIdx = tagName.indexOf(' ')
  // 第一个空格存在
  if (firstSpaceIdx !== -1) {
    attrStr = tagName.substring(firstSpaceIdx)
    // 加一个空格方便后面转换为数组
    attrStr += ' '
    newTag.tag = tagName.substring(0, firstSpaceIdx)
  }

  // 是否在引号内
  let inQuotes = false
  // 当前属性的开始下标
  let start = 0
  // 属性转换后的数组
  let attrs = []
  // 属性的键值对映射版attrs
  let attrsMap = []

  for (let end = 0, len = attrStr.length; end < len; end++) {
    const char = attrStr[end]
    // 如果等于引号，那么改变引号状态
    if (char === '"') {
      inQuotes = !inQuotes
    }
    // 没在引号里，并且遇到了空格，则将当前start-end属性加入attrs
    if (!inQuotes && char === ' ') {
      let currentAttr = attrStr.substring(start, end)
      currentAttr = currentAttr && currentAttr.trim()
      if (currentAttr.length > 0) {
        // 转换为对象格式
        currentAttr = currentAttr.split('=')
        const attrObj = { name: currentAttr[0] && currentAttr[0].trim(), value: currentAttr[1] && currentAttr[1].trim() }
        // 分类属性
        classifyAttr(attrObj, newTag, attrs, attrsMap)
        // 将start指向下一个属性的开头
        start = end + 1
      }
    }
  }

  newTag.attrs = attrs
  newTag.attrsMap = attrsMap

  // console.log(newTag);
}

// 分类属性
function classifyAttr(attrObj, newTag, attrs, attrsMap) {
  // 如果是v-bind 则删除引号，即改变成不是字符型
  if (attrObj.name.indexOf(':') === 0 || attrObj.name.indexOf('v-bind:') === 0) {
    if (attrObj.name.indexOf(':') === 0) {
      attrObj.name = attrObj.name.substr(1)
    } else {
      attrObj.name = attrObj.name.substr(7)
    }

    attrObj.value = attrObj.value.replace(/\"/g, '')

    // 类名 分为：staticClass 和 classBinding
    if (attrObj.name === 'class') {
      newTag.classBinding = attrObj.value
      return
    }
  }

  // 如果是v特殊的属性
  const specialAttr = ['key', 'ref', 'is', 'class', 'style']
  if (specialAttr.indexOf(attrObj.name) !== -1) {
    switch (attrObj.name) {
      // 类名 分为：staticClass 和 classBinding
      case 'class':
        newTag.staticClass = attrObj.value
        break
      case 'is':
        // is 属性会产生一个 component 属性
        newTag['component'] = attrObj.value
        break
      default:
        newTag[attrObj.name] = attrObj.value
    }
  }
  // 处理事件
  else if (attrObj.name.indexOf('@') === 0) {
    attrObj.name = attrObj.name.substr(1)
    attrObj.value = attrObj.value.replace(/\"/g, '')
    // 解析事件
    parseEvent(attrObj, newTag)
  }
  // 处理事件
  else if (attrObj.name.indexOf('v-on:') === 0) {
    attrObj.name = attrObj.name.substr(5)
    attrObj.value = attrObj.value.replace(/\"/g, '')
    // 解析事件
    parseEvent(attrObj, newTag)
  }
  // 处理v-指令
  else if (attrObj.name.indexOf('v-') === 0) {
    attrObj.name = attrObj.name.substr(2)
    try {
      attrObj.value = attrObj.value && attrObj.value.replace(/\"/g, '')
    } catch (error) {
      console.log(attrObj);
    }
    parseVAttr(attrObj, newTag)
  }
  // 普通属性
  else {
    attrs.push(attrObj)
    attrsMap[attrObj.name] = attrObj.value
  }
}

// 解析事件
function parseEvent(attrObj, newTag) {
  if (!attrObj.name) return
  // 初始化events
  if (newTag.events === null || typeof newTag.events !== 'object') {
    newTag.events = {}
  }
  // 处理事件 是否有 .stop.prevent
  const eventArr = attrObj.name.split('.')

  const events = newTag.events
  // 给当前事件初始化
  const currentEvent = {
    value: attrObj.value,
  }
  events[eventArr[0]] = currentEvent
  const modifier = {}
  currentEvent.modifier = modifier
  // 给当前事件加入事件修饰符
  for (let i = 1, len = eventArr.length; i < len; i++) {
    modifier[eventArr[i]] = true
  }
}

// 处理v-指令
function parseVAttr(attrObj, newTag) {
  const { name, value } = attrObj

  switch (name) {
    case 'for':
      const forReg = /\(\s*(.+?)\s*,\s*(.+?)\s*\)\s+in\s+(.+)/
      if (forReg.test(value)) {
        const match = value.match(forReg)

        newTag.alias = match[1]
        newTag.iterator1 = match[2]
        newTag.for = match[3]
      }
      break
    case 'else':
      newTag.else = true
      break
    // model后面会来加功能？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？
    case 'model':
    case 'if':
    case 'else-if':
    default:
      newTag[name] = value
      break
  }
}
