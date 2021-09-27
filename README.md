<!--
 * @Author: your name
 * @Date: 2021-08-28 18:12:20
 * @LastEditTime: 2021-09-27 16:56:13
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \testd:\correlationComponents\tesc\README.md
-->
# uniSass README

1. ### 如果不能安装请更新vscode

```
"engines": {
    "vscode": "^1.59.0"
},

```

2. ### 使用前先看
   1. 由于page.json解析失败 转为硬编码实现
   2. 目前saas各个组件基本都有提示

<br/>

---
<br/>

3. ### 设置saas目录
   1. 如果你的项目名称就是saas可以跳过
   2. 设置项目目录(vscode右下角设置里的设置选择扩展)
   3. 修改你的目录名称(不用重启vscode)修改完保存即可

<br/>

---
<br/>

4. ### 如果你的工作区有多个需要提示的saas(暂不支持)

<br/>

---

5. ### 建议vscode打开saas项目
   1. 会被其他插件的提示干扰,将会出现蛮多别的提示.
   2. 如果无所谓或者没有这个问题,请随意。

``` typescript

1. 以下是匹配规则 用于参考

const fileFactorys: Array<FilesConfigFactory> = [
    new FilesConfigFactory({
        path: "/src/common/components/**/*.vue",//扫描的路径
        alias: "",
        sub: false //是否是属于模块组件false
    }),
    new FilesConfigFactory({
        path: "/src/components/**/*.vue",
        alias: "gc-",//组件前缀  components/todo.vue  --> <gc-todo></gc-todo>
        sub: false
    }),
    new FilesConfigFactory({
        path: "/src/*(goods|guest|home|live|shop|single-page|user)/components/**/*.vue",
        alias: "sub-",
        sub: true,
    })
];

```
