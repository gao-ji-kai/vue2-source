const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; //{{}}

function genProps(attrs){
    let str=''
    for(let i=0; i<attrs.length; i++){
        let attr =attrs[i] //name value
        if(attr.name==='style'){
            let obj={}
            attr.value.split(';').forEach(item => {
             let [key,value]  = item.split(':');
             obj[key]=value
            });
            attr.value=obj;//{style:{color:blue}}
        }
        str +=`${attr.name}:${JSON.stringify(attr.value)},`//{a:'aaa',a:1,b:2}
    }
    return` {${str.slice(0,-1)}}`
}


function genChildren(AST){
    const children = AST.children;
    if(children){
        return children.map(child=>gen(child)).join(',')
    }
}

function gen(node){//区分是元素还是文本
    console.log(node)

    if(node.type==1){
        return generate(node)
    }else{//文本逻辑不能用_c处理
            //1.有{{}}  普通文本   混合文本 {{name}}  aaa {{age}} bbb
        let text=node.text;
        if(defaultTagRE.test(text)){//_v(_s(name)+_v('aa')
            //说明是带有{{}}
            let tokens =[];
            let match;
            let index=0;
            let lastIndex=defaultTagRE.lastIndex =0;
            while (match = defaultTagRE.exec(text)) {//{{name}}  aaa {{age}} bbb
                index=match.index;
                console.log(match)
                if(index > lastIndex){
                    tokens.push(JSON.stringify(text.slice(lastIndex,index)));
                }
                tokens.push(`_s(${match[1].trim()})`);
                lastIndex=index + match[0].length;
            }
            if(lastIndex < text.length){
                tokens.push(JSON.stringify(text.slice(lastIndex)));

            }
            return `_v(${tokens.join('+')})`

        }else{
            return `_v(${JSON.stringify(text)})`
        }
    }
}

export function generate(AST){//转换成render代码
    console.log(AST)

    let children = genChildren(AST)

    let code =`_c('${AST.tag}',${
        AST.attrs.length? genProps(AST.attrs):'undefined'
    }${
        children?(',' + children) : ''
    })`
    console.log(code)

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