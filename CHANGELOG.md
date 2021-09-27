<!--
 * @Author: your name
 * @Date: 2021-09-20 04:13:40
 * @LastEditTime: 2021-09-27 16:57:54
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \testd:\correlationComponents\tesc\CHANGELOG.md
-->
# 0.6 版本

    1. 添加文件新建删除的及时生成提示

# 0.7 版本(修复Bug)

    1. 添加修改配置文件时释放监听Watcher

# 0.8 版本

    1. 添加了回车直接显示html(change Case Kebab)格式

# 0.9 版本

    1. 添加注册文件定位更好的定位。


# 1.0 版本

    1. 添加只在template中显示提示


# 1.1 版本

    1. 添加更好的组件范围提示。
    2. 添加组件的props提示 在标签属性上输入:激活当前的标签的属性提示

# 1.2 版本

    1. 添加更好的组件范围提示。
    2. 添加组件的props选择提示
>   tips
>   默认显示default 和 注释的枚举
>   1. 情况1
>   default 和 枚举同时存在的情况下,会判断 default 中有没有包含 ','符号
>   如果存在则不显示多选提示直接填充default
>   当然default不包含',' 那么就会联合枚举一起提示 (会把枚举里包含','符号的给剔除)
>   2. 情况2
>   选择选项之后然后在把选项删除,现在是没有触发重新选择的
>   需要把这表props删掉重新输入
>   3. (情况2举例)
>   :color = ['#red','#blue']; color有两个选择
>   选择了#blue 然后又想重新选择#red
>   是不会重新触发的,需要把 :color = 删除,然后重新键入
>   :co... 再次触发属性提示 >> 然后在触发props的枚举提示

# 1.3 版本

    1. 开放了配置在设置->>扩展->>uniapp扫描提示组件中修改配置

# 之后版本介绍更新介绍

    1. 添加虚拟文件,优化插件。
    2. 修改为Lsp语言服务器架构获得更好的性能。