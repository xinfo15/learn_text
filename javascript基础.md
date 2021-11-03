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
2. 找到所有声明的变量（var）和形参声明，去作为活动对象的属性，置为undefined
3. 实参和形参值相统一，就是实参赋值给形参
4. 找到所有函数声明（不是表达式！）去作为活动对象的属性（会覆盖变量声明），然后将函数体赋值给它
5. js解释执行

## 垃圾回收

### 标记清理（常用）

会表示所有在内存中的变量，然后去掉所有**在上下文中的变量**或**被上下文中变量引用的变量**的标记，之后再有标记的变量就一定不在上下文中，并不能被上下文中的变量访问，随后垃圾回收就会清理这些带标记变量并回收内存。

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
2. 箭头函数没有this指针，只能使用包含上下文中的this
3. 箭头函数不能使用super()，类构造普通函数中可以用
4. 箭头函数不能使用new.target，普通函数可以
5. 箭头函数不能用作构造函数
6. 箭头函数没有prototype属性

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

## 简单请求和复杂请求

### 复杂请求

复杂请求就是定义了自定义请求头部，使用了除get、post外的方法，定义了不同请求体内容类

复杂请求在第一次发送这种类型的请求时一共会发送两个请求

1. 预检请求，使用Options方法，包含头部：Origin（源域名)、Access-Control-Request-Method(请求想要使用的方法)、Access-Control-Request-Header(请求定义的自定义头部)
2. 正式请求

### 简单请求

不是复杂请求就是简单请求，就发送一次请求

### *凭据请求

如果设置请求属性xhr.withCredentials: true，则这个请求也是凭据请求，请求时会带有(cookie、HTTP认证和客户端ssl证书)，当然也要服务端允许带有才行; Access-Control-Allow-Credentials: true这条语句表示服务端允许带有凭据。

## 闭包

1. 闭包就是引用了其他函数中的变量对象的函数

2. 一般发生在嵌套函数，而且内层函数被返回并引用；不返回被引用，则变量对象会被垃圾回收
3. 会导致其他函数的变量对象一直不会销毁









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

