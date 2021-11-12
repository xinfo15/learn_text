import parseTemplateToTokens from './parseTemplateToTokens.js'
import renderTokensToDomStr from './renderTokensToDomStr.js'

/**
 * mustache入口文件
 */
const Mustache = {
  render(template, data) {

    const tokens = parseTemplateToTokens(template)

    console.log(tokens)

    template = renderTokensToDomStr(tokens, data)

    return template
  },
}

export default Mustache
