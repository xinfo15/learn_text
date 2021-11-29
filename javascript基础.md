# javascript基础

## script标签

1. async：立即异步**下载**，不保证按出现顺序执行（只对外部文件有效）
2. defer：立即下载，延迟到文档完全被解析和显示之后**执行**（只对外部文件有效）
3. type: module：会被当做es6模块

## var\let\const的区别

1. var有声明提升，let和const没有，因此let和const就有了暂时性死区
2. var的作用域是函数，let和const的作用域是块
3. var和let是变量，const是常量必须在声明时初始化
4. var定义的全局变量会成为window的属性，而let和const则不会
5. var可以重复声明，let和const则不可以

## 判断变量是否是数组

```js
const arr = []
// 通过原型中的构造函数判断
Object.getPrototypeOf(arr).constructor === Array
// 判断是不是数组的构造函数创建的对象
arr instanceof Array

Array.isArray(arr)
```

## 数据类型

1. Number

2. Boolean

   ```js
   转换为false的值：
   1. false
   2. "" //空字符串
   3. 0、NaN
   4. null
   5. undefined
   
   逻辑操作符
   && 第一个为false，返回第一个；否则返回第二个
   || 其中一个为false，则返回它；否则返回第二个
   ```

3. String

4. Object

5. Null

6. Undefined

7. Symbol 符号是原始值，是唯一、不可变的，用来标识唯一的对象属性，一般是js开发者定义功能使用。

## 函数定义调用和上下文创建的关系

### 执行上下文是什么？（全局上下文、函数上下文、eval()创建的上下文）

执行上下文就是代码执行的环境，规定了上下文中的变量和函数能访问哪些数据。

### 函数在定义和调用的时候发生了什么

#### 1. 函数定义

函数定义的时候，会创建它的作用域链，预装载包含上下文的作用域链，存放在[[scope]]内部属性中

#### 2. 函数调用

函数调用时，会创建该函数的执行上下文；然后通过复制[[scope]]来创建函数的作用域链；接着到了预编译阶段，会创建函数的活动对象作为变量对象，并将它推入作用域链顶端。

### 创建执行上下文的时候会发生什么

#### 1. this绑定

1. this绑定又分为直接调用和对象调用；
2. 直接调用this一般等于window（严格模式除外），对象调用this一般等于该对象。

#### 2. 创建词法环境

1. 词法环境其实就是包含标识符和变量映射关系的一种结构。
2. 包含环境记录和外部环境引用

#### 3. 创建变量环境

1. 变量环境和词法环境十分相似
2. 在es6中有明显不同，前者用来存储函数和变量(let/const)的绑定
3. 后者只用来储存var变量的绑定

### 函数预编译

1. 创建活动对象AO
2. 找到所有var声明的变量和形参声明，去作为活动对象的属性，置为undefined
3. 实参和形参值相统一
4. 找到所有函数声明（不是表达式！）去作为活动对象的属性（会覆盖变量声明），然后将函数体赋值给它
5. js解释执行

## 垃圾回收

### 标记清理（常用）

会标记所有在内存中的变量，然后去掉所有**在上下文中的变量**或**被上下文中变量引用的变量**的标记，之后再有标记的变量就一定不在上下文中，并不能被上下文中的变量访问，随后垃圾回收就会清理这些带标记变量并回收内存。

### 引用计数

对每个值都记录它被引用的次数，如果次数为0，则下一次垃圾回收就会回收这个值的内存

```js
举个栗子
值：'value' 次数cnt：0
let a = 'value' // cnt ++
let b = a 		// cnt ++
a = 'key'		// cnt --
b = 'key'		// cnt -- = 0 ‘value’值下次被清理

有个巨大的漏洞-》循环引用
function problem() {
    let a = {}
    let b = {}
    a.next = b
    b.next = a
}
两个{}的引用次数都是2
永远不会清0，所有他们会一直在内存中
```

## 内存泄露

本不该在内存中的变量和函数，一直存在于内存中；

一般就是误定义为全局变量和误使用闭包造成的。

## 原型和原型链

### 原型

只要创建一个函数，就会在函数的prototype属性创建一个原型对象，用于给对象 共享方法和属性。

### 原型链

如果原型是另一个类型的实例，那么原型也有另一个原型，因此便形成了原型链。

## 八大继承

### 1. 原型链继承

```js
function Father() {
    this.name = 'lizhengxin'
    this.attr = {
        age: 20,
        gender: 'male'
    }
}
Father.prototype.getName = () => console.log(this.name)

function Son() {
}
Son.prototype = new Father()

const obj = new Son()
const obj1 = new Son()
console.log(obj);

console.log(obj.attr === obj1.attr) // true

`缺点：
1. 在父类构造函数中定义的引用类型属性，是实例间共享的
2. 子类实例化时，不能向父类构造函数传参`
```

### 2. 盗用构造函数

```js
function Father(name) {
	this.attr = {
        name: name ?? 'lizhengxin',
        age: 20
    }
   	this.getAttr() {
        return this.attr
    }
}

function Son(name) {
    Father.apply(this, name)
    this.type = 'son'
}

const obj1 = new Son()
const obj2 = new Son('mayana')

console.log(obj1)
console.log(obj2)

`优点：
1. 解决了原型链继承的引用值共享问题
2. 子类实例化的时候可以给父类构造函数传参了`

`缺点：
1. 父类函数只能定义在构造函数内，不能重用
2. 不能使用父类原型上的方法和属性`
```

### 3. 组合继承（原型链 + 盗用构造函数）

```js
function Father(name) {
    this.attr = {
        name: name ?? 'default',
        age: 20
    }
}
Father.prototype.getAttr = function() {
    return this.attr
}

function Son(name) {
    Father.call(this, name)
}

Son.prototype = new Father()

const obj1 = new Son('lizhengxin')
const obj2 = new Son('mayana')

console.log(obj1)
console.log(obj2)
console.log(obj1.getAttr === obj2.getAttr) // true

`优点：
1. 父类私有属性定义在构造函数内，共享方法和属性定义在原型上
2. 子类可以访问父类原型上的方法和属性`

`缺点：父类构造函数要被调用两次`
```

### 4. 原型式继承

```js
function object(o) {
    function F() {}
    F.prototype = o
    return new F()
}
`在一个对象的基础上，建立一个新对象，相当于给传入的对象只醒了一次浅拷贝`

`缺点：跟原型链模式一样，引用值会共享`
```

### 5. 寄生式继承

```js
function createAnthor(original) {
    const clone = object(original)	// 在原对象基础上，建立一个新对象
    clone.sayHi = function() {		// 并在原基础上，增强新对象
        console.log('Hi')
    }
   	return clone
}
`缺点：
1. 引用值会共享
2. 函数不能重用`

`为什么叫寄生式继承？
我觉得是跟是否功能相同有关，就像原型式继承为什么不叫寄生式？那是因为新对象没有增加功能，和源对象一样，这种应该叫共生；而寄生式继承，新对象被增强了，所以就叫做寄生式，就想电影中的寄生兽一样，它在你的基础上建立，但是它最终会变得比你强！`
```

### 6. 寄生式组合继承

```js
inheritPrototype(Father, Son) {
    const prototype = object(Father.prototype)	// 原型式继承父类原型
    prototype.constructor = Son					// 增强
    Son.prototype = prototype
}

function Father(name) {
    this.attr = {
        name: name || 'default',
        age: 20
    }
}
Father.prototype.getAttr = function() {
    return this.attr
}

function Son(name) {
    Father.call(this, name)
}
inheritPrototype(Father, Son)

const obj1 = new Son('lizhengxin')
const obj2 = new Son('mayana')

`优点：解决了组合继承父类构造函数要调用两次的缺点`
```

### 7. 类继承类

```js
class Father {}

class Son extends Father {}
```

### 8. 类继承构造函数

```js
function Father() {}

class Son extends Father{}
```

## new的过程中发生了什么

1. 在内存中创建一个新对象
2. 这个新对象内的原型被赋值为构造函数的prototype原型属性
3. 构造函数的this被赋值为这个新对象
4. 逐行执行构造函数内的代码
5. 如果构造函数返回一个非空对象，则返回这个对象；否则返回刚创建的新对象。

## 箭头函数和普通函数的区别

1. 箭头函数没有arguments
2. 箭头函数不能用作构造函数
3. 箭头函数没有prototype属性
4. 箭头函数没有this指针，只能使用包含上下文中的this
5. 箭头函数不能使用new.target，普通函数可以

## 期约

### 期约的原理就是状态机

1. pending，表示未执行或正在执行的过程中
2. fulfilled，表示成功的完成
3. rejected，表示没有成功的完成

期约是异步回调地狱的解决方案，在执行器中的报错会自动执行reject(Error)

### promise.all(可迭代对象)

在一组promise全部解决后再解决

### promise.race(可迭代对象)

在一组promise中只要有一个期约解决或拒绝之后再解决或拒绝，不区分第一个期约是解决或拒绝，只要其中有一个期约落定，rece再之后也会落定

## DOM事件流

### 1. 事件捕获

事件捕获是指事件从最不具体的元素开始触发，即从层级最浅的元素依次向层级深的元素传递；实际上是为了在到达目标具体元素之前拦截事件。

### 2. 到达目标

### 3. 事件冒泡

事件冒泡是指事件从最具体的元素开始触发，即从层级最深的元素依次向上传递到层级浅的元素。

## ajax（async js and xml）

```js
// 同步
const isAsync = false
const requstBody = null

const xhr = new XMLHttpRequest()			// 创建xhr实例
xhr.open('get', '/api/getMsg?id=2', isAsync)// 准备要发送的请求，（method，url，isAsync）
xhr.send(requestBody)						// 正式发送请求，（请求体，一般post会用到）

if (xhr.status >= 200 && xhr.status < 300 || xhr.status ==304) {
    console.log(xhr.responseText)
} else {
    console.log('failed')
}

// 异步
const xhr = new XMLHttpRequest()
xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
        if (xhr.status >= 200 && xhr.status < 300 || xhr.status ==304) {
            console.log(xhr.responseText)
        } else {
            console.log('failed')
        }
    }
}
xhr.open('get', '/api/getMsg?id=2', true)
xhr.setRequestHeader('MyHeader', 'MyValue')	// 设置请求头部字段，必须在open之后send之前设置
xhr.setRequestHeader('content-type', '....') // 发送请求的时候一定记得设置content-type为自己发送的类型
xhr.send(null)

// 进度
xhr.onprogress = function(e) {
    if (e.lengthComputable) // 表示进度信息是否可用
        {
            console.log(e.position / event.totalSize + '%') // position表示接收到的字节数
        }
}

// 可以取消
xhr.abort()
```

## 简单请求和复杂请求(跨域请求才有)

浏览器限制，请求发送出去虽然返回结果被浏览器拦截，但是对服务器可能产生了影响；

### 简单请求

简单请求只能使用get、post、head这三个方法

简单请求的 HTTP 头只能是 Accept/Accept-Language/Conent-Language/Content-Type 等

简单请求的 Content-Type 头只能是 text/plain、multipart/form-data 或 application/x-www-form-urlencoded

不是复杂请求就是简单请求，就发送一次请求

### 复杂请求

不是简单请求就是复杂请求

复杂请求在第一次发送这种类型的请求时一共会发送两个请求

1. 预检请求，使用Options方法，包含头部：Origin（源域名)、Access-Control-Request-Method(请求想要使用的方法)、Access-Control-Request-Header(请求定义的自定义头部)
2. 正式请求

### *凭据请求

如果设置请求属性xhr.withCredentials: true，则这个请求也是凭据请求，请求时会带有(cookie、HTTP认证和客户端ssl证书)，当然也要服务端允许带有才行; Access-Control-Allow-Credentials: true这条语句表示服务端允许带有凭据。

## 闭包

1. 闭包就是引用了其他函数中的变量对象的函数

2. 一般发生在嵌套函数，而且内层函数被返回并引用；不返回被引用，则变量对象会被垃圾回收
3. 会导致其他函数的变量对象一直不会销毁

## this指针

1. 只要是直接调用 func(), 那么this就等于window（严格模式等于undefined）
2. 只要是对象方法调用，那么this就等于该对象
3. call\apply\bind调用则this是第一个参数

## 发布订阅者模式

1. 首先确定谁是发布者
2. 然后给发布者添加一个缓存列表，用于存放回调函数来通知订阅者
3. 最后就是发布消息，遍历缓存列表，依次触发里面存放的订阅者回调函数





# 手写js代码

## call/apply/bind

### call

```js
function myCall(thisPtr, ...params) {
  if (typeof thisPtr !== 'object') {
    thisPtr = {}
  }
  thisPtr.temp = this
  const res = thisPtr.temp(...arrParams)
  delete thisPtr.temp
  return res
}
Function.prototype.myCall = myCall
```

### apply

```js
function myApply(thisPtr, arrParams) {
  if (typeof thisPtr !== 'object') {
    thisPtr = {}
  }
  thisPtr.temp = this
  const res = thisPtr.temp(...arrParams)
  delete thisPtr.temp
  return res
}
Function.prototype.myApply = myApply
```

### bind

```js
function myBind(thisPtr, arrArg) {
  if (typeof thisPtr !== 'object') {
    thisPtr = {}
  }
  arrArg = arrArg || []
  const originalFunc = this

  return function bound() {
    // 如果new 构造函数
    if (this instanceof bound) {
      // 构造函数的 this指针 要指向所创建的对象，就是现在this
      thisPtr = this
      // 实例的原型应该被赋值为原来函数的原型
      this.__proto__ = originalFunc.prototype
    }
    return originalFunc.myApply(thisPtr, arrArg.concat(...arguments))
  }
}
Function.prototype.myBind = myBind

function test(age) {
  console.log('blabla  : ', this.name, 'age : ', age)
  this.gender = 'male'
}
const obj = { name: 'lizhengxin' }

// test.bind(obj)(20)

const bound = test.myBind(obj)
bound(20)
const res = new bound(20)
console.log(obj.gender);
console.log(res.gender)
```

## new

```js
function myNew(func, ...args) {
    const newObj = new Object()
    newObj.__proto__ = func.prototype
    const res = func.call(func, ...args)
    // 如果构造函数返回非空对象，则返回该对象
    if (res !== null && typeof res === 'object' && Object.keys(res).length !== 0)
        return res
    // 否则返回新对象
    return newObj
}
```

## Promise.all()

```js
function myPromiseAll(arrArgs) {
    if(!Array.isArray(arrArgs)) throw Error('参数必须是数组')
    
    return new Promise((resolve, reject) => {
        let cnt = 0;
        const len = arrArgs.length
        const arrAns = []
        arrArgs.forEach((item, idx) => {
            // resolve包装一下
            Promise.resolve(item).then((res) => {
                arrAns[idx] = res
                cnt ++ 
                if (cnt >= len) resolve(arrAns)
            })
        })
    })
}
```

## Promise.race()

```js
function myPromiseRace(arrArg) {
    if (!Array.isArray(arrArg)) throw Error('参数必须是数组')
    
    return new Promise((resolve, reject) => {
        
        arrArgs.forEach((item, idx) => {
            Promise.resolve(item).then((res) => {
                resolve(res)
            }).catch((err) => {
                reject(err)
            })
        })
    })
}
```

## Ajax

```js
const xhr = new XMLHttpRequest()
xhr.open('post', '/api/login', true)
xhr.setRequestHeader('Content-Type', 'application/json')
xhr.send(JSON.stringify({
    username: 'lizhengxin',
    password: 'lizhengxin'
}))

xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
			console.log(xhr.responseText)
        } else {
            console.log('failed')
        }
    }
}
```

## 扁平化数组

```js
function flattenArray(root) 
{
    if (!Array.isArray(root)) throw Error('参数必须是数组')
    let arrAns = []
    root.forEach((item, idx) => {
        if (Array.isArray(item)) 
        {
            arrAns = arrAns.concat(flattenArray(item))
        } else {
            arrAns.push(item)
        }
    })
    return arrAns
}
```
## 数组去重

```js
// hash方式，O(n)
function removeRepetition(arr) {
    if (!Array.isArray(arr)) throw Error('参数必须是数组')
    const visit = {}
    const ans = []
    
    arr.forEach((item, idx) => {
        if (visit[item] === undefined) 
        {
            ans.push(item)
            visit[item] = true
        }
    })
    
    return ans
}

// sort方式，O(nlogn)
function removeRepetition(arr) {
	arr.sort()
    const len = arr.length
    for (let i = 0, j = 0; i < len; i ++)
    {
        if (!i || arr[i] !== arr[i - 1])
        {
            arr[j ++ ] = arr[i]
        }
    }
    arr.length = j
    return arr
}
```

## 监听数组改变

```js
const reflect = {}
reflect.push = Array.prototype.push
reflect.pop = A
```

## 防抖节流函数

### 防抖

```js
function debounce(callback, delay) {
    let timer
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
           callback(...args) 
        }, delay)
    }
}
```

### 节流

```js
function throttle(callback, delay) {
    let timer
    return (...args) => {
        if (timer === undefined) {
            timer = setTimeout(() => {
                callback(...args)
                timer = undefined
            }, delay)
        }
    }
}
```





# css基础

## 盒子模型

盒子模型就是容纳html元素的一个容器，有宽高、边距、边框等

### 普通盒子(box-sizing: content-box)

宽高就是自身的宽高，然后边框和内边距不计算在内

### 怪异盒子(box-sizing: border-box)

宽高 = 自身宽高 + padding + border

## BFC块级格式化上下文

1. 定义：BFC是一个完全独立渲染的空间，让其子元素不受外部元素的任何影响。

2. 作用：用于解决高度塌陷、margin重叠、浮动问题

3. 实现：

   ```js
   1. float 不为none 脱离文档流
   2. position 是absolute和fixed 脱离文档流
   2. display 为inline-block, flex, inline-flex, table, table-cell, inline-table
   3. overflow 不为visible
   ```

## 水平垂直居中

### relative + transform 子元素不固定宽高

```css
.son {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
```

### flex 子元素不固定宽高

```js
.father{
    display: flex;
    justify-content: center;
    aligh-items: center;
}
```

### absolute + margin 子元素固定宽高

```js
.father {
    position: relative;
}

.son {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 200px;
    height: 200px;
    margin: auto;
}
```

## 两栏布局

### float  + margin

```js
.left {
   	float: left;
    width: 200px
}
.right {
    margin-left: 210px
}
```

### float + BFC

```js
.left {
    float: left;
    width: 200px
}
.right {
    overflow: hidden;
}
```

### flex

```js
.wrapper {
    display: flex
    align-items: flex-start;
}
.left {
    width: 200px;
    flex-shrink: 0; // flex的第二个参数禁止收缩
}
.right {
    flex: 1 1 auto;
}
```

### absolute+ margin

```js
.left {
    position: absolute;
    width: 200px
}
.right {
    margin-left: 200px
}
```

### absolute + absolute . left

```js
.left {
    position: absolute;
    width: 200px
}
.right {
   	position: absolute;
    left: 200px;
    right: 0;
}
```

## 三栏布局

### 流体布局(浮动布局) 跟 position差不多

```html
<style>
	.wrapper {
        overflow: auto;
        }
    .left {
        float: left;
        width: 200px
    }
    .right {
        float: right;
        width: 200px;
    }
    .main {
        margin: 0 200px; // marin法
        overflow: auto: // BFC法
    }
</style>
<div class="wrapper">
    <div class="left">
        
    </div>
    <div class="right">
        
    </div>
    <div class="main">
        
    </div>
</div>
```

### 圣杯

```html
原理：外部盒子给出两栏宽度的padding，三个元素都浮动，通过margin 和 relative 调整两栏变到一行去
缺点：屏幕宽度小于两栏宽度 + padding时，布局会乱
`类书写的顺序，就是元素排版的顺序`
<style>
    .wrapper {
        padding: 0 200px;
        .main {
            float: left;
            width: 100%;
        }
        .left {
            float: left;
            width: 200px;
            margin-left: -100%;
            position:relative;
            left: -200px;
        }
        .right {
            float: right;
            width: 200px
            margin-left: -100%;
            position:relative;
            right: -200px;
        }
    }
</style>
```

### 双飞翼（完满三栏）

```html
原理：在圣杯的基础上，删去了外部容器的padding，让外部容器宽度100%的浏览器宽度，margin-left参照的宽度变大，因此不需要relative，也就解决了宽度小于两栏宽度+padding时布局会乱的问题（因为relative元素一直在原地）；重点通过在main中加了main-content，使用其margin空出两栏位置

`类书写的顺序，就是元素排版的顺序`
<style>
    .wrapper {
        overflow: auto;
        
        .main {
            float: left;
            width: 100%;
            
            .main-content {
                margin: 0 200px;
            }
        }
        
        .left {
            float: left;
            margin-left: -100%;
            width: 200px;
        }
        
        .right {
            float: right;
            margin-left: -100%;
            width: 200px;
        }
    }
    
</style>
```

## 选择器优先级

1. !important 是最高优先级
2. css将 **行内样式、id选择器、类/伪类/属性选择器、元素/伪元素选择器，按次序划分为一个四位元组(0, 0, 0, 0)**；比如：每多一个类选择器第三位就 + 1，比较方式就是从前向后一次比较，类似字符串比较
3. 其余就不计算在优先级内

## 文字超出省略号

### 单行

```js
.one-line {
	overflow: hidden;
    text-overflow: ellipsis;
    white-space: no-wrap;
}
```

### 多行

```js
.many-lines {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2
}
```

## z-index在什么时候有效

当position被设置为 absolute, fixed, relative, sticky时，元素的层级会变得比普通元素高，同时就可以使用z-index进行层级调整

注意：

1. 设置z-index层级只对兄弟节点有效
2. 当position：sticky时，将z-index设置为<=0时，会使sticky本身功能丧失





# vue

## 生命周期

1. beforeCreate 实例初始化之后，设置数据监听、事件监听、属性、方法之前调用
2. created 实例创建完成后调用，即数据监听、事件监听、属性、方法被配置完毕后调用
3. beforeMount 挂载开始之前调用
4. mounted 实例挂载完后调用，但不保证所有子组件都挂载完成
5. beforeUpdate 数据修改后，dom渲染前调用
6. updated 修改后的数据已经渲染到dom之后调用，但不保证的所有子组件都渲染完成
7. activated 被keep-alive缓存的组件激活时调用
8. deactivated 被keep-alive缓存的组件失活时调用
9. beforeDestroy 实例销毁前调用，此时实例完全可用
10. destroyed 实例销毁后调用

## 父子组件生命周期的执行顺序

父beforeCreate-> 父created -> 父beforeMounte -> 子beforeCreate ->子created ->子beforeMount ->子 mounted -> 父mounted

父beforeUpdate -> 子beforeUpdate -> 子updated -> 父updated

## 组件

组件是可复用的vue实例

## 插槽

插槽是内容分发的出口，一般用于封装组件，封装的组件只实现一个通用的框架，具体的内容需要开发者自己提供

### 具名插槽

设置了名字的插槽，叫做具名插槽，默认名字为：default

```js
Vue.component('son', {
    template: '<div>  <slot name="nameSlot"></slot>  </div>'
    created() {
    	// 在子组件中通过$slot.插槽名，可以获取父组件插槽中的内容
    	console.log(this.$slot.default)
	}
})

// 在其他组件中使用
// v-slot 可以缩写为 # 
<son> <template v-slot:nameSlot> 你的内容 </template> </son>
```

### 作用域插槽

作用域插槽就是让插槽内容能够访问子组件中的数据，通过给<slot>元素设置属性（插槽prop）实现

```js
Vue.component('son', {
    template: '<div>  <slot name="nameSlot" :user="user"></slot>  </div>'
})

// 在其他组件中使用，通过带值得 v-slot 引用 插槽prop
<son> <template v-slot:nameSlot="user"> 你的内容 {{ user.nickname }} </template> </son>
```

## 动态组件和异步组件

1. 动态组件是指动态生成组件 

   ```js
   // 通过is属性实现
   <component :is="componentName"></component>
   ```

2. 异步组件是指 按需异步加载组件

   ```js
   vue允许你用一个工厂函数定义你的组件，这函数被调用的时，会异步解析你的组件定义，并缓存结果复用。
   Vue.component('component1', () => import('@/components/component1'))
   ```
   
   

## 组件data为什么一定要定义成函数

因为组件是可以用来创建多个实例，如果data还是一个对象的话，那么所有实例将引用同一个数据对象；使用函数就不会这样，函数在创建一个组件实例的时候会被调用，然后返回一个数据对象的副本；

## props自定义属性

1. props对于基本数据类型是单向数据流的，父组件发生改变会传递到子组件，子组件一般不循序改变props
2. props对于引用类型，子组件可以改变引用类型的属性，因为是按引用值传递，所以父组件会跟着改变
3. props可以执行验证等操作

## computed计算属性

1. 计算属性的结果会被缓存（**并不是访问一次就计算一次**），除非依赖的**响应式**属性改变了才会重新计算（如果某个属性不是响应式则不会重新计算）
2. 用于解决在模板中的进行复杂逻辑计算难以维护的问题 
3. 用于一个属性需要随着其他属性变动而变动的情况
4. 默认情况下是getter的回调，可以通过设置setter来达到重新赋值给计算属性时，在回调中按特定规则更新依赖
5. 因为getter是通过同步执行一次来计算结果的，所以执行异步操作对结果没有任何影响

## watch监听属性

1. watch用于监听数据的变化
2. 用于数据变化时执行异步操作或开销比较大的操作

## nextTick机制

![image-20211117175010290](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20211117175010290.png)



```js
const queue = [] 是保存需要执行更新dom操作的watcher
const callbacks = [] 是保存下一次tick需要执行的回调函数

解决当前主执行栈中的代码多次更新数据造成的多次更新vnode，所以使用异步更新，同一个更新任务只会加入队列一次。
```

## vue2 和 vue3 的区别

### 数据响应式

1. vue2 使用 Object.defineProperty()不能响应式监听对象新增属性和删除属性，以及不能直接通过下标修改数组元素。vue3 使用 Proxy 监听对象可以实现。

2. vue3新增composition（组合式） API，将data，methods、生命周期钩子函数都写在一堆，然后封装成一个hook，将同一功能的代码组合在一起。不用再像vue2那样，要去data里定义数据、methods里定义方法、生命周期钩子里边写代码，代码关联系不高。

3. vue3 优化了更新

   ```js
   1. 事件缓存，定义了事件，就会缓存，下一次执行渲染函数，就不会重新构建
   2. 静态标记，在生成渲染函数的过程中，打上patchFlags，然后在patch的过程中判断标记来优化diff
   3. 静态提升，将不会变的节点或属性，将他们序列化为字符串，以此减少渲染成本，例：_createStaticVnode("<div><span class=\"foo\"></span><span class=\"foo\"></span><span class=\"foo\"></span><span class=\"foo\"></span><span class=\"foo\"></span></div>", 1)
   ```

   

# sql语句复习

## distinct 去重

```sql
select DISTINCT user_id from tb_blog
```

## insert into 表名 (列名) values (列值)

```sql
insert into tb_admin (admin_id, account, password, create_time) values (null, 'myn', '123456', now())
```

## update 表名 set 字段名=字段值

```sql
update tb_admin set password = 'sbmayana' where admin_id = 2
```

## delete from 表名 where 键=值

```sql
delete from tb_admin where admin_id = 2
```

## limit 0, 5 等价于 limit 5 offset 0

```sql
select * from tb_blog limit 5 offset 0 // 表示从第0条记录开始，取5条记录
```

## like通配符，%表示0个或多个字符，_代表一个字符

```sql
select nickname from tb_user where nickname like '[lunalizhengxin]%'
```

## in 元组

```sql
select nickname from tb_user where nickname in ('lizhengxin', 'luna')
```

## union + select语句

```sql
select * from tb_admin union select user_id, nickname, password, account, 5, 6 from tb_user
// 将两个多个select语句查询到的数据合并到第一个select的列下，要求后面的select语句的列数要与第一个select一致
```

## 给表中字段新建索引create index 索引名 on 表名 (列1，列2,...)

```js
// （加快查询速度，但是会减慢更新速度，因为索引也需要更新）
CREATE INDEX PersonIndex ON Person (LastName, FirstName)
```

## Date日期类函数

### now()，curdate(), curtime()

```sql
SELECT now(), curdate(), curtime()

now() 表示当前的日期的datetime类型
curdate() 当前日期的date类型
curtime() 当前日期的time类型
```

![image-20211104101603459](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20211104101603459.png)

### date(日期或时间) 提取日期或时间中的日期(date)部分

```sql
SELECT *, date(create_time) from tb_blog
```

![image-20211104102053136](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20211104102053136.png)

### extract(部分名 from 日期时间字段名) 提取日期时间中的部分

```sql
SELECT *, extract(DAY_MICROSECOND
 from create_time), extract(DAY_MICROSECOND
 from test_date), extract(DAY_MICROSECOND
 from test_time) from tb_blog

`部分名：`
MICROSECOND
SECOND
MINUTE
HOUR
DAY
WEEK
MONTH
QUARTER
YEAR
SECOND_MICROSECOND
MINUTE_MICROSECOND
MINUTE_SECOND
HOUR_MICROSECOND
HOUR_SECOND
HOUR_MINUTE
DAY_MICROSECOND
DAY_SECOND
DAY_MINUTE
DAY_HOUR
YEAR_MONTH
```

### DATE_ADD(date, interval value type) 函数向日期添加指定的时间间隔

```sql
select date_add(create_time, interval 30 day) from tb_blog // 加三十天
`type值：`
MICROSECOND
SECOND
MINUTE
HOUR
DAY
WEEK
MONTH
QUARTER
YEAR
SECOND_MICROSECOND
MINUTE_MICROSECOND
MINUTE_SECOND
HOUR_MICROSECOND
HOUR_SECOND
HOUR_MINUTE
DAY_MICROSECOND
DAY_SECOND
DAY_MINUTE
DAY_HOUR
YEAR_MONTH
```

### DATE_SUB(date, interval value type) 函数向日期减去指定的时间间隔

```sql
select test_time, date_sub(now(), interval 30 day), datediff(date_sub(now(), interval 30 day), test_time) from tb_blog
```

### DATEDIFF(date1, date2) 函数返回第一个日期减去第二个日期的天数

```sql
select test_time, date_sub(now(), interval 30 day), datediff(date_sub(now(), interval 30 day), test_time) from tb_blog
```

### date_format(date, format) 格式化日期

```sql
select create_time, date_format(create_time, '%Y-%m-%d %H:%i:%s') from tb_blog
```







# 网络

## 对称加密和非对称加密

### 对称加密

1. 对称加密是指 加密 和 解密的两方使用相同的秘钥
2. 优点：加密、解密速度快
3. 缺点：在第一次交换秘钥的过程中，容易暴露给别人

### 非对称加密

1. 非对称加密是指 加密 和 解密的两方使用不同的秘钥进行加密和解密（用公钥加密后的数据，只有私钥能解密）
2. 优点：使用两个秘钥，安全性较高，解决了第一次交换秘钥的过程中，容易暴露的问题
3. 缺点：加密、解密的过程会比对称加密慢很多



## [HTTPS的握手过程](https://segmentfault.com/a/1190000021494676#comment-area)

安全原理，结合了对称加密和非对称加密的优点，使用非对称加密传输 对称加密的秘钥，弥补了在传输过程中可能被截取对称加密秘钥的问题 和 完全使用非对称加密速度远比对称加密慢很多的问题

<img src="https://segmentfault.com/img/bVbCCMD" alt="SSL : TLS 握手过程" style="zoom: 150%;" />

1. **client hello**消息：客户端向服务端发送**client hello**消息发起握手请求，该消息包含了客户端所支持的 **TLS版本**、**加密算法的组合**以及一个随机字符串"**client random**"
2. "server hello"消息：服务端收到握手请求向服务端返回“server hello”消息，该消息包含了**`CA`证书、选择的加密算法组合**以及一个随机字符串"**server random**"
3. **premaster secret**字符串：客户端收到服务端**server hello**消息后，进行证书验证，并从证书中获取**公钥**，然后生成下一个随机字符串**premaster secret**将其用公钥加密后，发送给服务器
4. 服务端收到客户端发来的**premaster secret**字符串，用私钥将其解密
5. 客户端和服务器使用相同的加密算法对 **client random、server random、premaster secret**进行加密生成对称加密秘钥key
6. 客户端发送经过key加密过的**finished**信号
7. 服务端发送经过key加密过的**finished**信号
8. 握手完成

## HTTP和HTTPS的区别

1. 最重要的区别就是安全，HTTP明文传输，没有对数据进行加密安全性较差；HTTPS（HTTP + TLS/SSL）数据传输过程加密安全性较好
2. 使用HTTPS需要去专门的机构申请CA证书，需要花费一定费用
3. HTTP页面响应速度比HTTPS快，由于加了一层安全层，建立连接的过程更复杂，需要交换更多数据；而且加密解密的过程也需要时间，难免会变慢
4. HTTP和HTTPS使用的端口也不一样，前者用443，后者用80

## HTTP1.0 和 HTTP1.1和HTTP2.0的区别

### HTTP1.0 和 HTTP1.1的区别

1. **缓存处理**

   **HTTP1.0**主要使用If-Modified-Since和Expires来做为缓存判断的标准，**HTTP1.1**则新增了更多缓存控制策略Entity tag、If-None-Match、cache-control等等。

2. **长连接**

   **HTTP1.0**默认短连接，即没发送一次HTTP请求就要新建一个TCP连接，浪费了很多资源在新建连接和销毁连接上；**HTTP1.1**则默认长连接，即建立一个TCP连接可以发送多条HTTP请求，减少了建立关闭连接的消耗。

3. **带宽优化**

   **HTTP1.0**不支持发送部分数据，例如只需要某个对象的一部分，而服务端却把真个对象都发送了过来，导致了带宽的浪费；HTTP1.0并且不支持断点续传。**HTTP1.1**在请求头引入Range头部，它允许只请求资源的一部分（返回码为206 partial content），并且支持断点续传，解决了1.0带宽浪费的问题。

4. **Host域头部**

   **HTTP1.0**中认为每台服务器都绑定一个唯一的IP地址，因此请求中并没有传递主机域（hostname）。随着虚拟主机技术的发展，在一台物理服务器上可以存在多个虚拟主机，并且它们共享一个IP地址。**HTTP1.1**的请求消息的响应消息都支持host域，而且请求消息中没有host域会报错。

5. **HTTP1.0新增24个错误状态码**

### HTTP2.0 和 HTTP1.x 的区别

1. **二进制数据格式**

   **HTTP1.x**使用文本格式数据存在天然缺陷；**HTTP2.0**直接使用二进制格式数据，在应用层和传输层之间增加了一个二进制分帧层，在兼容HTTP1.x的基础上，改进传输性能，实现低延迟和高吞吐量。

2. **多路复用**

   **HTTP2.0**多路复用允许同时通过单一的TCP连接发送多重请求-响应消息。即使连接共享，提高连接的利用率，同个域名只需要占用一个TCP连接。**HTTP1.1**对同一域名的TCP并行连接数有限制一般为4~5个，超过限制则会阻塞，可以通过使用多个域名解决，但是会有很多TCP连接建立，由于拥塞控制，每个TCP刚建立会经历慢启动，会大大降低传输速度；还会产生多个TCP连接竞争带宽的情况。

3. **header压缩**

   **HTTP1.x** header中含有大量数据，并且每次发送请求都会重复发送；**HTTP2.0** 使用 HPACK 算法对header的数据进行压缩，通讯双方各自缓存一份 header fields 表，然后实行差量更新header，就只需要传输差量就行，这样就避免了重复传输。

4. **服务端推送**

   服务端推送是一种在客户端请求之前发送数据的机制。

   服务端可以在发送页面 HTML 时主动推送其它资源，而不用等到浏览器解析到相应位置，发起请求再响应。例如服务端可以主动把 JS 和 CSS 文件推送给客户端保存到本地缓存，而不需要客户端解析 HTML 时再发送这些请求。

## 拥塞控制

拥塞控制是用来解决由网络拥塞引起的路由器缓存溢出而造成丢包的问题，主要原理是通过拥塞窗口控制发送方的发送速率达成的。

### 拥塞控制的三种状态

超时的两种情况：1. 超时重传，ssthresh = cwnd / 2 , cwnd = 1MSS     2. 收到三个冗余ACK进入快速重传，ssthresh = cwnd / 2, cwnd = ssthresh + 3 MSS，尝试进入快速恢复一步到位

1. **慢启动** 

   将拥塞窗口设置为1个MSS（最大报文段长度），初始发送速率为MSS/RTT；只要发送方每收到一个报文的确认拥塞窗口就增加一个MSS，窗口呈指数增长；慢启动结束的三个阶段：

   ```js
   1. 当收到一个由超时指示的丢包事件（即发生拥塞），发送方立即将ssthresh（慢启动阈值）设置为当前窗口的的一半，并将拥塞窗口重置为1个MSS，并重新执行慢启动。
   2. 当在拥塞中慢启动等于ssthresh（慢启动阈值）时，还继续慢启动会有些鲁莽，所以转为拥塞避免阶段
   3. 如果检测3个冗余ACK（当接收方接收到一个失序报文时，立即响应一个重复ACK，在超时时间之，前提前告诉发送方，发送丢包事件，因为还能收到回复，证明拥塞没有超时那么严重），执行快速重传，并进入快速恢复阶段
   ```

2. **拥塞避免**

   进入拥塞避免时，拥塞窗口大小大约是上一次拥塞时值的一半，离拥塞并不遥远，所以应该谨慎增加拥塞窗口的大小；拥塞避免采用每个RTT只将cwnd增加一个MSS，即没收到一个ACK就将cwnd增加(MSS * MSS / cwnd)字节。

   拥塞避免结束的两个阶段：

   ```js
   1. 当收到一个请求超时，设置发送方ssthresh=cwnd / 2，并且cwnd = 1 MSS，然后进入慢启动状态
   2. 当收到三个冗余ACK（发送丢包事件），设置发送方ssthresh = cwnd / 2, 并且cwnd = ssthresh + 3MSS (要加上三个冗余ACK)，然后进入快速恢复状态
   ```

3. **快速恢复**

   如果还会收到冗余ACK，就每收到一个冗余ACK就将cwnd增加一个MSS，

   快重传和快恢复结束的两个阶段：

   ```js
   1. 当对丢失报文段的一个ACK到达时，设置发送方cwnd = ssthresh 后进入拥塞避免状态
   2. 当收到一个请求超时事件，ssthresh = cwnd / 2, cwnd = 1 MSS，之后进入慢启动状态
   ```

## HTTP缓存

- Expires

> 响应头，代表该资源的过期时间，服务端和浏览器端可能有时差，不准确

- Cache-Control

> 请求/响应头，缓存控制字段，精确控制缓存策略，主要子字段有 max-age 资源过期相对时间 和 no-cache 不使用强缓存；优先级比Expires高，只要有cache-control 就不判断 expires

- If-Modified-Since

> 请求头，带上 上次服务端返回的 last-modified

- Last-Modified

> 响应头，资源最近修改时间，由服务器告诉浏览器。

- Etag

> 响应头，标识当前文件内容是否改变，是当前文件的唯一标识；解决了last-modified精确到秒（如果一秒钟修改多次检测不到）的问题，和 修改了文件但没有修改内容的问题 以及服务端不能精确得到文件的 last-modified 的值的问题

- If-None-Match

> 请求头，发送上次服务端返回的 Etag文件是否修改的唯一标识 ，优先级比 if-modified-since 高，只要有 if-none-match 就不会去判断 if-modified-since

### 强缓存

通过服务端返回Expires 或 Cache-control 首部来设定，如果命中强缓存，浏览器会直接从本地缓存中读取数据，并返回 200 from memory/disk cache

### 协商缓存

协商缓存通过客户端和服务端设置首部设定，设置Etag / If-None-Match，Last-Modified / If-Modified-Since 首部实现

### 强缓存 和 协商缓存的工作

浏览器首先通过Expires 或 Cache-Control 验证是否命中强缓存，如果命中，则直接从本地缓存中读取数据，返回200；如果没有命中强缓存，则进入协商缓存阶段，发送 if-modified-since带有文件修改时间 和 if-none-match带有etag，如果没有修改就不返回文件返回304，浏览器就读取本地缓存；否则返回修改后的文件状态码200

## GET 和 POST的区别

1. GET参数通过url传递；POST参数放在请求体中
2. GET请求在url中存放的参数是有长度限制的（一般为2k）；POST则没有
3. GET请求只能进行url编码；POST请求可以多种编码（form-data、urlencoded、json、xml）
4. GET请求会被浏览器主动缓存，留下历史记录；POST则不会
5. GET产生一个TCP报文；POST产生两个TCP报文，对于POST，浏览器先发送header，服务器响应100 continue，浏览器再发送data，服务器响应200 ok(返回数据)。而在网络环境差的情况下，两次包的TCP在验证数据包完整性上，有非常大的优点。

## 服务器状态码

- 1xx：表示目前是协议的中间状态，还需要后续请求

  100 Continue，post请求发送的第一个只包含header的报文，服务端响应 100 Continue 表示继续发送后续请求

- 2xx：表示请求成功

  200 OK 正常返回

  201 Created 请求成功并且服务器创建了新的资源

  202 Accept 服务端接收到了请求，但尚未处理

  204 No Content 服务端没有返回内容

  206 Partial Content 服务端返回某个对象的部分内容

- 3xx：表示重定向状态，需要重新请求

  301 Moved Permanently 请求对象永久重定向到新的位置，需要把原来保存的uri更新成新的uri（虽然浏览器规定不会从POST变成GET，但是实际运用中并没有遵守）

  302 Found 临时重定向，表示这个资源只是暂时不能访问，希望用户本次使用新的URI，但是过一段时间后，可以正常访问；一般是访问某个网页需要权限，然后临时重定向到登录页面，登录后就可以继续访问（虽然浏览器规定不会从POST变成GET，但是实际运用中并没有遵守）

  303 See Other 临时重定向，和302状态码很相似，不过明确表明了应使用GET方法定向获取资源

  304 Not Modified 协商缓存命中返回的状态码

  307 Temporary Redirect 临时重定向，与302很相似，严格遵照浏览器标准，不会从POST变成GET；

- 4xx：客户端错误状态码

  400 Bad Requst 表示请求报文中存在语法错误。

  401 Unauthorized 表示发送的请求需要通过HTTP认证

  403 Forbidden 表示未获得文件访问权限，服务端拒绝对该资源的访问

  404 Not Found 表示服务器上没有所请求的资源

  405 Method Not Allowed 表示服务器禁止使用该方法请求

- 5xx：服务器端错误

  500 Internal Server Error 表示服务端在响应请求时发生错误

  502 Bad Gateway 表示扮演网关 或 代理 的服务器，从上游服务器接收到的响应式无效的

  503 Service Unavailable 表示服务器 过载 或 维护 暂时无法处理请求

# webpack

## loader

识别webpack不认识的模块，并解析模块

![image-20211125102026563](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20211125102026563.png)

![image-20211125102543200](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20211125102543200.png)

![image-20211125102610900](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20211125102610900.png)

![image-20211125103837621](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20211125103837621.png)

![image-20211125103945898](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20211125103945898.png)

![image-20211125104512231](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20211125104512231.png)

![image-20211125105003941](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20211125105003941.png)

![image-20211125110321679](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20211125110321679.png)

![image-20211125110419880](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20211125110419880.png)

![image-20211125110649948](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20211125110649948.png)

![image-20211125110744522](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20211125110744522.png)

![image-20211125110908461](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20211125110908461.png)

![image-20211125112252655](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20211125112252655.png)

![image-20211125113248113](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20211125113248113.png)

![image-20211125113718819](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20211125113718819.png)

![image-20211125113723979](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20211125113723979.png)

![image-20211125134718285](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20211125134718285.png)

![image-20211125135313468](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20211125135313468.png)

![image-20211126224046052](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20211126224046052.png)

![image-20211126225631011](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20211126225631011.png)

![image-20211126230224713](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20211126230224713.png)

![image-20211126230512406](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20211126230512406.png)

![image-20211126232721501](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20211126232721501.png)

![image-20211126231534955](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20211126231534955.png)

![image-20211126231545376](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20211126231545376.png)

![image-20211127094049007](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20211127094049007.png)

## 提取vue-cli webpack配置

![image-20211127101511107](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20211127101511107.png)



# ts

![image-20211126113627319](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20211126113627319.png)

![image-20211126113805425](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20211126113805425.png)

![image-20211126114032648](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20211126114032648.png)

## 接口

接口是用来限制类或对象的结构的规范
