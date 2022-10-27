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
}