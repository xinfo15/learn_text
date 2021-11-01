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

