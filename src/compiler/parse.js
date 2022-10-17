const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; //匹配类标签名的  里面的\\相当于转译 变成一个\
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; //aa:aa
const startTagOpen = new RegExp(`^<${qnameCapture}`); //可以匹配到标签名

//console.log("<div:aa>".match(startTagOpen));

const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); //标签结束名字
//console.log("</div:xxx>".match(endTag));
//style="xxx"  style='xxx'  style=xxx
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
//console.log(`a='2'`.match(attribute));

const startTagClose = /^\s*(\/?)>/;
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; //{{}}


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

export function parseHTML(html) {
    function createASTElement(tag,attrs){//vue3中支持多个根元素(外层加了个空元素)，vue2中只有一个根节点
        return{
          tag,
          type:1,
          children:[],
          attrs,
          parent:null
        }
      }
      
      let root =null;
      let currentParent;
      let stack=[];


  //根据开始标签  结束标签  文本内容  生成一个AST语法树
    function start(tagName,attrs){
      //console.log('start------',tagName)
      let element =createASTElement(tagName,attrs)
      if(!root){//如果没有根  说明就是第一个元素
          root = element
      }
      currentParent = element;//div->span->a   
      stack.push(element)

    }

    function end(tagName){
      //console.log('end------',tagName)
      let element=stack.pop()
      currentParent=stack[stack.length-1]
      if(currentParent){
        element.parent=currentParent;
        currentParent.children.push(element)
      }
    }
    function chars(text){
      //console.log('chars------',text)

      //文本可能为空   源码里会将其变成一个空格   此处是移除所有空格  
      text = text.replace(/\s/g,'');
      if(text){
        currentParent.children.push({
          type:3,
          text
        })
      }

    }

    //截取
    function advance(n){
        html = html.substring(n)
    }

    function parseStartTag(){
    const start = html.match(startTagOpen)
    if(start){
        let match ={
            tagName:start[1],
            attrs:[],
        }
        advance(start[0].length);//获取元素
       console.log(html,match)
       //查找属性
       let end,attr;
       //不是开头标签结尾 就一直解析
       while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))){
            console.log(attr)
            advance(attr[0].length)
            match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] })
       }
       if(end){
        advance(end[0].length);
        return match
       }
    }
    }
  //标签是以<>开头

  while (html) {
    let textEnd = html.indexOf('<');//判断 如果<的索引是0,就说明是一个元素 
    if(textEnd == 0 ){
       let startTagMatch = parseStartTag();
       if(startTagMatch){//开始标签
        // console.log(startTagMatch)
        // console.log('开始',startTagMatch.tagName)
        start(startTagMatch.tagName,startTagMatch.attrs)
        continue;
       }

       //结束标签
       let endTagMatch = html.match(endTag)
       if(endTagMatch){
        advance(endTagMatch[0].length)
      //console.log('结尾',endTagMatch[1])
       end(endTagMatch[1])

        continue;
       }
       
    }
     /* 

        <div style="color:blue ;">
             <span>{{name}}</span>
        </div>
    </div>
  */
    let text;
    if(textEnd > 0){//开始解析文本
      text =html.substring(0,textEnd)

    }
    if(text){
      advance(text.length);
      //console.log('文本',text)
      chars(text)

      //console.log(text);

    }

  }
  return root;
}
