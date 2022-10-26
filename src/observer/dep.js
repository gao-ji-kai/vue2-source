//我们可以把当前watcher 放到一个全局变量上
let id = 0;//为了保持dep的唯一性
class Dep {
    constructor() {
        this.id = id++;
        this.subs = [];//属性要记住watcher

    }
    depend() {
        //让watcher记住dep
        //获取watcher
        Dep.target.addDep(this)//这里的this指的是Dep  name=>watcher  
    }
    //让dep记住watcher  
    addSub(watcher) {//存储watcher
        this.subs.push(watcher)
    }
    notify() {
        this.subs.forEach(watcher => watcher.update())
    }
}
Dep.target = null;//类的静态属性
export function pushTarget(watcher) {
    Dep.watcher = watcher
}
export function popTarget() {
    Dep.target = null;
}



export default Dep;