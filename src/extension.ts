import * as  vscode from 'vscode';
import VueCompoentsPathProvider from './provider/VueCompoentsPathProvider';
import VueCompoentsProvider from './provider/VueCompoentsProvider';
import { compoentsMap } from './provider/compoentsMap';
import { getComponents } from './util/handleFile';

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
