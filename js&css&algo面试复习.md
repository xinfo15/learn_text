##  Javascript基础

### 预编译（变量对象）

预编译创建作用域阶段做了哪些事情：

1. 创建ao对象(AO对象是js的变量对象，供js引擎自己去访问的)
2. 找形参和变量的声明 去作为ao对象的属性 值为undefined
3. 实参和值形参相统一
4. 找函数的声明（不是函数表达式！） 会覆盖变量的声明
5. js的解释执行，逐行执行

练习题：

function fn(a, c){
            console.log(a);	//	function a() {  }
            var a = 123;
            console.log(a);	//	123
            console.log(c);	//	function c () { }
            function a() {  }
            if (false) {
                var d = 678
            }
            console.log(d);	//	undefined
            console.log(b);	//	undefined
            var b = function () { };
            console.log(b);	//	 function () { }
            function c () { }
            console.log(c);	//	function c () { }
        }
        fn(1, 2);

解答：

1. 创建ao对象

2. ao {    // 找到形参和变量的声明 去作为ao对象的属性 值为undefined

   ​	a: undefined

   ​	c: undefined

   ​	d: undefined

   ​	b: undefined

   }

3. ao {    // 实参和形参的值相统一

   ​	a: undefined	1

   ​	c: undefined	2

   ​	d: undefined

   ​	b: undefined

   }

4. ao {    // 找到函数的声明 会覆盖变量的声明

   ​	a: undefined	1	function a() { }

   ​	c: undefined	2	 function c() { }

   ​	d: undefined

   ​	b: undefined

   }

### 普通函数调用this指针

1. 函数直接被调用（无论在哪只要是直接调用形式this=window）

   ```javascript
   let name  = 222;
   function fn(){
       console.log(this.name);
   }
   fn();
   // 两者等价
   fn.call(window);
   ```

2. 函数被当做对象方法被调用

   ```javascript
   let a = {
   	name: 333,
   	say: function(){
   		console.log(this.name);
   	}
   }
   a.say();
   // 两者等价
   a.say.call(a);
   ```

3. 箭头函数的this

   ```javascript
   // 箭头函数的this在定义时就已经确定了
   // 箭头函数的this是引用定义箭头函数的上下文的this
   // 箭头函数的this不能改变
   ```

练习题：

```javascript
var name = 222;
var a = {
    name: 111,
    say: function () {
        console.log(this.name);
    }
}

var fun = a.say;
fun();	// 属于直接调用函数相当于: fun.call(window); // 222
a.say();	// 属于调用对象的方法相当于：a.say.call(a);	// 111

var b = {
    name: 333,
    say: function (fun) {
        fun();	// 属于直接调用	// 222
    }
}
b.say(a.say);	
b.say = a.say;	
b.say();	// 属于调用对象的方法	// 333
```

### 箭头函数中的this指向

1. 箭头函数中的this是在定义函数的时候绑定的，而不是在执行函数的时候绑定

2. 箭头函数中，this指向是固定化的，并不是因为箭头函数内部有绑定this的机制，实际原因是箭头函数根本没有自己的this，导致内部的this就是外层代码块的this。正是因为它没有this，所以也就不能作为构造函数。

3. 箭头函数本身是没有this指针的，所以this是通过引用最近祖先上下文中的this来实现的（也可以说是找到最近拥有this指针的祖先 并引用他的this）

   ```javascript
   var name = 111;
           var o = {
               name: 333,
               say: function() {
                   var name = 222;
                   return () => console.log(this.name);
               }
           }
           o.say()();	// 333
   ```

### 浅拷贝、深拷贝、赋值的区别

1. 赋值：基本类型直接赋值变量的值，引用类型赋值的是引用类型的地址

2. 浅拷贝：在堆内存中新创建一个对象，基本数据类型属性互不影响，引用数据类型属性共用一个内存地址

3. 深拷贝（dfs赋值）：在堆内存中新创建一个对象，基本数据类型属性互不影响，引用数据类型属性也在堆内存中新创建对象，也互不影响

   ```javascript
   function deepCopy(obj){
       let copyer = new obj.constructor();
       for(let i in obj){
           if(obj.hasOwnProperty(i)){
               if(typeof obj[i] === 'object'){
                   copyer[i] = deepCopy(obj[i]);
               }else{
                   copyer[i] = obj[i];
               }
           }
       }
       return copyer;
   }
   ```

### 防抖节流函数（闭包的实现）

1. 防抖函数：当持续触发事件，一定时间内没有再触发事件，事件处理函数才会执行一次；如果设定时间到来之前，又一次触发了事件，就重新开始延时

   ```javascript
   let input = document.getElementById('input');
   
   function debounce(callback, delay){
       let timer;
       return function(value){
           clearTimeout(timer);
           timer = setTimeout(function(){
               if(typeof callback === 'function')
               	callback(value);
           }, delay, value);
       }
   }
   
   function fn(value){
       console.log(value);
   }
   
   let res = debounce(fn, 1000);
   input.addEventListener('keyup', (e) => {
       res(e.target.value);
   }, false);
   ```

2. 节流函数：当持续触发事件，一定时间内无论触发多少次，都只执行一次事件处理函数（即最先触发的事件处理函数）

   ```javascript
   let btn = document.getElementById('button');
   
   function throttle(callback, delay){
       let timer;
       return function(){
           if(timer === undefined){
               timer = setTimeout(function(){
                   if(typeof callback === 'function')
                       callback();
                   timer = undefined;
               }, delay);
           }
       }
   }
   
   function fn(){
       console.log(Math.random());
   }
   let res = throttle(fn, 2000);
   
   btn.addEventListener('click', function(e){
       res();
   }, false);
   ```

### 作用域和作用域链[[scope]]

#### 1. 全局作用域

1. 在页面打开时创建，在页面关闭时销毁
2. 全局作用域中有对象window（浏览器窗口对象），在页面任意位置都可以访问到
3. 在全局作用域中定义的函数和变量都会成为window的属性

#### 2. 函数作用域

1. 在函数调用时创建，在函数执行完毕时销毁
2. 每调用一次函数就会创建一个新的函数作用域（无论函数是否相同），他们之间是相互独立的
3. 在函数作用域可以访问到全局作用域的变量（由于全局作用域在执行上下文栈的底部），在函数外无法访问到函数作用域内的变量
4. 在函数中查找变量，首先查找当前函数作用域，找不到就去上一级作用域中查找，直到找到window对象，如果还找不到就报错

#### 3. 执行上下文（上下文）

分为全局上下文、函数上下文和eval()上下文

1. 上下文代码在执行的时候，会创建变量对象的一个作用域链。这个作用域链决定了上下文中访问变量和函数的顺序
2. 正在执行的上下文的变量对象始终在作用域链的最前端
3. 当前上下文中变量和函数的访问顺序，首先在当前上下文变量对象中查找，如果找不到就去作用域链中下一个变量对象（来着包含上下文）中查找，直到查找到全局上下文，还找不到就报错

#### 4. 函数执行上下文

1. 当函数调用时，会先进行预编译
2. 函数预编译过程中会创建活动对象AO（作用域）、作用域链、确定this指向

#### 5. 作用域链

1. 当函数创建时，就会创建一个作用域链被填充为包含上下文中的作用域链
2. 当函数调用时，在预编译阶段，会创建当前上下文的活动对象AO并将其推入作用域链的最前端

### 闭包

**闭包是指那些引用了另一个函数作用域中变量的函数。**

闭包就是在一个函数中可以访问另一个函数中活动对象AO（作用域）的方式

由于函数在创建时就会创建作用域链，所以当一个函数在另一个函数中创建，那么这就形成了一个闭包，所创建的函数的作用域链中就有了包含函数的活动对象AO（作用域），并且永一直存在于内存中。

```js
function a(){
    let name = 'lizhengxin';
    function b(){
        name;
    }
}
```

### [事件循环](https://juejin.cn/post/6844904050543034376)

js是单线程解释型语言，同一时间只能做一件事；但是遇到等待（网络请求、定时任务）就会卡住，但是卡住的时候cpu是空闲的，这种等待就让异步任务诞生了；异步不会阻塞代码执行，异步采用回调的形式。

#### 归类：事件分为同步任务和异步任务，异步任务又分为宏任务和微任务

1. 同步任务，根据执行栈中的顺序立即执行
2. 宏任务（一般是用户调用的任务）script、setTimeout、setInterval.....，执行时加入宏任务队列（消息队列）
3. 微任务（一般是js调用的任务）：Promise、MutationObserver.....，执行时加入微任务队列

<img src="https://i.loli.net/2021/04/07/9ioLD1fg8MxcJml.png" alt="img" style="zoom: 67%;" />

#### 事假循环执行细节：

1. 遇到setTimeout有延时的任务，加入宏任务队列后，会按照延时的升序从左到右稳定排序（稳定排序是指，延时相同在后面的还是在后面）

2. 函数嵌套执行，函数加入任务队列后，会排序到包含函数前面一个执行（因为内部函数先执行）

   ```js
   new Promise(function (resolve) {
     console.log('111');         
     resolve();		// 1触发   
     new Promise(function(resolve){
     	console.log('222')
     	setTimeout(function(){
     	console.log('333')	
     	})
     	resolve()		// 2触发
     }).then(function(){			// 2加入微任务队列，但由于2在1的函数内部（函数内部先执行）所以排序到微任务队列中任务1的前面
     	console.log('444')
     	setTimeout(function(){
     	console.log('555')	
     	})
     })                    
   }).then(function (resolve) {	// 1加入微任务队列  
     console.log('666')               
   setTimeout(function(){
     	console.log('777')	
     	},200)
   });
   ```

3. 举例:

   ```js
   setTimeout(function() {
       console.log('timeout1');
   },200)
   async function async1(){
     console.log('async1 start')
     await async2()
     console.log('async1 end')
   }
   async function async2(){
     console.log('async2')
   }
   async1();
   
   new Promise(function (resolve) {
     console.log('111');         
     resolve();   
     new Promise(function(resolve){
     	console.log('222')
     	setTimeout(function(){
     	console.log('333')	
     	})
     	resolve()
     }).then(function(){
     	console.log('444')
     	setTimeout(function(){
     	console.log('555')	
     	})
     })                    
   }).then(function (resolve) {       
     console.log('666')               
   setTimeout(function(){
     	console.log('777')	
     	},200)
   });
   
   setTimeout(function(){
   	console.log('timeout2')
   },100)
   
   // 答案：
   async2
   111
   222
   async1 end
   444
   666
   333
   555
   timeout2
   timeout1
   777
   ```

   

### async、await和Promise的转换

```js
async function foo() { } == function foo() { } // 没用await的async函数和普通函数一样是同步执行的
async function foo() { return 1; }	// async返回值是基本类型的话总会包装成一个resolve期约，等价于
function foo() {
    return Promise.resolve(1);
}
async function foo() { await 1; } // await表达式之后的代码是存在于then回调中的，await后面的值是基本类型才包装为promise，如果本来就是promise就直接promise.then(() => { 后面的语句 })
function foo() {
    return Promise.resolve(1).then(() => undefined);
}
async function testSomething() {
    console.log("执行testSomething");
    return "testSomething";
    //相当于
    // return Promise.resolve("testSomething");
}
async function test() {
    console.log("test start...");
    const v1 = await testSomething();
    console.log(v1);
    const v2 = await testAsync();
    console.log(v2);
    console.log(v1, v2);
    //相当于
    const v1 = testSomething(); // 无论testSomething是不是async函数，结果都会包装成期约对象，并拥有v1.then(() => {})
    v1.then(() => {
        console.log(v1);
        const v2 = testAsync();
        v2.then(() => {
            console.log(v2);
        	console.log(v1, v2);
        });
    });
}
```

### 单例模式

定义：1. 只有一个实例	2. 可以全局的访问	3. 拥有单一的职责

作用：当你想控制实例的数目的时候，在内存中只创建一个实例，减少了频繁创建和销毁所使用的内存，主要用于全局的缓存和弹窗

1. es5 使用闭包实现单例模式

   ```js
   function getSingle(callback){
       let instance;
       return function(){
           return instance || (instance = callback());
       }
   }
   let createLoginLayer = function (){
       let div = document.createElement('div');
       div.style.display = 'none';
       div.innerText = '登录弹窗';
       document.body.appendChild(div);
       return div;
   }
   let loginLayer = getSingle(createLoginLayer);
   let btn = document.getElementById('button');
   btn.addEventListener('click', function(){
       loginLayer().style.display = 'block';
   }, false);
   ```

2. es6使用类静态方法实现单例模式，因为静态方法跟类绑定的类只有一个所以是单例的

   ```js
   class LoginLayer {
       constructor(username, password){
           this.username = username;
           this.password = password;
       }
       
       static getInstance(username, password){
           if(this.instance === undefined){
               this.instance = new LoginLayer(username, password);
           }
           return this.instance;
       }
   }
   let loginLayer = LoginLayer.getInstance('lizhengxin', '333');
   ```

### 数组扁平化处理

```js
let _res = [];
function arrFlat(arr){
    if(!Array.isArray(arr)) return ;
    
    for(int i = 0, len = arr.length; i < len; i ++){
        if(Array.isArray(arr[i])){
            arguments.callee(arr[i]);
        }else{
            _res.push(arr[i]);
        }
    }
}
arrFlat([[0], [2, 3, 4], 1, [1, [2, 3]]]);
console.log(_res);	// [0, 2, 3, 4, 1, 1, 2, 3]

function reduceFlat(arr){
    return arr.reduce(function(prev, cur, idx, arr){
        if(Array.isArray(cur)){
            prev = prev.concat(reduceFlat(cur));
        }else{
            prev.push(cur);
        }
        return prev;
    }, []);
}
console.log(reduceFlat([[0], [2, 3, 4], 1, [1, [2, 3]]]));
```

### call/apply/bind

```js
// 1.call/apply 是立即执行的，它们两个的区别是传参的方式 
Function.prototype.call(thisPtr, ...arr); // 参数是向量
Function.prototype.apply(thisPtr, arr); // 参数是数组
// 2.bind不是立即执行的，返回一个绑定thisPtr为this指针后的函数
let boundFunction = Function.prototype.bind(thisPtr, ...arr);
boundFunction();
```

### 继承

#### 1.原型链继承

将子类的原型赋值为父类的实例

- 优点：实现了继承父类构造函数中的定义的所有变量和函数
- 缺点：继承父类构造函数中的定义的所有变量和函数都保存到子类原型链上了，这些继承的变量和方法在子类实例中是共享的，并没有保存到子类构造函数中。

```js
function Father(){
    this.name = 'father';
}
Father.prototype.sayName = function(){
    console.log(this.name);
}
function Son(){
    this.name = 'son';
}
Son.prototype = new Father();
Son.prototype.constructor = Son;	// 原型中含有一个constructor指针指向构造函数
```

#### 2.借用构造函数继承

子类执行父类的构造函数（this指针指向子类构造函数）

- 优点：继承父类构造函数中定义的属性和方法，并保存到子类构造函数中
- 缺点：所有在父类构造函数中定义的属性和方法都是独立的，不能继承父类原型上的属性和方法

```js
function Father(){
    this.name = 'father';
    this.sayName = function(){
        console.log(this.name);
    }
}
function Son(){
    Father.call(this);
}
let son =  new Son();
```

#### 3.组合继承

原型链继承和借用构造函数继承的组合

- 优点：不仅继承了父构造函数中的属性和方法，还继承了父类原型链上的属性和方法
- 缺点：父类构造函数会执行两次，在子类构造函数中继承的属性和方法也会出现在子类原型链上 

```js
function Father(){
    this.work = '洗碗';
}
Father.prototype.getWork = function () {
    console.log(this.work);
}
function Son(){
    Father.call(this);
}
Son.prototype = new Father();
Son.prototype.constructor = Son;
```

#### 4.原型式继承

不定义自定义类型，通过原型实现对象之间的信息共享，如果你有一个对象，你想在这个对象上创建一个对象

```js
function object(o){
    function F() {}
    F.prototype = o;
    return new F();
}
```

#### 5.寄生式继承

```js
```



#### 6.寄生式组合继承

子类执行父类的构造函数（this指针指向子类构造函数），并且将父类构造函数的原型链赋值给子类构造函数的原型链

```js
function Father(){
    this.name = 'father';
}
Father.prototype.sayName = function(){
    console.log(this.name);
}
function Son(){
    Father.call(this);
    this.age = 20;
}
Son.prototype = Object.create(Father.prototype);
Son.prototype.constructor = Son;
```

### 模块化（es6）

#### 1.模块加载（异步、按需加载）

1. 加载模块涉及执行其中代码
2. 如果浏览器没有收到依赖模块的代码，就必须发送请求并等待网络返回
3. 收到网络返回的模块代码之后，要判断此模块是否也有依赖模块，依次递归的判断和加载所有依赖模块，直到整个依赖图都加载完毕，才可以执行入口模块（入口模块就是最先要加载的模块） 。

#### 2.es6模块执行（默认在严格模式下执行）

1. es6模块无论是以嵌入html中的代码块，还是引入外部文件，遇到<script type="module"></script> 都会先下载文件，然后等待文档解析完成后执行。
2. 嵌入模块，被认为是模块图中的入口模块，不能使用import加载到其他模块，只有外部文件加载的模块才可以使用import加载
3. 无论在一个页面中使用代码加载一个模块多少次，实际上只会加载一次

#### 3.CommentJS

导出：module.export{}

导入：require("")

#### 4.导出/导入（es6）

1. 默认导出：export default{ n1, show }

   一个模块中只能使用一次

2. 按需导出（命名导出）：export  表达式

   一个模块中可以使用多次

   export const s1 = 'xxx';

   export const s2 = 'yyy';

   export function say(){}

   

3. 默认导入：import  xxx from "./moduleDefault.js"(xxx合法标识符就行)

   相当于只能使用一个变量名来接收

4. 按需导入：import { s1, s2, say } from "./moduleExport.js"

   （必须包含在{}之中，且之中的成员名称必须和按需导出的成员名称保持一致）

   ​	按需导入可以重命名成员名称 import {s1 as s3} from .... 

5. 直接运行：import "./moduleRun.js"

注意：

1. 按需导入可以和默认导入一起使用，按需导入匹配{s1, say}中的部分，默认导入匹配单独的一个变量名部分，位置排列不重要，用逗号分隔
2. import "@/index.js" // @在webpack中配置为表示src这一层目录



## webpack

在webpack中一切接模块，都可以通过es6的导入语法导入，然后转化为js方式去运行

解析处理css文件：

1. webpack 默认只是能打包处理.js结尾的文件，处理不了其他后缀的文件
2. 由于代码中包含了index.css文件，因此webpack默认处理不了
3. 当webpack发现某个文件处理不了的时候，会查找webpack.config.js这个配置文件，找module.rules数组中，是否配置了对应的加载器
4. webpack把index.css这个文件，先转交给最后一个loader处理(css-loader)
5. 当css-loader处理完毕之后，会把处理结果转交给下一个loader处理（从后往前）
6. 当style-loader处理完毕之后，发现没有下一个loader了，于是就把处理结果，转交给webpack
7. webpack把style-loader的处理结果，合并到/dist/main.js中，最终生成打包好的文件

### loader 加载器

webpack只能打包处理.js后缀名结尾的模块（js的一部分高级语法），如果不是则处理不了，需要调用对应的loader加载器才可以正常打包；

loader加载器的作用：协助webpack打包处理特定的文件模块，比如：

css-loder、less-loader、babel-loader(可以打包处理webpack无法处理的高级js语法)

![image-20210908110406009](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210908110406009.png)

####  babel-loader 文档babeljs.io/docs/en/

要创建babel.config.js，将来在webpack调用babel-loader的时候，会先到babel.config.js中加载plugins插件来使用



## css基础

### CSS盒模型

```js
CSS盒模型就是一个封装HTML元素的盒子，它包括 外边距、内边距、边框和实际内容
```

1. 标准盒模型(box-sizing: content-box默认)：

   标准盒模型的宽高 = 实际内容的宽高

2. 怪异盒模型(box-sizeing: border-box):

   宽高 = 实际内容的宽高 + padding的宽高 + border的宽高
   
   

### CSS百分比参照标准

- #### width height 参照包含它的块级对象的高度和宽度

  如果当前元素position为fixed则参照视口大小调整

- #### margin 全部参照包含块的宽度

  ```js
  margin为负值：
  	1、如果在没有宽度的元素上设置，会增加宽度
      2、如果在有宽度的元素上设置，会移动位置
  ```

  

- #### padding 全部参照包含块的宽度

- #### top bottom 参照包含块的高度

- #### left right 参照包含块的宽度

- #### border-radius 参照自身宽度

- #### translate 参照自身宽高（offsetTop和OffsetLeft固定不变）

- #### line-height 参照当前字体大小

  ```js
  原理(w表示儿子的宽度，pw表示父亲的宽度，a和b表示任意距离)
  垂直和水平居中的宽高等式：
  w + 2a = pw
  h + 2b = ph
  推出：
  a = pw / 2 - w / 2
  b = ph / 2 - h / 2
  ```




### em/px/rem/vh/vw/%的区别

- px：表示像素，就是屏幕上的一个点，是固定的
- rem：字体响应化，r表示root即`html元素`，1rem表示根元素的font-size属性的大小，默认情况font-size = 16px，那么1rem = 16px；只有`html元素可以设置`
- em：字体响应化，普通元素的font-size值就可以修改em，`自己元素及父级元素都可以设置`
- vh 和 vw：根据窗口的宽高，分成100等份，100vh就表示满高，50vh就表示一半高
- %：百分比，根据参照父元素，如果当前元素设置postion: fixed，则参照窗口大小



### BFC块级格式上下文（解决高度塌陷、margin重叠、阻止元素被浮动元素覆盖、实现两栏布局、清除浮动）

定义：BFC它是指一个独立的块级渲染区域，只有Block-level BOX参与，该区域拥有一套渲染规则来约束块级盒子的布局，且与区域外部无关。 

简单来说，BFC是一个完全独立的空间（布局环境），让空间里的子元素不会影响到外面的布局。（有一套渲染规则来约束布局）

方法：

1. float值不是none（设置为浮动，脱离文档流）
2. position值是absolute、fixed（脱离文档流）
3. display值是inline-block、flex或者inline-flex、table-cell、inline-table、table
4. overflow不为visible

### 瀑布流

利用绝对定位，首先确定第一行的top和left然后根据高度建立一个堆，从第二行开始每次排列图片都找到小根堆中最小的item进行设置top和left。

### 水平垂直居中

1. #### relative + translate 子元素不固定宽高

   ```js
   .son{
       position: relative;
       left: 50%;
       top: 50%;
       transform: translate(-50%, -50%);
   }
   ```

2. #### flex 子元素不固定宽高

   ```js
   .father{
       display: flex;
       justify-content: center;
       align-items: center;
   }
   ```

3. #### absolute + margin自适应 子元素固定宽高

   ```js
   .father{
       position: relative;
   }
   .son{
       position: absolute;
       height: 100px;
       width: 100px;
       top: 0;
       bottom: 0;
       left: 0;
       right: 0;
       margin: auto;
   }
   ```

   

### 块元素和行内元素

1. 块元素：独占一行，自动填充满父元素，可以设置宽高和margin、padding
2. 行内元素：不会独占一行，宽高不能设置（内容填充开），垂直方向margin、padding失效

![image-20210916224843156](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210916224843156.png)

### 两栏布局

1. float 

   ```js
   `BFC`
   .left{
       width: 120px;
       float: left;
       margin-right: 10px;
   }
   .right{
       overflow: auto;
   }
   `margin`
   .left{
       width: 120px;
       float: left;
   }
   .right{
       margin-left: 130px;
   }
   ```

2. flex

   ```js
   .wrapper{
       display: flex;
       align-items: flex-start;
   }
   .left{
       width: 120px;
   }
   .right{
       flex-grow: 1;
       flex-shrink: 1;
       flex-basis: auto;
   }
   ```

3. positon + margin-left

4. position + position-> left: 140px



### 三栏布局

1. #### position + margin 两边固定，中间自适应

   ```js
   .box{
       position: relative;
   }
   .left, .right{
       position: absolute;
       top: 0;
       min-height: 200px;
   }
   .left{
       left: 0;
       width: 100px;
   }
   .right{
       right: 0;
       width: 200px;
   }
   .main{
       min-height: 200px;
       margin: 0 210px 0 110px;
   }
   
     <div class="box">
       <div class="main"></div>
       <div class="left"></div>
       <div class="right"></div>
     </div>
   ```

2. 浮动布局（流体布局）

   ```js
   `float + margin`
   .left{
       float: left;
   }
   .right{
       float: right;
   }
   .main{
       margin 0 200px;
   }
     <div class="box">
       <div class="left"></div>
       <div class="right"></div>
       <div class="main"></div>
     </div>
   
   `float + BFC`
   .main{
       overflow: auto;
   }
     <div class="box">
       <div class="left"></div>
       <div class="right"></div>
       <div class="main"></div>
     </div>
   ```

3. 圣杯

   ```js
       .box{
         padding: 0 200px;
       }
       .box::after{
         content: "";
         clear: both;
         display: block;
       }
   
       .left{
         width: 200px;
         min-height: 200px;
         background-color: sandybrown;
   
         float: left;
         margin-left: -100%;
         position: relative;
         left: -200px;
       }
       .right{
         width: 200px;
         min-height: 200px;
         background-color: cornflowerblue;
         
         float: right;
         margin-left: -100%;
         position: relative;
         right: -200px;
       }
       .main{
         background-color: cyan;
         min-height: 200px;
         
         float: left;
         width: 100%;
       }
   `原理`：通过给容器设置padding来空出两边空间，然后通过给三个元素设置左浮动，让他们理论上排在一行（虽然显示不在一行，是因为一行装不下），然后通过margin-left的负值根据父元素的宽度调整位置
   `缺点`：因为最后是通过relative调整的位置，左右两栏还是站着原来的位置，当窗口缩小到比两栏宽度加起来小的时候，就会产生换行
   ```

4. 双飞翼

   ```js
   
       .box::after{
         content: "";
         clear: both;
         display: block;
       }
   
       .left{
         width: 200px;
         min-height: 200px;
         background-color: sandybrown;
   
         float: left;
         margin-left: -100%;
       }
       .right{
         width: 200px;
         min-height: 200px;
         background-color: cornflowerblue;
         
         float: right;
         margin-left: -100%;
       }
       .main{
         float: left;
         width: 100%;
       }
       .main-content{
         margin: 0 200px;
         background-color: cyan;
         min-height: 200px;
       }
   
     <div class="box">
       <div class="main">
         <div class="main-content"></div>
       </div>
       <div class="left"></div>
       <div class="right"></div>
     </div>
   `原理`：在圣杯的基础上，删去了relative操作；主要是通过在main中新增了main-content加margin空出两栏位置，然后main空间增大了box的宽度，对margin-left: -100% 增加了距离；因为相当于在main的内双边加上了两栏，所以叫双飞翼
   ```

   

### flex布局

1. flex-direction: row|column 定义了主轴的方向，然后交叉轴垂直于主轴

2. 父容器

   ```js
   justify-content: center... 设置主轴上的对齐方式
   align-items: center... 设置交叉轴上的对齐方式
   ```

3. 子容器

   ```js
   flex: 1 1 20px;
   相当于
   flex-grow: 1;	// 子容器伸展比例，把剩余空间按比例分配给子容器
   flex-shrink: 1;	// 收缩比例，当子容器超出父容器，会安装比例给子容器减去对应的值
   flex-basis: 20px;// 在不伸缩的情况下，设置主轴方向子容器的大小
   ```

### 伪类 和 伪元素

- #### 伪类

  ```js
  伪类表示被选择元素的某种状态，例如:hover
  ```

- #### 伪元素

  ```js
  伪元素表示的是被选择元素的某个部分，这个部分看起来是一个独立的元素，但是只存在于css中，是个“假元素”，所以叫伪元素，例如：::before \ ::after
  ```


### CSS选择器优先级

```js
如果只有一个选择器，就按照下列li顺序；
如果有多个选择器，就组成了一个四位向量(0, 0, 0, 0)，并且向量从左向右比较(字符串比较一样）：

第一位：行内样式，具有内联样式时，恒为1
第二位：ID选择器，每包含一个id选择器都 + 1
第三位：类、伪类、属性选择器，每多包含一个都 + 1
第四位：标签（元素）、伪元素，每多包含一个都 + 1

注意：从左到右，跟字符串一样比较

如果比较相等，根据层叠原理，后面的样式会覆盖前面的样式

例子：
`.a1>.a2>div:first-child{
    background-color: pink;
}/*优先级为(0,0,3,1)*/
#a{
    background-color: yellow;
}/*优先级为(0,1,0,0)*/`
```

1. !important 最高优先级yyds
2. 行内样式（第一位）
3. ID选择器 （第二位）
4. 类、伪类、属性选择器 （第三位）
5. 标签、伪元素 （第四位）
6. 通配符、子类选择器、兄弟选择器（无关）
7. 继承样式（无关）



## 算法基础

### 图论

#### 拓扑排序

每次找判断一个节点是否加入拓扑序时，都要找到所有入度为零的点加入队列；

因为图中任意一条边<u, v>，则在拓扑序中u一定在v的前面，所以是父节点满足要求就把他的出度满足要求的节点也加入队列；

如果一个图中有环，那就会有节点永远也不会入度为0，所以最终拓扑序中的节点数会不等于图的总结点数；

#### dijkstra（不可有负环，因为基于贪心算法）

1. 朴素版（稠密图）pow(n, 2)

   首先有一个v[i]节点记录已经加入了最短路中的节点，d[i]表示i节点到源点1的距离;

   每次执行都找到不咋v集合中的距离d最小的点x，然后更新点x的出度节点；

   从源点1开始每更新一次节点就要重新找一个不在v集合中最小的节点，找最小节点的操作时间复杂度是pow(n, 2);

2. 堆优化版（稀疏图）mlogn

   主要是通过堆（heap）优化了朴素版中的查找不在v集合中的与源点距离最短的点，让朴素版查找最小值从pow(n, 2)优化到了log(n);

#### bellman_ford（可有负环，可利用限制最短路上节点的个数来判断是否有负权回路）

bellman_ford 限制边的负权最短路算法

跟dp执行思路差不多，（每一次循环都会让能更新的节点的最短路上边的个数加1，相当于向外扩充了一层）

跟dp相似的主要部分是，状态转换必须按照上一阶段的状态来更新当前状态的最优值，如果从当前阶段的状态来更新就变成了多重背包了，最短路也就求不出来了。

外层循环控制最短路上节点的个数，所以外层循环n-1次肯定能完成最短路的求值

通过设置外层循环为k次，可以限制扩展最短路上边的个数为k

#### spfa（对bellman_ford的一个优化）

- 求最短路：因为bellman_ford算法每次循环都要去更新每一个点，但是并不是每一个点都能被更新的，只有在一个点的入度节点到源点的距离变小的时候才更新，所以spfa就通过bfs来优化这点，只有被更新了的节点才加入bfs队列中，用于遍历它们的出度节点，以此类推（初始化源点1距离为0加入队列）

- 求负环：首先我们知道spfa是基于bfs进行优化的，所以每次遍历都是在原有节点范围向外分别加1条边，然后我们就可以通过限制边来判断是否有负环；需要注意的是，因为负环会导致d[j] > d[x] + dist 一直成立，所以会陷入这个死循环，然后通过限制边点1到点n之间一定不会超过n-1条边，所以就能判断出是否有负环了；

  然后又因为我们求最短路的时候是从源点1到点n的，走的路径都是最短的，而负环可能不在这一条最短路径上面，所以我们就需要把所有的点都当成源点来出发到n点，这样就一定可以找出当前图是否有负环。

  实心细节：求负环就不用像求最短路那样要初始化dist数组为INF，初始化为一个自然数即可（只要比负数大）这里就初始化为0；也可以说成是从把所有点都当成源点出发就把所有点的dist都初始化为0；然后新增一个记录边数的cnt数组

  注意：因为是求负环，所以求每个点到n点的最短路就能求出是否有负环，因为最短路是求最小的距离，负数当然更小！！！



## 浏览器渲染原理

![image-20210908234739036](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210908234739036.png)

![image-20210909084531238](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210909084531238.png)

![image-20210910174658981](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210910174658981.png)

![image-20210909085528751](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210909085528751.png)

![image-20210909085700133](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210909085700133.png)

![image-20210909090406847](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210909090406847.png)

![image-20210909091017216](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210909091017216.png)

![image-20210909094346206](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210909094346206.png)



## vue

### 对vue的理解

vue使用了MVVM设计模式，在vue中不需要操作DOM，只需要把数据维护好即可（数据驱动视图）。

### 数据响应式原理

```js
function defineReaction(obj, key, val){
    obj.defineProperty(obj, key, {
        enumeable = true;
        configabel = true,
        get(){
            return val;
        },
        set(newVal){
            if(val === newVal) return ;
            // render .....
            val = newVal;
        }
    })
}
```

### 父子组件传值

#### 1. 父组件向子组件传值



### 前端路由Vue-router

定义：Hash地址与组件之间的对应关系



## 网络

### 客服端、服务器直接的通信

1. 进程通信：是通过运行在不同端系统的进程之间通信实现的

2. 套接字接口：而进程之间通信，要通过套接字作为接口向网络发送报文，然后另一个接口通过网络接收报文进行处理。套接字是应用层和运输层协议之间的一个API；

3. 进程寻址：需要定义两种信息：目的主机的地址 和 目的主机中指定接收进程的标识符（指定目的主机中接收报文的套接字）

4. 发送流程：发送端的应用程序将报文推送该套接字；在套接字的另一端，运输层协议负责从接收进程 的套接字得到该报文。

   

### 运输协议的运输服务

1. 可靠数据传输
2. 吞吐量（传输速率，可指定）
3. 定时（传输延迟，可指定）
4. 安全性（加密、解密）

目前，运输层协议已经实现了 “可靠数据传输” 和 “安全性” 这两个服务，“定时” 和 ”吞吐量“没有实现，”定时“已经通过另外一种方式尽最大课程的支持了。



### TCP协议

##### 1. TCP服务（还具有拥塞控制，无安全机制）

1. 面向连接服务（进程通信前有握手过程）
2. 可靠数据传输服务（接收方接收到的字节流与发送方所发送的相同，有序）

#### 2. TCP安全（SSL，是对TCP套接字层的加强）

无论是TCP还是UDP都没有提供任何加密机制，即发送进程传进套接字的数据和接收进程从套接字中获取的数据是一样，该明文数据经过发送方和接收方的所有链路发送，这就可能在任何中间链路被监听。因为这样，所有因特网已经研制了TCP的加强版本，称为[安全套接字层]()（Secure Socket Layer, SSL)，给TCP在原有实现功能的基础上，添加了进程与进程之间的安全性服务。

#### 3. TCP主要用途

用于可靠传输一些数据

#### 4. 为什么连接时候是三次握手？

因为只有三次握手才能确定客户端和服务器端的收发功能正常，即做好准备工作。

1. 第一次握手，客户端发出SYN报文段，syn=1，seq=x；服务端接收到SYN报文段，确定服务端接收功能正常。

2. 第二次握手，服务端发送SYN-ACK报文段，syn=1，ack=x + 1，seq=y；客户端收到SYN-ACK报文段，确定客户端的发送和接收功能正常。

3. 第三次握手，客户端发送ACK报文段，syn=0，ack=y+1，seq=x + 1；服务端收到了，确定服务端的发送功能正常。

   `以上所说的功能正常是指双方都知晓的，只有一方知晓的正常没有罗列出来。`

#### 5. 什么是半连接队列

半连接队列顾名思义就是只连接了一半的队列，它存在与服务器端；

在第二次握手之后，三次握手之前的连接，就叫做半连接；而第三次握手迟迟没有到来的话，半连接就会一直待在半连接队列中。

#### 6. isn（seq）是固定的吗？

当然不是固定的，如果是固定的话很容易被别人猜到，然后实施攻击。

#### 7.  三次握手过程中可以携带数据吗？

在第三次握手时可以携带，而在前两次握手中不能携带；

原因：

1. 因为在第三次握手之前，客户端或服务端没有一端是已经建议连接的，所以现在传输数据是不可靠传输。
2. 如果第一次握手携带数据，则服务端就需要花费很多内存空间来接收这些数据，如果遭到syn洪范攻击的话，服务端会更容易因为资源被占满而暂停服务。
3. 第三次握手时客户端已经建立起了连接，所以就可以正常发送数据了。

#### 8. 如果第三次握手丢失了，客户端服务端会如果处理

服务端对第三次握手设定的定时器超时后，会一直重传第三次握手，客户端会处于syn_sent状态等待接收第三次握手。

#### 9. syn洪范攻击是什么？

首先要知道服务器的缓存和状态变量是第二次握手时产生的，然后syn洪范就利用这个性质，伪造大量不存在的ip地址发送syn报文段，然后服务端收到后进行创建资源并发送第二次握手，由于不存在的ip不可能接收到第二次握手，然后服务端就会一直重传第二次握手，再加上大量的第一次握手，服务端会一直创建缓存和状态变量，最终会导致服务端资源被占满。

#### 10. 挥手为什么需要四次？

客户和服务端都可以发送断开连接报文，四次挥手表现为比如客户想要断开连接：

1. 第一次挥手，客户发送FIN报文段，fin=1，seq=x；服务端接收到。
2. 第二次挥手，服务端向客户端发送FIN-ACK报文段；客户端收到。
3. 第三次挥手，服务端向客户端发送FIN报文段；客户端收到。
4. 第四次挥手，客户端向服务端发送FIN-ACK报文段，服务端收到。

为什么一定要四次挥手，因为如果客户端现在报文发送完毕，想要断开连接，发送一个FIN报文段给服务端，但是服务端此时还有许多报文段需要发送完毕，所以就先发送一个FIN-ACK确定收到FIN报文段，然后等待其他报文段发送完毕后，再发送FIN报文段给客户端，断开连接。

#### 11. 为什么断开连接时，等待2MSL的意义？

MSL（max segment lifetime）最长报文段存活时间；

意义：

1. 如果客户端发送第四次挥手后，马上关闭连接，但是第四次挥手在发送过程中丢失了；那么即使服务端超时重传第三次挥手，也不会收到任何回复，所以服务端就永远都无法关闭了。因此需要等待2MSL，以确保第四次挥手丢失了，重传第三次挥手后，再次发送第四次挥手能够成功。
2. 等待2MSL可以确保下一次连接时，不会收到上一次连接残留在网络中的报文段；



### UDP协议（不提供不必要服务的轻量级协议）

#### 1. UDP服务（无安全机制）

1. 无连接服务（进程通信前没有握手过程）
2. 不可靠数据传输服务（不保证发送方传入套接字的报文到达接收方，并且到达的报文可能也是乱序的）

#### 2. UDP主要用途

用于一些容忍某些丢失的应用，比如网络电话，但网络电话要达到一定最小速率才能有效工作，所以才会使用UDP设法避开TCP的拥塞控制和分组开销。



### HTTP协议（超文本传输协议，通过TCP实现全双工可靠数据传输服务）

#### 1. HTTP概况

```
1. 两个程序实现：一个客户端 和 一个服务器端程序
	1. 客户端（web浏览器）
	2. 服务器端（web服务器，如：apache、nginx。。。），用于存储web对象，每个对象由URL寻址。
	"HTTP定义了web客户端向web服务器请求web页面的方式，
	以及服务器向客户传送web页面的方式；"

客户端和服务器通过“HTTP报文”进行会话；

HTTP定义了这些报文的结构以及交换方式；
```

#### 2. 用户请求过程页面过程

1. HTTP：当用户请求一个Web页面时，浏览器向服务器发出对该页面中所包含对象的HTTP报文请求，服务器接收到请求并用包含这些对象HTTP响应报文进行响应。

2. TCP：

   ```
   1. HTTP客户首先发起一个与服务器的TCP连接，一旦连接，服务器和服务器进程就可以通过套接字接口访问TCP（套接字接口是客户进程与TCP连接的门，服务器一样）
   
   2. 客户向他的套接字接口发送HTTP请求报文并从他的套接字接口接收HTTP响应报文。
   
   3. 一旦客户向他的套接字接口发送一个请求报文，该报文就脱离了客户控制并进入TCP的控制
   
   4. 服务器通过套接字接收到客户发来的请求报文，返回包含这些请求报文中web对象的响应报文（也是传入套接字接口，交给TCP控制）
   
   注意：服务器向客户发送被请求的文件，而不存储任何关于该客户的状态信息，例如某个特定的客户在几秒内两次请求了同一个对象，所以说HTTP是无状态协议
   ```

#### 3. HTTP的非持续连接（串行连接） 和 持续连接

1. 非持续连接（串行连接、短连接、短轮训）：HTTP/1.0版本经常使用，是指一个TCP连接只发送一个HTTP请求报文，当服务器端返回HTTP响应报文时HTTP服务进程通知关闭TCP连接

2. 持续连接（长连接、长轮询）HTTP/1.1默认实现：

   ```
   1. 相同的客户和服务器之间，后续的请求和响应报文能够通过相同的连接进行发送
   
   2. 是指一个网页使用一个TCP连接发送所有HTTP请求报文，服务器返回HTTP响应报文时也不关闭TCP连接；更有甚者，位于同一个服务器端的多个Web页面返回给同一个客户时，使用一个TCP连接；
   
   3. 对对象的请求可以一个接一个的发出，而不必等待未解决请求的回答（类似流水线）
   
   4. 一条连接经过一定的时间间隔仍未被使用，HTTP服务器将会关闭该连接
   
   优点：当客户端发起多个HTTP请求时，减少了建立TCP连接造成的网络资源和通信时间的浪费
   ```

#### 4. HTTP报文格式

1. 请求报文

   ```js
   GET /somedir/page.html HTTP/1.1		// 请求行(方法、URL、HTTP版本)
   Host: www.someschool.edu			// 指明对象所在的主机		-| 
   Connection: close					// 是否开启持续连接			 -| 首部行（有多个）
   User-agent: Mozilla/5.0				// 用户代理(浏览器)版本	    -|
   Accept-language: fr					// 客户接受的语言			  -|
   -----------\n空行------------------------
   实体体(entity body)				  // 实体体（请求体），POST方法请求时，参数放在实体体里面，GET则放在请求行的URL里面 
   ```

2. 响应报文

   ```js
   HTTP/1.1 200 OK									// 状态行(HTTP版本、状态码、状态信息)
   Connection: close								// 告诉客户这是非持续连接，发送完报文后将关闭该TCP连接 首部行
   Date: Tue, 18 Aug 2015 15:44:04 GMT				// 发送响应报文的时间							首部行						
   Server: Apache/2.2.3 (CentOS)					// 产生报文的服务器信息						    首部行				
   Last-Modified: Tue, 18 Aug 2015 15:11:03 GMT	// 对象创建或者最后修改的时间					  首部行				
   Content-Length: 6821							// 被发送对象中的字节数							首部行					
   Content-Type: text/html							// 指示了实体体中的对象是HTML文件（被返回对象的类型）	首部行		
   ----------空行-----------
   (data data data data data data ... )			// 实体体（所请求的对象本身）
   ```

#### GET 和 POST的区别

1. GET参数通过url传递；POST参数放在请求体中
2. GET请求在url中存放的参数是有长度限制的（一般为2k）；POST则没有
3. GET请求只能进行url编码；POST请求可以多种编码（form-data、urlencoded、json、xml）
4. GET请求会被浏览器主动缓存，留下历史记录；POST则不会
5. GET产生一个TCP报文；POST产生两个TCP报文，对于POST，浏览器先发送header，服务器响应100 continue，浏览器再发送data，服务器响应200 ok(返回数据)。而在网络环境差的情况下，两次包的TCP在验证数据包完整性上，有非常大的优点。

#### 浏览器 强缓存 和 协商缓存

1. 强缓存(本地缓存)，通过服务端返回 expires 和 cache-control 首部行来设定，由服务端设定的

   ```js
   浏览器不会向服务器发送任何请求，直接从本地缓存中读取文件并返回200
   200 from memory cache：不访问服务器，一般已经打开浏览器加载过此资源且缓存在了内存中，直接从内存中读取，浏览器关闭就释放。
   
   200 from disk cache：不访问服务器，访问过该资源，缓存到磁盘上，关闭浏览器不释放
   
   memory cache > disk cache > request
   ```

2. 协商缓存，通过客户端和服务端共同设定的

   ```js
   Etag / If-None-Match
   Last-Modified / If-Modified-Since
   
   为什么要有Etag
   
   一些文件也许会周期性的更改，但是他的内容并不改变(仅仅改变的修改时间)，这个时候我们并不希望客户端认为这个文件被修改了，而重新GET；
   
   某些文件修改非常频繁，比如在秒以下的时间内进行修改，(比方说1s内修改了N次)，If-Modified-Since能检查到的粒度是s级的，这种修改无法判断(或者说UNIX记录MTIME只能精确到秒)；
   
   某些服务器不能精确的得到文件的最后修改时间。
   ```

   第一次发起请求时，本地无缓存，服务器响应式，响应报文中包含 缓存设置信息

   ![](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210915143442305.png)

   第二次请求，强缓存 和 协商缓存的工作

![image-20210915143452284](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210915143452284.png)

#### HTTP线头阻塞问题

长链接和短连接 都采用的请求-应答模式，报文必须一发一收就形成了一个串行队列，排在队头的请求最先处理，如果队头请求耗时过长，后面的请求就只能处于住阻塞状态，就称为队头阻塞（线头阻塞）；

管道化持续连接，虽然不用一发一收了，但是响应报文必须按照请求的顺序返回，也形成了队头阻塞；

`解决方案`：

1. 并发连接：现在浏览器标准中一个域名可以并发连接6~8个
2. 域名分片：一个域名最多6~8个，那咱就多来几个域名，这样就可以并发更多的长连接了



### HTTPS

### cookie是什么

```js
http协议是无状态协议，不保存浏览器访问它适合的状态，也不知道是不是同一个浏览器在访问它。
cookie 就是一种浏览器管理状态的一个文件
```

![image-20210915152102105](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210915152102105.png)

第一次访问网站的时候，浏览器发出请求，服务器响应请求时会将cookie放入响应报文中，在浏览器第二次访问服务器时，会将cookie带过去，服务器会辨别用户身份，服务器也可以修改cookie内容

#### 1. cookie不可跨域

cookie不能再不同的域名下用，每个cookie都会绑定单一的域名；当在百度上面设置cookie时，如果domain不等于.baidu.com就设置不上去。

#### 2. cookie的属性

```js
name　　字段为一个cookie的名称。
value　　字段为一个cookie的值。
domain　　字段为可以访问此cookie的域名。
path　　字段为可以访问此cookie的页面路径。 比如domain是abc.com,path是/test，那么只有/test路径下的页面可以读取此cookie。
expires/Max-Age 　　字段为此cookie超时时间。若设置其值为一个时间，那么当到达此时间后，此cookie失效。不设置的话默认值是Session，意思是cookie会和session一起失效。当浏览器关闭(不是浏览器标签页，而是整个浏览器) 后，此cookie失效。
Size　　字段 此cookie大小。
http　　字段  cookie的httponly属性。若此属性为true，则只有在http请求头中会带有此cookie的信息，而不能通过document.cookie来访问此cookie。能有效放置xss攻击
secure　　 字段 设置是否只能通过https来传递此条cookie
```

cookie的主要用途：

- 会话状态管理（如用户登录状态、购物车、游戏分数或其它需要记录的信息）
- 个性化设置（如用户自定义设置、主题等）
- 个性化设置（如用户自定义设置、主题等）

### cookie、localStorage、sessionStorage、IndexDB

![image-20210328184022756](https://i.loli.net/2021/03/28/Jzfwk8UqoCEPb3u.png)

#### cookie、localStorage、sessionStorage的区别

- 共同点：都是保存在浏览器端，且都遵循同源策略
- 不同点：生命周期和作用域不同
- 作用域：localStorage只要在相同的协议、相同的主机名、相同的端口下，就能读取/修改到同一份localStorage数据。sessionStorage比localStorage更严苛一点，除了协议、主机名、端口外，还要求在同一窗口（也就是浏览器的标签页）下

#### IndexDB是运行在浏览器上的非关系型数据库



### Web缓存器（代理服务器）

```js
1. 它是能够代表初始Web服务器来满足HTTP请求的网络实体

2. 它有自己的磁盘存储空间，并在存储空间中保存最近请求过的对象的副本

3. 可以配置用户浏览器，使得用户浏览器请求首先被定向到该Web缓存器，流程如下：
	1. 浏览器创建一个到Web缓存器的TCP连接，并向Web缓存器发送一个HTTP请求报文
    2. Web缓存器收到报文中的对象后，检查对象在本地是否存储了该对象的副本；如果有，Web缓存器也会向初始服务器发送一个“条件GET报文”询问该对象是否被修改过，如果没有修改过，初始服务器返回的报文中不会包含该对象（状态码304），Web缓存器就直接给浏览器返回一个包含该对象副本的响应报文；如果修改过，初始服务器返回的报文中就包含了该对象，然后web缓存器在本地缓存该对象后，给浏览器返回包含该对象的响应报文。
    3. 如果没有，web缓存器就通过HTTP请求报文中的Host首部行的目标主机，向web初始服务器创建一个TCP连接，并且发送一个对该对象HTTP请求。
    4. 初始服务器收到请求后，就返回一个包含该对象的响应报文给Web缓存器
    5. web缓存器收到初始服务器发来的包含该对象的响应报文后，在本地复制一个该对象的副本，然后将该返回一个包含该对象副本的响应报文给浏览器
    注意：web缓存器既是服务器又是客户端
```

#### 在因特网上安装Web缓存器的积极原因：

1. 大大减少了客户请求的响应时间
2. 大大减少了机构接入因特网的通信量，减少通信量，就不必急于增加带宽，因此降低了费用。
3. 大大降低了因特网上的Web流量，从而改善了所有应用的性能

#### 在因特网上安装Web缓存器的问题：

##### 问题描述：

在web缓存器中缓存的对象副本，可能是陈旧的；换句话说，就是web缓存器在缓存该对象副本之后，该对象在初始服务器上可能已经被修改了；这就会让我们从web缓存器上面获取到的对象不是最新的！！！

##### 解决方案：条件GET方法

如果请求报文使用的GET方法， 并且包含首部行If-Modified-Since，那么这个请求报文就是一个“条件GET方法”.

1. 缓存器向初始服务器发送一个“条件GET报文”

   ```js
   GET /fruit/kiwi.gif HTTP/1.1
   Host: www.exotiquecuisine.com
   If-Modified-Since: Wed, 9 Sep 2015 09:23:24		// 等于本地缓存的文件的最后修改时间（等于最先服务器返回的响应报文中的Last-Modified）
   ```

2. 该条件报文询问服务器，在指定时间之后对象被修改过，才返回对象；如果没有修改过，就向缓存服务器发送一个响应报文：

   ```js
   HTTP/1.1 304 Not Modified
   Date: Sat, 10 Oct 2015 15:39:29
   Server: Apache/1.3.0 (unix)
   
   (empty entity body)
   ```




### DNS：因特网的目录服务（域名系统）

主要实现主机名（域名）到IP地址的转换，浏览器请求一个URL：freshone.top/home/ 的转换流程：

```js
1. 首先同一台主机上运行着DNS应用的客户端

2. 浏览器从上述URL中抽取出主机名 freshone.top，并将主机名传给DNS应用的客户端

3. DNS客户向DNS服务器发送一个包含主机名的请求报文

4. DNS客户最终会收到一份响应报文，其中包含改主机名的IP地址

5. 一旦浏览器接收到来自DNS该IP地址，它就能向该IP地址指向的web服务器创建一个TCP连接
```



###  CDN：内容分发网络

CDN通过在多个地理位置配置服务器，以接近端用户，进而优化用户请求的迟延和吞吐量，

```js
一般所有主要视频流公司都利用CDN，就比如youtube，我在国内请求youtube上面的视频，youtube站点离我那么远，为什么观看视频起来还是那么流畅？这就是利用了CDN，youtube将视频内容存储到CDN，而CDN又在全国各地配置了服务器，CDN就会截获我们的请求，然后我们就相当于在请求CDN上面的视频。
```

#### 1. CDN通常采用两种不同的服务器安置原则

```js
1. 深入，通过在遍及全球的接入ISP中部署服务器集群来深入到ISP的接入网中，要耗费大量维护和管理的精力
2. 邀请做客，通过在少量（例如10个）关键位置建造大集群来邀请到iSP做客，一般放置在因特网交换点IXP；与深入原则相比，不需要耗费大量维护精力，但是会以用户请求的迟延和吞吐量作为代价
```

#### 2. 集群选择策略

```js
1. 集群选择策略
	1. 地理上最近邻近策略，就是找跟当前客户地址位置最近的CDN集群
    2. 在上面策略下，执行了对全世界所有LDNS发送探测分组，以进行时延和丢包性的周期性实时		测量
2. 通过DNS将客户请求重定向到该集群的某台服务器
	1. 首先请求video.freshone.top时，LDNS会向根DNS、顶级域DNS和权威DNS请求
	2. 最后在freshone权威DNS服务器中，检测到video字符串，为了将DNS交给CDN，权威DNS		服务器向LDNS服务器返回了一个CDN的主机名
    3. 然后LDNS向CDN服务器发送请求，CDN服务器根据LDNS的IP地址，就进行集群选择策略，		选择一个相对最近的且时延和丢包性最低的集群服务器IP地址
    4. 一旦客户机收到CDN的IP地址就向CDN建立一条TCP连接，进行HTTP流服务（DASH服务）
```



### [XSS 和 CSRF](https://juejin.cn/post/6844903638532358151)

#### 1. XSS(Cross Site Script)跨站脚本攻击

```js
XSS: 是指攻击者在网站上注入恶意的客户端代码，通过恶意脚本盗取用户信息或执行权限操作等

脚本包括js、HTML、Flash，攻击的共同点：
    1、将一些隐私数据像cookie、session发送给攻击者
    2、将受害者重定向到一个由攻击者控制的网站
    3、在受害者的机器上进行一些恶意操作
XSS类型：
	1、反射性：注入一个连接，然后将你带入到一个攻击者设定的恶意网站
    2、存储型：攻击者在发布的博客里面注入了恶意脚本（存储在服务器端），你只要查看这篇博客就会自动执行
    3、DOM型：注入连接，改变DOM
`XSS攻击防范`：
	1、对输入、输出结果进行过滤和必要的转义
    2、使用HttpOnly可以防止注入的恶意脚本操作cookie中的内容
```

#### 2. [CSRF(Cross Site Request Forgery)跨站请求伪造](https://www.cnblogs.com/snowie/p/15044091.html)

```js
CSRF: 是一种劫持受信任用户向服务器发送非预期请求的攻击方式
`通常情况下，CSRF 攻击是攻击者借助受害者的 Cookie 骗取服务器的信任，可以在受害者毫不知情的情况下以受害者名义伪造请求发送给受攻击服务器，从而在并未授权的情况下执行在权限保护之下的操作。`
CSRF防范措施：
	1、验证码
    2、token验证
    3、判断请求报文的Referer(来源)首部行是否正确
注意：跨域请求并不会主动带上cookie，除非你设置了cookie的属性same_site，但是chrome和edge需要先设置secure属性为true，而firefox却不用
```



### 什么是跨域？

#### 1. 同源策略 及其限制内容

```js
同源策略是浏览器最基本的安全功能，如果缺少，很容易受到XSS、CSRF攻击
同源是指：`协议+域名+端口` 三者相同

限制内容：
cookie、localstorage、indexedDb等储存性内容
DOM节点
AJAX请求发送后，被浏览器拦截

允许跨域加载资源的标签：
<img src=xxx>
<link href=xxx>
<script src=xxx>
<iframe src=xxx>
    
`跨域并不是请求发不出去，请求能发出去，服务端能收到请求并正常返回结果，只是结果被浏览器拦截了。`跨域并不能完全阻止CSRF，因为请求已经发出去了。
```

#### 2. 跨域解决方案

1. JSONP原理

   ```js
   1. 利用<script>标签没有跨域限制的特性，网页可以像平时解析<script>文件一样解析，接口所返回的数据，然后执行；
   2. 需要服务器做支持，返回带有（请求传去的）回调函数调用的字符串，然后数据作为参数才行
   `优点`：兼容性好
   缺点：只能发送get请求，不安全容易xss CSRF
   
   js代码
   <script>
     function jsonp(data) {
       console.log(data);
     }
   </script>
   <script src="http://tp.freshone.top/index/home/index/callback/jsonp">
   </script>
   
   接口代码
   public function index($callback){
       $data = "jsonp success";
       return $callback."(\"$data\")";
   }
   ```

2. CORS跨源请求

   ```js
   实现CORS的关键是后端，后端设置了Access-Control-Allow-Origin(接口控制允许访问的来源)就可以开启CORS。但是会在发送请求时出现两种情况，分为`简单请求`和`复杂请求`
   （必须）Access-Control-Allow-Origin: *
   （可选）Access-Control-Allow-Credentials: true//表示允许是否发送cookie，默认情况下cookie不包含cros请求中
   （可选）Access-Control-Expose-Headers: name//携带上制定响应头的字段
   
   1、简单请求
   ```

   ![image-20210915204028092](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210915204028092.png)

   ```js
   2、`复杂请求，不满足上图要求的都是复杂请求`
   
   复杂请求的CORS请求，会在正式通信之前增加一次只带有header的HTTP预检请求，该请求使用OPTIONS方法，通过该请求检测服务器是否允许跨域请求。
   ```

3. postMessage

   ```js
   postMessage()方法允许来自不同源的脚本采用异步方式进行有效的通信，可以实现跨文本文档，多窗口，跨域消息传递。
   `通过发送消息给跨域脚本，然后跨域脚本就可以发送请求到同源接口获取数据，然后返回给请求的跨域脚本`
   
   `http://freshone.top/index.html`
   document.body.innerHTML = ""
   window.addEventListener('message', function(e){
   	document.body.appendChild(document.createTextNode(e.data))
   	window.parent.postMessage('postMessage respond', "http://127.0.0.1:5501/")
   })
   
   `http://127.0.0.1:5501/test_file/csrf_cookie.html`
   <div id="msg" style="float: right;width: 250px;"></div>
   <iframe src="http://freshone.top" id="iframe" frameborder="0" onload="sendPostMessage()"></iframe>
   <button onclick="sendPostMessage()">sendPostMessage</button>
   
   <script>
   	window.addEventListener('message', function (e) {
   	  console.log('receive');
   	  var div = document.getElementById('msg');
   	  div.appendChild(document.createTextNode(e.data))
   	}, false)
   	
   	function sendPostMessage(){
   	  console.log(1);
   	  var iframe = document.getElementById('iframe')
   	  iframe.contentWindow.postMessage('postMessage request', 'http://freshone.top')
   	}
   </script>
   ```
   
4. nginx反向代理

   ```js
   原理：搭建一个中转nginx服务器，用于转发请求
   优点：使用nginx反向代理实现跨域，是最简单的跨域方式。只需要修改nginx的配置即可解决跨域问题，支持所有浏览器，支持session，不需要修改任何代码，并且不会影响服务器性能。
   
   // proxy服务器
   server {
       listen       81;
       server_name  www.domain1.com;
       location / {
           proxy_pass   http://www.domain2.com:8080;  #反向代理
           proxy_cookie_domain www.domain2.com www.domain1.com; #修改cookie里域名
           index  index.html index.htm;
   
           # 当用webpack-dev-server等中间件代理接口访问nignx时，此时无浏览器参与，故没有同源限制，下面的跨域配置可不启用
           add_header Access-Control-Allow-Origin http://www.domain1.com;  #当前端只跨域不带cookie时，可为*
           add_header Access-Control-Allow-Credentials true;
       }
   }
   
   
   ```

   

## 操作系统

### 进程与线程

1. ```js
   1. `进程`是`CPU`资源分配的最小单位
   2. 字面意思就是进行中的程序，我将它理解为一个可以独立运行且拥有自己的资源空间的任务程序
   3. `进程`包括运行中的程序和程序所使用到的内存和系统资源
   ```

2. ```js
   1. 线程是CPU调度的最小单位，线程是基于进程的，一个线程可以理解为一个程序的执行，然后一个进程有多个程序
   ```

3. 





































