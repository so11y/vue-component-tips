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


export const filsPathConfig: IFileConfig = {
    "/src/common/components/**/*.vue": {
        alias: "",
        sub: false,
        handleFile: handleFile //不需要而外处理的用这个方法
    }, //全局组件
    "/src/components/**/*.vue": {
        alias: "gc-",
        sub: false,
        handleFile: handleFile //不需要而外处理的用这个方法
    },
    "/src/*(goods|guest|home|live|shop|single-page|user)/components/**/*.vue": {
        alias: "sub-",
        sub: true,
        handleFile: handleFile //不需要而外处理的用这个方法
    }
};

```
