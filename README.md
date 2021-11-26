# vue-component-tips README 有兴趣一起玩的请联系

1. ### 如果不能安装请更新vscode

```
"engines": {
    "vscode": "^1.59.0"
},

```

2. ### 使用前先看
   1. 用于快捷提示vue组建,当前如果你是ts可以使用官方的更好.
   2. 安装之后,先配置你的项目名称,跟你当前的根目录相同,还没有支持多项目
   3. 参考下面的配置设置你的组件路径,也可以是node_modules,中的文件

<br/>

---
<br/>

3. ### 设置目录
   1. 设置项目目录(vscode右下角设置里的设置选择扩展)
   2. 修改你的目录名称(不用重启vscode)修改完保存即可

<br/>

---
<br/>

4. ### 如果你的工作区有多个需要提示(暂不支持)

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

6. 枚举提示 (在使用这个组件提示color属性时会触发枚举提示,混合了','符号将不会提示枚举,只提示default)

``` js

props:{
    //@enum 'blue'|'black'|'pink'
    color:{
        type:String,
        default:"red"
    }
}


```