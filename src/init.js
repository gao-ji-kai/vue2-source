import { compileToFunctions } from "./compiler/index";
import { initState } from "./state";

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    //console.log(options);
    const vm = this;
    vm.$options = options; //在实例上有个属性$options 表示的是用户传入的所有属性

    //初始化状态   可能初始化很多东西 逻辑很多  一个功能写一个方法
    initState(vm);

    if (vm.$options.el) {
      //说明数据可以挂载到页面上
      vm.$mount(vm.$options.el);
    }
  };
  
  Vue.prototype.$mount = function (el) {
    el = document.querySelector(el);
    const vm = this;
    const options = vm.$options;
   
    //如果有render直接使用render即可，没有render看有没有template属性，没有template就接着找外部模板
    if (!options.render) {
      let template = options.template;
      if (!template && el) {
        template = el.outerHTML; //火狐不兼容 document.createElement('div').appendChild('app').innerHTML
      }
      
      console.log(template);

      //如何将模板编译成render函数
      const render = compileToFunctions(template); //将模板编译成一个函数
      options.render = render;
    }
  };


//   Vue.prototype.$mount = function (el){
//     el =document.querySelector(el);
//     const vm =this;
//     const options = vm.$options
// //如果有render直接使用render即可，没有render看有没有template属性，没有template就接着找外部模板
//     if(!options.render){
//       let template = options.template;
//       if(!template && el){
//         template = el.outHTML
//       }
//       console.log(template)
//     }
//   }
}
//vue的数据   data props computed  watch...
// export function initState(vm) {
//   //将所有数据都定义在vm属性上，并且后续更改需要触发视图更新
//   //拿到用户定义的参数 如data methods等
//   const opts = vm.$options; //获取用户属性

//     if (opts.props) {

//     }
//     if (opts.methods) {

//     }
//     if (opts.data) {//数据的初始化

//     }
//     if (opts.computed) {

//     }
//     if (opts.watch) {

//     }

//   if (opts.data) {//数据的初始化
//     initState(vm);
//   }
// }

// //一层套一层  粒度会越来越小
// function initData(vm) {

// }
