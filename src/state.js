import { observe } from "./observer/index.js";


//初始化状态函数中，主要是针对不同情况做不同的初始化。
//例如传入data，传入props，传入methods等等，需要分别初始化。



//vue的数据   data props computed  watch...
export function initState(vm) {
  //将所有数据都定义在vm属性上，并且后续更改需要触发视图更新
  //拿到用户定义的参数 如data methods等
  const opts = vm.$options; //获取用户属性

  //   if (opts.props) {

  //   }
  //   if (opts.methods) {

  //   }
  //   if (opts.data) {//数据的初始化

  //   }
  //   if (opts.computed) {

  //   }
  //   if (opts.watch) {

  //   }

  if (opts.data) {
    //数据的初始化
    initData(vm);
  }
}

function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key];
    },
    set(newValue) {
      vm[source][key] = newValue;
    },
  });
}

//一层套一层  粒度会越来越小
function initData(vm) {
  //console.log(vm);
  //进行数据劫持  Object.defineProperty
  //拿到用户传来的数据
  let data = vm.$options.data; //拿到的data有两种情况  一种是对象，一种是函数 根实例可以是对象，可以是函数，组件中data必须是函数
  //对data类型进行判断  如果是函数  获取函数返回值作为对象
  //用call是为了保证date中如果写了this  保证this永远指向当前的实例
  data = vm._data = typeof data === "function" ? data.call(vm) : data;

  //通过vm._data获取劫持后的数据，用户就可以拿到_data

  //data = vm._data = typeof data === "functions" ? data.call(vm) : data;这样很麻烦   所以就需要代理

  //将_data中的数据全部放到vm上
  for (let key in data) {
    proxy(vm, '_data', key); //如果用户使用  vm.name 等价于 vm._data.name
  }

  //观测这个数据    Vue响应式的核心方法
  observe(data);
}
