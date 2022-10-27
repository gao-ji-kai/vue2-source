import { arrayMethods } from "./array";
import Dep from "./dep";
//对数组和对象进行拦截
class Observer {
  constructor(value) {
    //需要对val属性重新定义

    //value可能是对象 可能是数组，分类处理    数组不用defineProperty拦截

    //增加一个自定义属性
    //value.__ob__=this;

    this.dep = new Dep();//给数组本身和对象本身增加一个dep属性
    Object.defineProperty(value, "__ob__", {
      value: this,
      enumerable: false, //不能被枚举 表示  不能被循环
      configurable: false, //不能删除此属性
    });

    if (Array.isArray(value)) {
      //数组不用defineProperty拦截  性能不好
      //操作数组方法  push  shift  sort   我需要重写这些方法(一共7个)  增加更新逻辑
      //当是数组时  改写方法为自己重写后的方法
      Object.setPrototypeOf(value, arrayMethods); // 等价于value._proto_ = arrayMethods;

      //观测数组中的每一项
      this.observeArray(value); //处理原有数组中的对象  Object.freeze()冻结  冻结就不能被重写get和set了
    } else {
      this.walk(value);
    }
  }
  //监测数组变化
  observeArray(value) {
    //拿到数组每一项
    for (let i = 0; i < value.length; i++) {//如果数组中是对象的话  就会去递归观测  观测对的时候会增加__ob__属性
      observe(value[i]);
    }
  }
  //监测对象变化，类方便拓展 可直接在下面写方法 无需拆分 还是一个整体
  walk(data) {
    //将对象中所有的key 重新用defineProperty定义成响应式数据
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key]);
    });
  }
}
function dependArray(value) {//该方法就是让里层数组收集外层数组的依赖，这样修改里层数也可以更新视图
  for (let i = 0; i < value.length; i++){
    let current = value[i];
    current.__obj__ && current.__obj__.dep.depend()//让里层的和外层的 收集的都是用一个watcher
    if (Array.isArray(current)) {
      dependArray(current)
    }
  }
}

 export function defineReactive(data, key, value) {
  console.log(value,'444')
  //vue2中数据嵌套不要过深，过深浪费性能

  //value的值可能是个对象
 let childOb= observe(value); //对结果进行递归拦截
  //console.log(childOb.dep)
  //defineProperty是重写了get，set方法，而proxy是设置一个代理  不用改写原对象
  let dep = new Dep//观察者模式  每次都会给属性创建个dep
  Object.defineProperty(data, key, {//需要给每个属性都增加个dep
    get() {
      if (Dep.target) {
        dep.depend();//让这个属性自己的dep记住这个watcher  也会让watcher记住这个dep   一个双向的过程
        //childOb有可能是对象  有可能是数组
        if (childOb) {//如果对数组取值 会将当前的watcher和数组进行关联
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      } 
      console.log(key)
      return value;
    },
    set(newValue) {
      if (newValue === value) return;
      observe(value); //如果用户设置的是一个对象，就继续将用户设置的对象变为响应式的
      value = newValue;

      dep.notify()//通知dep中记录的watcher让它去执行
    },
  });
}

export function observe(data) {
  //console.log(data, "----------");
  //只对对象类型进行观测，非对象类型无法观测
  if (typeof data !== "object" || data == null) {
    return;
  }
  if (data.__obj__) {
    //入果有__obj__就说明该属性被观测过了  就直接返回  防止循环引用
    return;
  }

  //通过类来实现对数据的观测   类可以方便扩展  会产生实例  实例可作为唯一标识
  return new Observer(data);
}
