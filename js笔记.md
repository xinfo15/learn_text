# 8.理解对象

## 8.1.4 合并对象

Object.assgin(目标对象，多个对象。。。) 合 并对象属性到目标对象

### 8.2.1 用new 构造函数  创建对象的过程

1. 在内存中创建一个新对象
2. 把构造函数prototype属性赋值给新对象的[[Prototype]]特性
3. 把构造函数的this指针指向新对象
4. 执行构造函数内部代码
5. 如果构造函数返回非空对象，则返回这个非空对象；否则返回创建的新对象

### 8.2.2 操作对象的原型

Person.prototype.isPrototypeOf(person1)  // 判断实例的是不是某个构造函数的原型

Object.getPrototypeOf(person1)	// 获取实例的原型并返回

Object.setPrototypeOf(person1, constructor1)	// 修改实例的原型，为cons..1，影响性能

let person2 = Object.create(cons2)	// 用cons2原型对象创建person2实例

### 8.2.3 原型层级搜索

执行person1.name 时，会先开始搜索实例本身是否有同名属性，有则返回；否则，就去该实例的原型对象上面搜索是否有同名属性，有则返回；否则，返回undefined

### 8.4.1 类构造函数和函数构造函数的区别

调用类构造函数必须使用new操作符，不使用会报错。

函数构造函数可以直接调用也可以使用new操作符，不使用new时，this指向全局对象

# vue基础

### webpack

webpack安装 npm install webpack@5.42.1 webpack-cli@4.7.2 -D

参照文档 npmjs.com

![image-20210908095512463](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210908095512463.png)

dependencies节点表示开发时要用到的包和上线时要用到的包 npm后缀 -S(--save)

devDependencies节点表示只在开发时要用到的包，上线后不需要用 npm后缀 -D(--save-dev)

![image-20210908102007248](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210908102007248.png)

webpack运行流程

运行前先读取webpack.config.js配置文件

![image-20210908102513325](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210908102513325.png)

![image-20210908102715159](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210908102715159.png)

![image-20210908103440591](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210908103440591.png)

这个插件把打包后的文件保存到内存中，因为每次保存都更新到物理磁盘很耗费，默认隐藏显示在根目录下的同名main.js文件



![image-20210908103817217](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210908103817217.png)

![image-20210908105855466](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210908105855466.png)

###  vue生命周期

![image-20210909143930718](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210909143930718.png)

![image-20210909150907563](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210909150907563.png)

![image-20210909151019641](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210909151019641.png)

![image-20210909151415507](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210909151415507.png)