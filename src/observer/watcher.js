import { popTarget, pushTarget } from "./dep";

//每个组件间有多个watcher  所以需要加一个唯一标识  
let id = 0;
class Watcher {
    constructor(vm, exprOrFn, cb, options) {
        this.vm = vm;
        this.cb = cb;
        this.options = options;
        this.id = id++
        this.getter = exprOrFn
        this.drps = [];
        this.depsId = new Set();//去重  

        this.get();//调用传入的函数 调用了render方法  此时会对模板中的数据进行取值
    }
    get() {//这个方法中会对属性进行取值操作
        pushTarget(this)//给Dep.target赋了值 =watcher
        this.getter()//会取值  执行了observer中index.js中的54行 
        popTarget();//Dep.target = null;
    }
    addDep(dep) {
        let id = dep.id;
        if (!this.depsId.has(id)) {//dep是非重复的
            this.depsId.add(id)
            this.deps.push(dep)
            dep.addSub(this)
        }
    }
    //当属性取值时  需要记住这个watcher，稍后变化了  去执行自己记住的watcher即可
    //依赖收集
}
export default Watcher;