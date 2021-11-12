import Vue from '../Vue/Vue.js'

const templateStr = `
    <div class="box" v-on:click.stop.prevent="func" key="box" style="color: red;" data-src="a/1.jpg">
      <h3 class="title">我是一个标题</h3>
      <ul>
        <li v-for="(   item  ,   idx  )   in    arr" :key="idx" :class="item">
        {{item}}
        </li>
      </ul>
    </div>
`

window.vm = new Vue({
  el: '#app',
  template: '#template',
  // template: templateStr,
  data: {
    arr: ['1', '2', '3'],
    item: 'vue类基本功能实现',
    blogList: [],
    hasComm: false
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
  },
  created() {
    this.getBlogList()
  },
  mounted() {
    // console.log(this._render)
  },
})
