import * as  vscode from 'vscode';
import { glob } from "glob";
import { isUndefined } from './types';
import { FileConfig, handleFile, jointFile, removeStore, setStore } from './handelFileUtil';
import { vscodeStoreKey } from './const';

class FilesConfigFactory {
    constructor(public config: FileConfig) {
    }
    handleFile(filePath: string, scopeConfig: FileConfig) {
        return handleFile(filePath, scopeConfig);
    }
}

const fileFactorys: Array<FilesConfigFactory> = [
    new FilesConfigFactory({
        path: "/src/common/components/**/*.vue",
        alias: "",
        sub: false
    }),
    new FilesConfigFactory({
        path: "/src/components/**/*.vue",
        alias: "gc-",
        sub: false
    }),
    new FilesConfigFactory({
        path: "/src/*(goods|guest|home|live|shop|single-page|user)/components/**/*.vue",
        alias: "sub-",
        sub: true,
    })
];

/**
 *
 * @example 获取匹配的文件
 */
export async function getComponents(workspaceFolder: readonly vscode.WorkspaceFolder[] | undefined, context: vscode.ExtensionContext) {
    const projectFileName = vscode.workspace.getConfiguration().get('zrrz.projectName');

    const watchFiles: Array<vscode.FileSystemWatcher> = [];

    if (!isUndefined(workspaceFolder)) {
        const rootUniApp = workspaceFolder.filter(v => v.name === (projectFileName as string || "saas"));
        if (rootUniApp.length) {
            await new Promise<void>(r => {

                //工作区
                rootUniApp.forEach(async (folder, index) => {

                    //文件匹配多种规则
                    for (const fileConfigItem of fileFactorys) {
                        const scopePath = folder.uri.fsPath + fileConfigItem.config.path;
                        const vueFiles = await Promise.resolve().then(() => glob.sync(scopePath));

                        //解析出的每组文件按规定方式重新生成提示命名
                        vueFiles.forEach((filsPath: string) => {

                            setStore(context, fileConfigItem.handleFile(filsPath, fileConfigItem.config));

                        });

                        watchFiles.push(watchFile(scopePath, fileConfigItem, context));
                    }

                    if (index === rootUniApp.length - 1) { r(); }
                });
            });

            vscode.window.showInformationMessage(`${projectFileName}共生成提示组件共${Object.keys(context.workspaceState.get(vscodeStoreKey)!).length}个`);
        } else {
            vscode.window.showInformationMessage(`当前工作区没有找到可以匹配的${projectFileName}项目`);
        }
    }
    return watchFiles;
}

export const watchFile = (scopePath: string, fileConfigItem: FilesConfigFactory, context: vscode.ExtensionContext) => {
    const watcherFiles = vscode.workspace.createFileSystemWatcher(scopePath, false, true, false);

    watcherFiles.onDidCreate((e) => {

        setStore(context, fileConfigItem.handleFile(e.path, fileConfigItem.config));

    });

    watcherFiles.onDidDelete((e) => {

        removeStore(context, jointFile(e.path, fileConfigItem.config));
    });

    return watcherFiles;
};