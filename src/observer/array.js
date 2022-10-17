//首先  我需要拿到原来数组原型上的方法  天生自带的方法
let oldArrayProtoMethods = Array.prototype;

//不能直接改写数组原有方法  不可靠  因为只有在vue data中定义的数组才需要改写

//创建一个元素  让他指向原型   继承关系
export let arrayMethods = Object.create(Array.prototype);

//因为他指向数组原型链 所以 就可以拿到原型链上的方法
//arrayMethods.push===arrayMethods._proto_.push

//对数组方法进行重写  一般对改变原数组的操作进行重写

let methods = [
    "push", 
    "pop", 
    "shift", 
    "unshift", 
    "splice", 
    "reverse", 
    "sort"
];
//如果用户调用arrayMethods.push方法，会调取我重写后的 也就是下面这一坨

methods.forEach((methods) => {//AOP切片编程   把原有的逻辑 割一刀 插入自己的逻辑
  arrayMethods[methods] = function (...args) {//重写数组方法
        //做些自己的事儿 
    console.log('数组变化')
    let result = oldArrayProtoMethods[methods].call(this,...args);//这里的this指向arrayMethods
    
    
    //有可能用户后增加的数据是对象格式，也需要进项拦截
    //做个判断  只对数组增加的方法进行判断
    let inserted;
    let ob=this.__ob__;
    switch (methods) {
        case 'push':
        case 'unshift':
            inserted=args;
            break;
            case 'splice'://splice(0,1,xxxx) 
            //因为splice方法第三个才是新增的   
            inserted=args.slice(2);
        default:
            break;
    }

   if(inserted){//如果有值 都需要调observeArray()  这里的this指向调用者 this.__ob__.observeArray(inserted) 
    ob.observeArray(inserted)
   }
    return result
  };
});
