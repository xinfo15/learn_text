class Scanner {
  constructor(template) {
    this.template = template
    // 当前扫描到的位置
    this.pos = 0
  }

  /**
   * 用来跳过定界符
   * @param {*} delimiter
   */
  skipDelimiter(delimiter) {
    this.pos += delimiter.length
  }

  /**
   * 扫描到定界符停止，用来收集定界符之前的字符
   * @param {*} delimiter
   * @returns
   */
  scanUntilDelimiter(delimiter) {
    let str
    // let notScanTemplate = this.template.substr(this.pos)

    // 第一种方式：通过维护一个未扫描到的尾数组，如果尾数组的头部等于 定界符，那么定界符之前的字符就已经收集完毕了
    // while (this.notEnd() && notScanTemplate.indexOf(delimiter) !== 0)
    // {
    //   str = str || ''
    //   str += this.template[this.pos]
    //   this.pos ++
    //   notScanTemplate = this.template.substr(this.pos)
    // }

    // 第二种方式：通过 pos 位置将template隔断为两段，只要以pos开始的 第二段 的头部等于定界符，那么pos之前的 第一段 作为定界符之前的字符就收集完毕了
    while (this.notEnd() && this.startWith(this.template, this.pos, delimiter) !== true) {
      str = str || ''
      str += this.template[this.pos]
      this.pos++
    }

    return str
  }

  /**
   * 判断str中以pos下标为首的字符串是否以delimeter开头
   * @param {*} str
   * @param {*} pos
   * @param {*} delimiter
   */
  startWith(str, pos, delimiter) {
    for (let i = 0; i < delimiter.length; i++) {
      if (delimiter[i] !== str[pos + i]) return false
    }
    return true
  }

  // 是否没有结束，是否可以继续执行
  notEnd() {
    return this.pos < this.template.length
  }
}

export default Scanner
