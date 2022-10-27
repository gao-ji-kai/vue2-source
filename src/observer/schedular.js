import { nextTick } from "../until/until";

let has = {};
let queue = [];


function flushSchedularQueue() {
    for (let i = 0; i < queue.length; i++) {
        let watcher = queue[i]
        watcher.run()
    }
    queue = []
    has = {}
    pending = false
}


//vue更新操作是异步操作
//多次调用queueWatcher 如果watcher不是同一个
let pending = false
export function queueWatcher(watcher) {//调度更新几次
    //更新时将watcher去重
    let id = watcher.id;
    if (has[id] == null) {
        queue.push(watcher);
        has[id] = true;
        console.log(queue);
        //让queue清空
        if (!pending) {
            pending = true
            nextTick(flushSchedularQueue);

        }


    }

}