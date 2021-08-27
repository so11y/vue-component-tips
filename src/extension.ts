import * as  vscode from 'vscode';
import { glob } from "glob";
import { isUndefined } from './util/types';
import VueCompoentsPathProvider from './provider/VueCompoentsPathProvider';
import VueCompoentsProvider from './provider/VueCompoentsProvider';
import { compoentsMap } from './provider/compoentsMap';

const  filsConfig = {
    "c-":""
};


/**
 *
 * @example 获取匹配的文件
 */
function getComponents(workspaceFolder: readonly vscode.WorkspaceFolder[] | undefined) {
    const projectFileName = vscode.workspace.getConfiguration().get('zrrz.projectName');
    if (!isUndefined(workspaceFolder)) {
        const rootUniApp = workspaceFolder.filter(v => v.name === (projectFileName as string || "saas"));

        if (rootUniApp.length) {
            rootUniApp.forEach(async (folder) => {
                // const uniAppPath = vscode.Uri.file(path.join(folder.uri.fsPath, "src/pages.json"));
                // const uniAppPageJsonFile = await vscode.workspace.fs.readFile(uniAppPath);
                // try{

                //     const uniAppPageJson = JSON.parse(uniAppPageJsonFile.toString()).easycom.custom;
                //     for (let [key, value] of Object.entries(uniAppPageJson)) {
                //         const fils = glob.sync(String(value).replaceAll("$", "").replace("@", path.join((folder.uri.fsPath, "/src"))));

                //         console.log(fils);
                //     }
                // }catch(e){
                //     console.log(e);
                // }
                const path = folder.uri.fsPath + "/**/*.vue";
                const vueFiles = glob.sync(path);
                vueFiles.forEach((filsPath) => {
                    compoentsMap.set(
                        filsPath.slice(filsPath.lastIndexOf("/") + 1,
                            filsPath.lastIndexOf(".")
                        ),
                        filsPath);
                });


            });
            vscode.window.showInformationMessage(`${projectFileName}共生成提示组件共${compoentsMap.size}个`);
        } else {
            vscode.window.showInformationMessage(`当前工作区没有找到可以匹配的${projectFileName}项目`);
        }
    }
}


export function activate(context: vscode.ExtensionContext) {
    getComponents(vscode.workspace.workspaceFolders);

    /**
     * 监听配置文件的修改
     */
    vscode.workspace.onDidChangeConfiguration(() => {
        getComponents(vscode.workspace.workspaceFolders);
        vscode.window.showInformationMessage(`已重新生成完毕。`);
    });
    /**
     * 注册语法提示
     */
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider('vue', new VueCompoentsProvider(compoentsMap))
    );

    /**
     * 注册文件定位
     */
    context.subscriptions.push(vscode.languages.registerDefinitionProvider(
        'vue',
        new VueCompoentsPathProvider(compoentsMap)
    ));
}

export function deactivate() { }
