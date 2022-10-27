import { patch } from "./vdom/patch";
import Watcher from "./observer/watcher"
//渲染成真实DOM的
export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        // console.log('update', vnode);
        //将虚拟节点转换成真实dom
        const vm = this;

        console.log(vm.$options.el,vnode)
        //首次渲染 需要用虚拟节点 来更新真实的dom元素
        //初始化渲染的时候 会创建一个新节点 并且将老节点删掉

        //第一次渲染完毕后 拿到新的节点 下次再次渲染时替换上次渲染的结果
        vm.$options.el = patch(vm.$options.el, vnode);
    }
}


export function mountComponent(vm, el) {
    console.log(vm, el)

    //Vue渲染机制
    //Vue默认通过watcher来进行渲染的 = 渲染watcher(每一个组件都有一个渲染watcher)

    let updateComponent = () => {
        //调用runder方法
        vm._update(vm._render());//返回的是虚拟节点   是一个对象 vm._update是将虚拟节点转化为真实节点
    }
    //让实例的某某方法执行  四个参数   后面加true是为了表明 该watcher是一个渲染watcher
    new Watcher(vm, updateComponent, () => { }, true) //这句话就是相当于让 updateComponent 执行 updateComponent();


}