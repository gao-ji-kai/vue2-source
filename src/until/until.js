let callbacks = []

function flushCallbacks() {
    for (let i = 0; i < callbacks.length; i++) {
        let callback = callbacks[i];
        callback()
    }
    waiting = false
}
//批处理  第一次开定时器  后续只更新列表  之后执行清空逻辑

//第一次cb是渲染watcher  更新操作  (渲染watcher执行的过程肯定是同步的)
//第二次的cb是用户传入的回调
let waiting = false;
export function nextTick(cb) {
    callbacks.push(cb)//目前默认的cb  是渲染逻辑  用户的逻辑放到渲染逻辑之后即可

    if (!waiting) {
        waiting = true
        //vue2 做兼容性处理先判断是否支持Promise，如果不支持就采用MutationObserver()，然后是seImmediate（ie专用），最后是setTimeout，依次判断。


        Promise.resolve().then(flushCallbacks)//多次调用nextTick 只会开启一个promise
    }

}


//nextTick肯定有异步功能

export const isObject = (val) => typeof val == 'object' && val != null

export const LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted'
]
const strats = {};
function mergeHook(parentVal, childVal) {
    console.log(parentVal, childVal)
    if (childVal) {//如果没有儿子
        if (parentVal) {
            return parentVal.concat(childVal)
        } else {//如果儿子有父亲没有
            return [childVal]
        }
    } else {
        return parentVal
    }

}
LIFECYCLE_HOOKS.forEach(hook => {
    strats[hook] = mergeHook
})

strats.components = function (parentVal, childVal) {
    const res = Object.create(parentVal);
    if (childVal) {
        for (let key in childVal) {
            res[key] = childVal[key];
        }
    }
    return res
}
//生命周期合并
export function mergeOptions(parent, child) {
    //console.log(parent, child)
    const options = {}
    //{a:1}  {a:2} =>  合并后  {a:2}
    //{a:1}       =>  合并后{a:1}
    //自定义策略
    //1.如果父亲有，儿子也有 应该用儿子替换父亲
    //2.如果父亲有值  儿子没有  用父亲的 


    for (let key in parent) {
        mergeField(key)
    }
    for (let key in child) {
        if (parent.hasOwnProperty(key)) {
            mergeField(key)

        }
    }
    function mergeField(key) {
        //策略模式
        if (strats[key]) {
            return options[key] = strats[key](parent[key], child[key])
        }
        if (isObject(parent[key]) && isObject(child[key])) {
            options[key] = { ...parent[key], ...child[key] }
        } else {
            if (child[key]) {//如果儿子有值   以儿子的值为准
                options[key] = child[key];
            } else {
                options[key] = parent[key]
            }
        }
    }


    return options
}



//对标签进行过滤   区分哪些是自定义标签
function makeUP(str) {
    const map = {
        
    }
    str.split(',').forEach(tagName => {
        map[tagName]=true
    })
    return(tag)=>map[tag]||false
}
 
 export const isReservedTag = makeUP('a,p,div,ul,li,text,span,input,button')

//console.log(isReservedTag('my-button'))
