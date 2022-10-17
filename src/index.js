//Vue2.0中就是一个构造函数 如果用class(类)的话  

import { initMixin } from "./init";

// class Vue{
//     a(){}
//     b(){}
//     c(){}
// }


//构造函数
function Vue(options){
    console.log(options)
    this._init(options)//当用户new Vue时就调用init方法进行vue的初始化方法
}

//Vue初始化  扩展原型方法
//可以拆分逻辑到不同的文件中 更利于代码维护  模块化的概念

initMixin(Vue);//初始化混合

// Vue.prototype._init = function (options) {
    
// };



export default Vue


//库->rollup   项目开发->webpack