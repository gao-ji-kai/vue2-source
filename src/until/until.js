let callbacks = []

function flushCallbacks() {
    for (let i = 0; i < callbacks.length; i++) {
        let callback = callbacks[i];
        callback()
    }       
    waiting=false
}
//批处理  第一次开定时器  后续只更新列表  之后执行清空逻辑

//第一次cb是渲染watcher  更新操作  (渲染watcher执行的过程肯定是同步的)
//第二次的cb是用户传入的回调
let waiting = false; 
export function nextTick(cb) {  W
    callbacks.push(cb)//目前默认的cb  是渲染逻辑  用户的逻辑放到渲染逻辑之后即可

    if (!waiting) {
        waiting = true
        //vue2 做兼容性处理先判断是否支持Promise，如果不支持就采用MutationObserver()，然后是seImmediate（ie专用），最后是setTimeout，依次判断。


        Promise.resolve().then(flushCallbacks)//多次调用nextTick 只会开启一个promise
    }

}


//nextTick肯定有异步功能