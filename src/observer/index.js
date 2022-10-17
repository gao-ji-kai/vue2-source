import { arrayMethods } from "./array";
//对数组和对象进行拦截
class Observer {
  constructor(value) {
    //需要对val属性重新定义

    //value可能是对象 可能是数组，分类处理    数组不用defineProperty拦截

    //增加一个自定义属性
    //value.__ob__=this;
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
    for (let i = 0; i < value.length; i++) {
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

function defineReactive(data, key, value) {
  //vue2中数据嵌套不要过深，过深浪费性能

  //value的值可能是个对象
  observe(value); //对结果进行递归拦截

  //defineProperty是重写了get，set方法，而proxy是设置一个代理  不用改写原对象

  Object.defineProperty(data, key, {
    get() {
      return value;
    },
    set(newValue) {
      if (newValue === value) return;
      observe(value); //如果用户设置的是一个对象，就继续将用户设置的对象变为响应式的
      value = newValue;
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
