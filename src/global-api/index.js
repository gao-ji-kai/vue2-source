import { mergeOptions } from "../until/until"

export function initGlobalAPI(Vue) {
    Vue.options={}//用来存储全局的配置   例如   页面调取了两次mixin  就应该将第一的的mixi中的内容先存储 然后将第二个跟第一个做合并
   //filter directive component
    Vue.mixin = function (mixin) {

        //mergeOptions
        this.options = mergeOptions(this.options, mixin)
        //console.log(this.options)
        return this;
    }


    Vue.options_base = Vue;//Vue 的构造函数
    Vue.options.components={}//用来存放组件的定义
    Vue.component = function (id,definition) {
        definition.name = definition.name || id;
        definition = this.options_base.extend(definition)//通过对象产生一个构造函数

        this.options.components[id] = definition;
        console.log(this.options)
    }
    Vue.extend = function (options) {//子组件初始化时会 new VueComponent()
        //new VueComponent()
        const Super = this;
        const Sub = function VueComponent (options) {
            this._init(options)
        }
        Sub.prototype = Object.create(Super.prototype);//都是通过Vue继承来的
        Sub.prototype.constructor = Sub;
        Sub.component = Super.extend;
        //每次声明一个组件 都会把父级的定义放到自己的身上
        Sub.options = mergeOptions(
            Super.options,
            options)
        return Sub//这个构造函数是由对象产生而来的
    }
    //Sub.component()
}