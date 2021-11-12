let uid = 0

class Dep {
  constructor() {
    // 实例的id
    this.id = uid++
    // id hashtable
    this.idsMap = new Map()
    // 订阅者数组，保存watcher的实例
    this.subs = []
  }

  // 添加订阅
  addSub(sub) {
    // 添加前要确定当前watcher没有被添加订阅
    if (!this.idsMap.has(Dep.target.id)) {
      this.subs.push(sub)
      this.idsMap.set(Dep.target.id, true)
    }
  }

  // 添加订阅
  depend() {
    // Dep.target 用来保存当前正在读取数据的watcher
    if (Dep.target) {
      this.addSub(Dep.target)
    }
  }

  // 发布订阅
  notify() {
    // 浅复制一份，还不知道为什么！！！！！！！！
    // const subs = this.subs.slice()
    const subs = this.subs

    for (let i = 0, len = subs.length; i < len; i++) {
      subs[i].update()
    }
  }
}

export default Dep
