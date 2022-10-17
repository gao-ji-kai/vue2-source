//导出 创建元素虚拟节点
export function createElement(vm, tag, data = {}, ...children) {
    return vnode(vm, tag, data, data.key, children, undefined);
}
//导出创建文本虚拟节点
export function createTextVnode(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text);
}

//vue底层用的是个类 这里用个方法
function vnode(vm, tag, data, key, children, text) {
    return {
        vm,
        tag,
        children,
        data,
        key,
        text,

    }
}
//vnode(虚拟DOM)和AST(抽象树)  vnode 可以随意添加属性  AST是针对语法解析出来的结构不能添加不存在的属性