import { createElement, createTextVnode } from "./vdom/index"

export function renderMixin(Vue) {
    //创建元素的虚拟节点
    Vue.prototype._c = function (...args) {
        return createElement(this, ...args)//可以多传参数
    }
    //创建文本的虚拟节点
    Vue.prototype._v = function (text) {
        return createTextVnode(this, text)
    }
    //转化成字符串
    Vue.prototype._s = function (val) {
        return val == null ? '' : (typeof val == 'object') ? JSON.stringify(val) : val
    }

    //调用自定义render方法
    Vue.prototype._render = function () {
        //render
        //console.log('render')
        const vm = this;
        let render = vm.$options.render//获取编译后额render方法
        //调用render方法 产生虚拟节点 让render执行
        //render中有很多自定义的方法  如_c  _v  所以 会报错 
        let vnode = render.call(vm)//_c(xxx，xxx)  调用时会自动将变量进行取值，将实例结果进行渲染

        return vnode;//虚拟节点
    }
}