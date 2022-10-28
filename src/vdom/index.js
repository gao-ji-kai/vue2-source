import { isObject, isReservedTag } from "../until/until";

//导出 创建元素虚拟节点
export function createElement(vm, tag, data = {}, ...children) {

    //需要对标签名做过滤   因为有可能标签名是一个自定义组件
    if (isReservedTag(tag)) {
        return vnode(vm, tag, data, data.key, children, undefined);
    } else {
        //是一个组件标签
        const Ctor = vm.$options.components[tag];//对象或者函数
        return createComponent(vm, tag, data, data.key, children, Ctor)
    }

}

function createComponent(vm, tag, data, key, children, Ctor) {
    if (isObject(Ctor)) {
        Ctor = vm.$options._base.extend(Ctor)
    }
    //console.log(Ctor)
    //给组件增加生命周期
    data.hook = {
        init(vnode) { 
            //调用子组件的构造函数
     vnode.componentInstance=  new vnode.componentOptions.Ctor({})
        }//初始化的钩子
    }
    console.log(vnode(vm, `vue-component-${Ctor.cid}-${tag}`, data, key, undefined, undefined, { Ctor }))
    //组件的虚拟节点 拥有hook和当前组件的componentOptions中存放了组件的构造函数
    return vnode(vm, `vue-component-${Ctor.cid}-${tag}`, data, key, undefined, undefined,{Ctor})
}



//导出创建文本虚拟节点
export function createTextVnode(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text);
}

//vue底层用的是个类 这里用个方法
function vnode(vm, tag, data, key, children, text,componentOptions) {
    return {
        vm,
        tag,
        children,
        data,
        key,
        text,
        componentOptions
    }
}
//vnode(虚拟DOM)和AST(抽象树)  vnode 可以随意添加属性  AST是针对语法解析出来的结构不能添加不存在的属性