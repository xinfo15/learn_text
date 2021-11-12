import Scanner from './Scanner.js'
import nestTokens from './nestTokens.js'

function parseTemplateToTokens(template) {
  const scanner = new Scanner(template)
  let tokens = []

  // text表普通字符
  // name表示模板变量
  while (scanner.notEnd()) {
    const text = scanner.scanUntilDelimiter('{{')
    if (text !== undefined) {
      tokens.push(['text', text])
    }
    scanner.skipDelimiter('{{')

    const name = scanner.scanUntilDelimiter('}}')
    if (name !== undefined) {
      tokens.push(['name', name.trim()])
    }
    scanner.skipDelimiter('}}')
  }
  
  return nestTokens(tokens)
}

export default parseTemplateToTokens
