import Vue from './Vue/Vue.js'

window.vm = new Vue({
  el: '#app',
  template: '#template',
  data: {
    arr: ['1', '2', '3'],
    item: 'vue类基本功能实现',
    blogList: [],
    hasComm: false,
    testIfElse: 5,
    cateList: [
      {
        id: 0,
        name: '搞笑',
        isActive: true,
      },
      {
        id: 1,
        name: '游戏',
        isActive: false,
      },
      {
        id: 2,
        name: '电影',
        isActive: false,
      },
      {
        id: 3,
        name: '现实',
        isActive: false,
      },
      {
        id: 4,
        name: '编程',
        isActive: false,
      },
      {
        id: 5,
        name: '美女',
        isActive: false,
      },
    ],
  },
  methods: {
    async getBlogList() {
      let { data } = await fetch('http://tp.freshone.top/index/home/get_blog/id/-2', {
        method: 'POST',
        body: JSON.stringify({
          page: 1,
        }),
        headers: { 'content-type': 'application/json' },
      }).then((res) => res.json())

      for (const item of data) {
        item.hasComm = false
      }

      this.blogList = data
      // console.log(data)
    },
    func(e) {
      console.log(e)
    },
    changeCateActive(e, id) {
      const cateList = this.cateList

      for (const cateItem of cateList) {
        if (cateItem.id !== id) {
          if (cateItem.isActive === true) {
            cateItem.isActive = false
          }
        } else {
          if (cateItem.isActive === false) {
            cateItem.isActive = true
          }
        }
      }
    },
  },
  created() {
    this.getBlogList()
  },
  mounted() {
    // console.log(this._render)
  },
})
