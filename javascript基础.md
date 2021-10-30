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

