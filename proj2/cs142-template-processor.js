"use strict";

//用class会导致错误：Cs142TemplateProcessor is not a constructor
function Cs142TemplateProcessor (template) {
    this.template = template;
}

Cs142TemplateProcessor.prototype.fillIn = function (dictionary) {
    let res = this.template;

    //此部分语法参见正则表达式
    //量词？启用惰性模式
    const matchResult = res.match(/{{.*?}}/g);
    for (let i = 0; i < matchResult.length; i++) {
        const reg = new RegExp(matchResult[i]);
        const content = matchResult[i].slice(2, -2);

        const replacer =  content in dictionary ? dictionary[content] : '';  
        res = res.replace(reg, replacer);
    }

    return res;
};