import { generate } from "./generate";
import { parseHTML } from "./parse";

export function compileToFunctions(template) {
  //1.先将模板变成AST抽象树  解析模板
  let AST = parseHTML(template); //解析模板  原理是 每解析一块儿  就删掉一块 长度为0时  就意味着都解析完了
  console.log(template);
  // console.log(root);

  //root  代码生成

  let code = generate(AST);

  let render = `with(this){return ${code}}`;
  console.log(render)
  let fn = new Function(render);
  console.log(fn)
  return fn


}
