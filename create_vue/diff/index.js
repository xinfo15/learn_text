import h from './h.js'
import patch from './patch.js';
import createElement from './createElement.js';

// console.log(h('div', {props: {id: 'box'}}, [
//   h('div', {props: {class: 'child'}}, '哈哈哈'),
//   h('div', {props: {class: 'child'}}, '哈哈哈'),
//   h('div', {props: {class: 'child'}}, '哈哈哈')
// ]));

const app = document.querySelector('#app');
const btn = document.querySelector('button');
btn.addEventListener('click', () => {
  patch(vnode1, vnode2)
})

// const vnode3 = h('ul', [
//   h('li', {}, '苹果'),
//   h('li', '西瓜'),
//   h('li', [
//     h('ol', [
//       h('li', '哈哈哈'),
//       h('li', '嘻嘻嘻')
//     ])
//   ]),
//   h('li', h('ol', h('li', '火龙果')))
// ])

// h('li', { key: 'E' }, 'E'),
// h('li', { key: 'D' }, 'D'),
// h('li', { key: 'C' }, 'C'),
// h('li', { key: 'B' }, 'B'),
// h('li', { key: 'A' }, 'A'),


  // h('li', { key: 'Q' }, 'Q'),
  // h('li', { key: 'A' }, 'A'),
  // h('li', { key: 'B' }, 'B'),
  // h('li', { key: 'C' }, 'C'),
  // h('li', { key: 'D' }, 'D'),
  // h('li', { key: 'E' }, 'E')
const vnode2 = h('ul', [
  h('li', { key: 'Q' }, 'Q'),
  h('li', { key: 'E' }, 'E'),
  h('li', { key: 'D' }, 'D'),
  h('li', { key: 'C' }, 'C'),
  h('li', { key: 'B' }, 'B'),
  h('li', { key: 'A' }, [
    h('ol',{key: 'ol'}, [
      h('li', { key: 'Q' }, 'Q'),
      h('li', { key: 'E' }, 'E'),
      h('li', { key: 'D' }, 'D'),
      h('li', { key: 'C' }, 'C'),
      h('li', { key: 'B' }, 'B'),
      h('li', { key: 'A' }, 'A'),
    ])
  ]),
])
const vnode1 = h('ul', [
  h('li', { key: 'A' }, [
    h('ol', {key: 'ol'}, [
      h('li', { key: 'A' }, 'A'),
      h('li', { key: 'B' }, 'B'),
      h('li', { key: 'C' }, 'C'),
      h('li', { key: 'D' }, 'D'),
      h('li', { key: 'E' }, 'E')
    ])
  ]),
  h('li', { key: 'B' }, 'B'),
  h('li', { key: 'C' }, 'C'),
  h('li', { key: 'D' }, 'D'),
  h('li', { key: 'E' }, 'E')
])

patch(app, vnode1)


