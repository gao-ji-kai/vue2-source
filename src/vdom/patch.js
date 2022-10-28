

export function patch(oldVnode, Vnode) {
    //oldVnode是一个真实额元素 (首次渲染)
    //console.log(oldVnode, newVnode)
    const isRealElement = oldVnode.nodeType

    if (isRealElement) {
        //初次渲染
        const oldElm = oldVnode;//拿到 id="app"
        const parentElm = oldElm.parentNode;//拿到父元素 body

        let el = createElm(Vnode)  //根据虚拟节点 创建出真实节点
        parentElm.insertBefore(el, oldElm.nextSibling)//将创建的节点插到原有的节点的下一个
        parentElm.removeChild(oldElm);

        return el//vm.$el
    } else {
        //diff算法
    }
}

function createComponent(vnode) {
    let i = vnode.data;
    if ((i = i.hook) && (i = i.init)) {
        i(vnode);//调用组件的初始化方法
    }
    return false
}


//根据虚拟节点 创建出真实节点
function createElm(vnode) {
    let { vm, tag, data, key, children, text } = vnode
    if (typeof tag === 'string') {//也可能是个组件 先不考虑   两种可能

        //可能是组件，如果是组件就直接根据组件创建出组件对应的真实节点
        if (createComponent(vnode)) {
            //如果返回true说明这个虚拟节点是组件

            //如果是组件  就将组件渲染后的真实元素给我
            return
        }




        vnode.el = document.createElement(tag);//用vue的指令时，可以用过vnode拿到真实的dom  虚拟节点配合真实dom
        //更新dom上的属性
        updateProperties(vnode);

        //有可能有儿子
        children.forEach(child => {//可能有文本  可能有元素
            //根据子节点 创建元素
            vnode.el.appendChild(createElm(child))//递归创建

        })
    } else {//文本情况
        vnode.el = document.createTextNode(text)

    }

    return vnode.el
}

function updateProperties(vnode) {
    let newProps = vnode.data || {};//属性
    let el = vnode.el//dom元素

    for (let key in newProps) {
        if (key == 'style') {
            for (let styleName in newProps.style) {
                el.style[styleName] = newProps.style[styleName]
            }
        } else if (key == 'class') {
            el.className = newProps.class
        } else {
            el.setAttribute(key, newProps[key])

        }
    }
}