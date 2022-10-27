import serve from "rollup-plugin-serve";
import babel from "rollup-plugin-babel";


export default {//用于打包的配置
    input:'./src/index.js',
    output:{
        file: 'dist/vue.js',//用来设置代码最终打包生成的文件，此处是在项目根目录下创建一个dist文件夹，将代码打包至dist下面的vue.js文件。
        name: 'Vue',//全局的名字就是vue  相当于给打包后的模块起一个名字，在全局上添加一个Vue，作为全局实例来使用。
        format: 'umd',//模块格式  umd 统一模块规范   window.Vue  设置打包格式，也就是代码构建后的输出格式。
        sourcemap:true//es6->es5
    },
    plugins:[
        babel({
            exclude:"node_modules/**",//表示node_modules目录下所有的文件都忽略掉 这个目录不需要用babel转化
            
        }),
        serve({
            open: true,//自动打开浏览器
            openPage:"/public/index.html",//默认打开的页面
            port:3000,//服务端口
            contentBase:''//从哪个内容文件里启动  ''写就是以openPage来启动   以当前根目录为基准  不写报错
        })
    ]
}