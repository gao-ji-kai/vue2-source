(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; //{{}}

  function genProps(attrs) {
    var str = '';
    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i]; //name value
      if (attr.name === 'style') {
        (function () {
          var obj = {};
          attr.value.split(';').forEach(function (item) {
            var _item$split = item.split(':'),
              _item$split2 = _slicedToArray(_item$split, 2),
              key = _item$split2[0],
              value = _item$split2[1];
            obj[key] = value;
          });
          attr.value = obj; //{style:{color:blue}}
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ","); //{a:'aaa',a:1,b:2}
    }

    return " {".concat(str.slice(0, -1), "}");
  }
  function genChildren(AST) {
    var children = AST.children;
    if (children) {
      return children.map(function (child) {
        return gen(child);
      }).join(',');
    }
  }
  function gen(node) {
    //区分是元素还是文本
    console.log(node);
    if (node.type == 1) {
      return generate(node);
    } else {
      //文本逻辑不能用_c处理
      //1.有{{}}  普通文本   混合文本 {{name}}  aaa {{age}} bbb
      var text = node.text;
      if (defaultTagRE.test(text)) {
        //_v(_s(name)+_v('aa')
        //说明是带有{{}}
        var tokens = [];
        var match;
        var index = 0;
        var lastIndex = defaultTagRE.lastIndex = 0;
        while (match = defaultTagRE.exec(text)) {
          //{{name}}  aaa {{age}} bbb
          index = match.index;
          console.log(match);
          if (index > lastIndex) {
            tokens.push(JSON.stringify(text.slice(lastIndex, index)));
          }
          tokens.push("_s(".concat(match[1].trim(), ")"));
          lastIndex = index + match[0].length;
        }
        if (lastIndex < text.length) {
          tokens.push(JSON.stringify(text.slice(lastIndex)));
        }
        return "_v(".concat(tokens.join('+'), ")");
      } else {
        return "_v(".concat(JSON.stringify(text), ")");
      }
    }
  }
  function generate(AST) {
    //转换成render代码
    console.log(AST);
    var children = genChildren(AST);
    var code = "_c('".concat(AST.tag, "',").concat(AST.attrs.length ? genProps(AST.attrs) : 'undefined').concat(children ? ',' + children : '', ")");
    console.log(code);
    return code;
    //进行语法转化  将html代码转化js代码  核心 字符串拼接
  }

  /* <div id="app">
      <div style="color:blue">
              <span>{{name}}</span>
      </div>
  </div> 
  变成render函数  reder函数执行后的结果是个虚拟dom

  render(){ 
      return _c('div',{id:'app'}，
      _c(
          'div',
          {style:{color:"blue"}},
          _c(
              'span',
              {}
              _s(_v"name")
          )
      )
  }

  */

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; //匹配类标签名的  里面的\\相当于转译 变成一个\
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); //aa:aa
  var startTagOpen = new RegExp("^<".concat(qnameCapture)); //可以匹配到标签名

  //console.log("<div:aa>".match(startTagOpen));

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); //标签结束名字
  //console.log("</div:xxx>".match(endTag));
  //style="xxx"  style='xxx'  style=xxx
  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  //console.log(`a='2'`.match(attribute));

  var startTagClose = /^\s*(\/?)>/;

  /* <div id="app">
    <div style="color:blue ;">
      <span>{{name}}</span>
    </div>
  </div>
  */

  //AST语法树  描述dom结构
  // {
  //     tag:'div',//根节点
  //     type:1, 元素是1  文本是3  约定俗成
  //     attrs:[{style:"color:red"}]
  //     children:[
  //         {
  //             tag:'span',
  //             type:1,
  //             attrs:[],//属性
  //             children,
  //             parent:
  //         }
  //     ],
  //     parent:null
  // }

  /* <div id="app">
         <div style="color:blue ;">
              <span>{{name}}</span>
         </div>
     </div>
   */

  function parseHTML(html) {
    function createASTElement(tag, attrs) {
      //vue3中支持多个根元素(外层加了个空元素)，vue2中只有一个根节点
      return {
        tag: tag,
        type: 1,
        children: [],
        attrs: attrs,
        parent: null
      };
    }
    var root = null;
    var currentParent;
    var stack = [];

    //根据开始标签  结束标签  文本内容  生成一个AST语法树
    function start(tagName, attrs) {
      //console.log('start------',tagName)
      var element = createASTElement(tagName, attrs);
      if (!root) {
        //如果没有根  说明就是第一个元素
        root = element;
      }
      currentParent = element; //div->span->a   
      stack.push(element);
    }
    function end(tagName) {
      //console.log('end------',tagName)
      var element = stack.pop();
      currentParent = stack[stack.length - 1];
      if (currentParent) {
        element.parent = currentParent;
        currentParent.children.push(element);
      }
    }
    function chars(text) {
      //console.log('chars------',text)

      //文本可能为空   源码里会将其变成一个空格   此处是移除所有空格  
      text = text.replace(/\s/g, '');
      if (text) {
        currentParent.children.push({
          type: 3,
          text: text
        });
      }
    }

    //截取
    function advance(n) {
      html = html.substring(n);
    }
    function parseStartTag() {
      var start = html.match(startTagOpen);
      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length); //获取元素
        console.log(html, match);
        //查找属性
        var _end, attr;
        //不是开头标签结尾 就一直解析
        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          console.log(attr);
          advance(attr[0].length);
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
        }
        if (_end) {
          advance(_end[0].length);
          return match;
        }
      }
    }
    //标签是以<>开头

    while (html) {
      var textEnd = html.indexOf('<'); //判断 如果<的索引是0,就说明是一个元素 
      if (textEnd == 0) {
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          //开始标签
          // console.log(startTagMatch)
          // console.log('开始',startTagMatch.tagName)
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }

        //结束标签
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          advance(endTagMatch[0].length);
          //console.log('结尾',endTagMatch[1])
          end(endTagMatch[1]);
          continue;
        }
      }
      /* 
           <div style="color:blue ;">
              <span>{{name}}</span>
         </div>
      </div>
      */
      var text = void 0;
      if (textEnd > 0) {
        //开始解析文本
        text = html.substring(0, textEnd);
      }
      if (text) {
        advance(text.length);
        //console.log('文本',text)
        chars(text);

        //console.log(text);
      }
    }

    return root;
  }

  function compileToFunctions(template) {
    //1.先将模板变成AST抽象树  解析模板
    var AST = parseHTML(template); //解析模板  原理是 每解析一块儿  就删掉一块 长度为0时  就意味着都解析完了
    console.log(template);
    // console.log(root);

    //root  代码生成

    var code = generate(AST);
    var render = "with(this){return ".concat(code, "}");
    console.log(render);
    var fn = new Function(render);
    console.log(fn);
    return fn;
  }

  function patch(oldVnode, Vnode) {
    //oldVnode是一个真实额元素 (首次渲染)
    //console.log(oldVnode, newVnode)
    var isRealElement = oldVnode.nodeType;
    if (isRealElement) {
      //初次渲染
      var oldElm = oldVnode; //拿到 id="app"
      var parentElm = oldElm.parentNode; //拿到父元素 body

      var el = createElm(Vnode); //根据虚拟节点 创建出真实节点
      parentElm.insertBefore(el, oldElm.nextSibling); //将创建的节点插到原有的节点的下一个
      parentElm.removeChild(oldElm);
      return el; //vm.$el
    }
  }

  //根据虚拟节点 创建出真实节点
  function createElm(vnode) {
    var vm = vnode.vm,
      tag = vnode.tag,
      data = vnode.data,
      key = vnode.key,
      children = vnode.children,
      text = vnode.text;
    if (typeof tag === 'string') {
      //也可能是个组件 先不考虑
      vnode.el = document.createElement(tag); //用vue的指令时，可以用过vnode拿到真实的dom  虚拟节点配合真实dom
      //更新dom上的属性
      updateProperties(vnode);

      //有可能有儿子
      children.forEach(function (child) {
        //可能有文本  可能有元素
        //根据子节点 创建元素
        vnode.el.appendChild(createElm(child)); //递归创建
      });
    } else {
      //文本情况
      vnode.el = document.createTextNode(text);
    }
    return vnode.el;
  }
  function updateProperties(vnode) {
    var newProps = vnode.data || {}; //属性
    var el = vnode.el; //dom元素

    for (var key in newProps) {
      if (key == 'style') {
        for (var styleName in newProps.style) {
          el.style[styleName] = newProps.style[styleName];
        }
      } else if (key == 'class') {
        el.className = newProps["class"];
      } else {
        el.setAttribute(key, newProps[key]);
      }
    }
  }

  //我们可以把当前watcher 放到一个全局变量上
  var id = 0; //为了保持dep的唯一性
  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);
      this.id = id++;
      this.subs = []; //属性要记住watcher
    }
    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        //让watcher记住dep
        //获取watcher
        Dep.target.addDep(this); //这里的this指的是Dep  name=>watcher  
      }
      //让dep记住watcher  
    }, {
      key: "addSub",
      value: function addSub(watcher) {
        //存储watcher
        this.subs.push(watcher);
      }
    }]);
    return Dep;
  }();
  Dep.target = null; //类的静态属性
  function pushTarget(watcher) {
    Dep.watcher = watcher;
  }
  function popTarget() {
    Dep.target = null;
  }

  //每个组件间有多个watcher  所以需要加一个唯一标识  
  var id$1 = 0;
  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, exprOrFn, cb, options) {
      _classCallCheck(this, Watcher);
      this.vm = vm;
      this.cb = cb;
      this.options = options;
      this.id = id$1++;
      this.getter = exprOrFn;
      this.drps = [];
      this.depsId = new Set(); //去重  

      this.get(); //调用传入的函数 调用了render方法  此时会对模板中的数据进行取值
    }
    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        //这个方法中会对属性进行取值操作
        pushTarget(this); //给Dep.target赋了值 =watcher
        this.getter(); //会取值  执行了observer中index.js中的54行 
        popTarget(); //Dep.target = null;
      }
    }, {
      key: "addDep",
      value: function addDep(dep) {
        var id = dep.id;
        if (!this.depsId.has(id)) {
          //dep是非重复的
          this.depsId.add(id);
          this.deps.push(dep);
          dep.addSub(this);
        }
      }
      //当属性取值时  需要记住这个watcher，稍后变化了  去执行自己记住的watcher即可
      //依赖收集
    }]);
    return Watcher;
  }();

  //渲染成真实DOM的
  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      // console.log('update', vnode);
      //将虚拟节点转换成真实dom
      var vm = this;

      //首次渲染 需要用虚拟节点 来更新真实的dom元素
      //初始化渲染的时候 会创建一个新节点 并且将老节点删掉
      //第一次渲染完毕后 拿到新的节点 下次再次渲染时替换上次渲染的结果
      vm.$options.el = patch(vm.$options.el, vnode);
    };
  }
  function mountComponent(vm, el) {
    console.log(vm, el);

    //Vue渲染机制
    //Vue默认通过watcher来进行渲染的 = 渲染watcher(每一个组件都有一个渲染watcher)

    var updateComponent = function updateComponent() {
      //调用runder方法
      vm._update(vm._render()); //返回的是虚拟节点   是一个对象 vm._update是将虚拟节点转化为真实节点
    };
    //让实例的某某方法执行  四个参数   后面加true是为了表明 该watcher是一个渲染watcher
    new Watcher(vm, updateComponent, function () {}, true); //这句话就是相当于让 updateComponent 执行 updateComponent();
  }

  //首先  我需要拿到原来数组原型上的方法  天生自带的方法
  var oldArrayProtoMethods = Array.prototype;

  //不能直接改写数组原有方法  不可靠  因为只有在vue data中定义的数组才需要改写

  //创建一个元素  让他指向原型   继承关系
  var arrayMethods = Object.create(Array.prototype);

  //因为他指向数组原型链 所以 就可以拿到原型链上的方法
  //arrayMethods.push===arrayMethods._proto_.push

  //对数组方法进行重写  一般对改变原数组的操作进行重写

  var methods = ["push", "pop", "shift", "unshift", "splice", "reverse", "sort"];
  //如果用户调用arrayMethods.push方法，会调取我重写后的 也就是下面这一坨

  methods.forEach(function (methods) {
    //AOP切片编程   把原有的逻辑 割一刀 插入自己的逻辑
    arrayMethods[methods] = function () {
      var _oldArrayProtoMethods;
      //重写数组方法
      //做些自己的事儿 
      console.log('数组变化');
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      var result = (_oldArrayProtoMethods = oldArrayProtoMethods[methods]).call.apply(_oldArrayProtoMethods, [this].concat(args)); //这里的this指向arrayMethods

      //有可能用户后增加的数据是对象格式，也需要进项拦截
      //做个判断  只对数组增加的方法进行判断
      var inserted;
      var ob = this.__ob__;
      switch (methods) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;
        case 'splice':
          //splice(0,1,xxxx) 
          //因为splice方法第三个才是新增的   
          inserted = args.slice(2);
      }
      if (inserted) {
        //如果有值 都需要调observeArray()  这里的this指向调用者 this.__ob__.observeArray(inserted) 
        ob.observeArray(inserted);
      }
      return result;
    };
  });

  //对数组和对象进行拦截
  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);
      //需要对val属性重新定义

      //value可能是对象 可能是数组，分类处理    数组不用defineProperty拦截

      //增加一个自定义属性
      //value.__ob__=this;
      Object.defineProperty(value, "__ob__", {
        value: this,
        enumerable: false,
        //不能被枚举 表示  不能被循环
        configurable: false //不能删除此属性
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
    _createClass(Observer, [{
      key: "observeArray",
      value: function observeArray(value) {
        //拿到数组每一项
        for (var i = 0; i < value.length; i++) {
          observe(value[i]);
        }
      }
      //监测对象变化，类方便拓展 可直接在下面写方法 无需拆分 还是一个整体
    }, {
      key: "walk",
      value: function walk(data) {
        //将对象中所有的key 重新用defineProperty定义成响应式数据
        Object.keys(data).forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }]);
    return Observer;
  }();
  function defineReactive(data, key, value) {
    //vue2中数据嵌套不要过深，过深浪费性能

    //value的值可能是个对象
    observe(value); //对结果进行递归拦截

    //defineProperty是重写了get，set方法，而proxy是设置一个代理  不用改写原对象
    var dep = new Dep(); //观察者模式  每次都会给属性创建个dep
    Object.defineProperty(data, key, {
      //需要给每个属性都增加个dep
      get: function get() {
        if (Dep.target) {
          dep.depend(); //让这个属性自己的dep记住这个watcher  也会让watcher记住这个dep   一个双向的过程
        }

        console.log(key);
        return value;
      },
      set: function set(newValue) {
        if (newValue === value) return;
        observe(value); //如果用户设置的是一个对象，就继续将用户设置的对象变为响应式的
        value = newValue;
      }
    });
  }
  function observe(data) {
    //console.log(data, "----------");
    //只对对象类型进行观测，非对象类型无法观测
    if (_typeof(data) !== "object" || data == null) {
      return;
    }
    if (data.__obj__) {
      //入果有__obj__就说明该属性被观测过了  就直接返回  防止循环引用
      return;
    }

    //通过类来实现对数据的观测   类可以方便扩展  会产生实例  实例可作为唯一标识
    return new Observer(data);
  }

  //vue的数据   data props computed  watch...
  function initState(vm) {
    //将所有数据都定义在vm属性上，并且后续更改需要触发视图更新
    //拿到用户定义的参数 如data methods等
    var opts = vm.$options; //获取用户属性

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
      get: function get() {
        return vm[source][key];
      },
      set: function set(newValue) {
        vm[source][key] = newValue;
      }
    });
  }

  //一层套一层  粒度会越来越小
  function initData(vm) {
    //console.log(vm);
    //进行数据劫持  Object.defineProperty
    //拿到用户传来的数据
    var data = vm.$options.data; //拿到的data有两种情况  一种是对象，一种是函数
    //对data类型进行判断  如果是函数  获取函数返回值作为对象
    //用call是为了保证date中如果写了this  保证this永远指向当前的实例
    data = vm._data = typeof data === "function" ? data.call(vm) : data;

    //通过vm._data获取劫持后的数据，用户就可以拿到_data

    //data = vm._data = typeof data === "functions" ? data.call(vm) : data;这样很麻烦   所以就需要代理

    //将_data中的数据全部放到vm上
    for (var key in data) {
      proxy(vm, '_data', key); //如果用户使用  vm.name 等价于 vm._data.name
    }

    //观测这个数据    Vue响应式的核心方法
    observe(data);
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      //console.log(options);
      var vm = this;
      vm.$options = options; //在实例上有个属性$options 表示的是用户传入的所有属性

      //初始化状态   可能初始化很多东西 逻辑很多  一个功能写一个方法
      initState(vm);
      if (vm.$options.el) {
        //说明数据可以挂载到页面上
        vm.$mount(vm.$options.el);
      }
    };
    Vue.prototype.$mount = function (el) {
      el = document.querySelector(el);
      var vm = this;
      var options = vm.$options;
      vm.$options.el = el; //id="app"
      //如果有render直接使用render即可，没有render看有没有template属性，没有template就接着找外部模板
      if (!options.render) {
        var template = options.template;
        if (!template && el) {
          template = el.outerHTML; //火狐不兼容 document.createElement('div').appendChild('app').innerHTML
        }

        console.log(template);

        //如何将模板编译成render函数
        var render = compileToFunctions(template); //将模板编译成一个函数
        options.render = render;
      }
      mountComponent(vm, el); //组件挂载  
    };

    //   Vue.prototype.$mount = function (el){
    //     el =document.querySelector(el);
    //     const vm =this;
    //     const options = vm.$options
    // //如果有render直接使用render即可，没有render看有没有template属性，没有template就接着找外部模板
    //     if(!options.render){
    //       let template = options.template;
    //       if(!template && el){
    //         template = el.outHTML
    //       }
    //       console.log(template)
    //     }
    //   }
  }
  //vue的数据   data props computed  watch...
  // export function initState(vm) {
  //   //将所有数据都定义在vm属性上，并且后续更改需要触发视图更新
  //   //拿到用户定义的参数 如data methods等
  //   const opts = vm.$options; //获取用户属性

  //     if (opts.props) {

  //     }
  //     if (opts.methods) {

  //     }
  //     if (opts.data) {//数据的初始化

  //     }
  //     if (opts.computed) {

  //     }
  //     if (opts.watch) {

  //     }

  //   if (opts.data) {//数据的初始化
  //     initState(vm);
  //   }
  // }

  // //一层套一层  粒度会越来越小
  // function initData(vm) {

  // }

  //导出 创建元素虚拟节点
  function createElement(vm, tag) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }
    return vnode(vm, tag, data, data.key, children, undefined);
  }
  //导出创建文本虚拟节点
  function createTextVnode(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text);
  }

  //vue底层用的是个类 这里用个方法
  function vnode(vm, tag, data, key, children, text) {
    return {
      vm: vm,
      tag: tag,
      children: children,
      data: data,
      key: key,
      text: text
    };
  }
  //vnode(虚拟DOM)和AST(抽象树)  vnode 可以随意添加属性  AST是针对语法解析出来的结构不能添加不存在的属性

  function renderMixin(Vue) {
    //创建元素的虚拟节点
    Vue.prototype._c = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return createElement.apply(void 0, [this].concat(args)); //可以多传参数
    };
    //创建文本的虚拟节点
    Vue.prototype._v = function (text) {
      return createTextVnode(this, text);
    };
    //转化成字符串
    Vue.prototype._s = function (val) {
      return val == null ? '' : _typeof(val) == 'object' ? JSON.stringify(val) : val;
    };

    //调用自定义render方法
    Vue.prototype._render = function () {
      //render
      //console.log('render')
      var vm = this;
      var render = vm.$options.render; //获取编译后额render方法
      //调用render方法 产生虚拟节点 让render执行
      //render中有很多自定义的方法  如_c  _v  所以 会报错 
      var vnode = render.call(vm); //_c(xxx，xxx)  调用时会自动将变量进行取值，将实例结果进行渲染

      return vnode; //虚拟节点
    };
  }

  //Vue2.0中就是一个构造函数 如果用class(类)的话  

  // class Vue{
  //     a(){}
  //     b(){}
  //     c(){}
  // }

  //构造函数
  function Vue(options) {
    console.log(options);
    this._init(options); //当用户new Vue时就调用init方法进行vue的初始化方法
  }

  //Vue初始化  扩展原型方法
  //可以拆分逻辑到不同的文件中 更利于代码维护  模块化的概念

  initMixin(Vue); //初始化混合

  // Vue.prototype._init = function (options) {

  // };
  lifecycleMixin(Vue); //更新逻辑   扩展_update方法
  renderMixin(Vue); //调用render方法的逻辑 扩展_render方法

  //库->rollup   项目开发->webpack

  return Vue;

})));
//# sourceMappingURL=vue.js.map
