import * as  vscode from 'vscode';
import VueCompoentsPathProvider from './provider/VueCompoentsPathProvider';
import VueCompoentsProvider from './provider/VueCompoentsProvider';
import VuePropsProvider from "./provider/VuePropsProvider";
import { getComponents } from './util/handleFile';
import { vscodeStoreKey } from './util/const';
import { clearStore } from './util/handelFileUtil';



async function init(context: vscode.ExtensionContext): Promise<vscode.FileSystemWatcher[]> {
    // is dev environment
    if (!context.workspaceState.get(vscodeStoreKey)) {

        context.workspaceState.update(vscodeStoreKey, {});

        return await getComponents(vscode.workspace.workspaceFolders, context);
    }
    return [];
}


async function main(context: vscode.ExtensionContext) {

    if (vscode.workspace.workspaceFolders?.length) {

        const watchFiles: vscode.FileSystemWatcher[] = [];

        watchFiles.push(...await init(context));

        /**
         * 监听配置文件的修改
         */
        vscode.workspace.onDidChangeConfiguration(async () => {

            clearStore(context);

            while (watchFiles.length) {
                watchFiles.shift()?.dispose();
            }

            watchFiles.push(...await getComponents(vscode.workspace.workspaceFolders, context));

            vscode.window.showInformationMessage(`已重新生成完毕。`);
        });
    }
}


export function activate(context: vscode.ExtensionContext) {


    main(context);

    /**
     * 注册语法提示
     */
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider('vue', new VueCompoentsProvider(context))
    );

    /**
     * 注册文件定位
     */
    context.subscriptions.push(vscode.languages.registerDefinitionProvider(
        'vue',
        new VueCompoentsPathProvider(context)
    ));

    /**
      * 注册VueProps提示
      */
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
        'vue',
        new VuePropsProvider(context),
        ":"
    ));
}

export function deactivate() { }
