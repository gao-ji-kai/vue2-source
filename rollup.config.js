import serve from "rollup-plugin-serve";
import babel from "rollup-plugin-babel";


export default {//用于打包的配置
    input:'./src/index.js',
    output:{
        file:'dist/vue.js',
        name:'Vue',//全局的名字就是vue
        format:'umd',//模块格式  umd 统一模块规范   window.Vue
        sourcemap:true//es6->es5
    },
    plugins:[
        babel({
            exclude:"node_modules/**",//表示node_modules目录下所有的文件都忽略掉 这个目录不需要用babel转化
            
        }),
        serve({
            open:true,
            openPage:"/public/index.html",//默认打开的页面
            port:3000,//服务端口
            contentBase:''//从哪个内容文件里启动  ''写就是以openPage来启动   以当前根目录为基准  不写报错
        })
    ]
}