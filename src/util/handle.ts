import * as  vscode from 'vscode';
import { glob } from "glob";
import { isUndefined } from './types';
import { compoentsMap } from '../provider/compoentsMap';


export interface IFileIsStyleFile {
    alias: string,
    sub: boolean,
    handleFile: (filePath: string, scopeConfig: IFileIsStyleFile) => Record<"key" | "path", string>
}

export interface IFileConfig {
    [key: string]: IFileIsStyleFile
}

const handleFile: IFileIsStyleFile["handleFile"] = (filePath, scopeConfig) => {
    return {
        key: jointFile(filePath, scopeConfig),
        path: filePath
    };
};

/**
 *
 * @example 获取匹配的文件
 */
export async function getComponents(workspaceFolder: readonly vscode.WorkspaceFolder[] | undefined) {
    const projectFileName = vscode.workspace.getConfiguration().get('zrrz.projectName');
    if (!isUndefined(workspaceFolder)) {
        const rootUniApp = workspaceFolder.filter(v => v.name === (projectFileName as string || "saas"));
        if (rootUniApp.length) {
            await new Promise<void>(r => {
                rootUniApp.forEach(async (folder, index) => {
                    for (const [path, config] of Object.entries(filsPathConfig)) {
                        const scopePath = folder.uri.fsPath + path;
                        const vueFiles = await Promise.resolve().then(() => glob.sync(scopePath));
                        vueFiles.forEach((filsPath: string) => {
                            const { key, path } = config.handleFile(filsPath, config);
                            compoentsMap.set(key, path);
                        });
                    }
                    if (index === rootUniApp.length - 1) { r(); }
                });
            });
            vscode.window.showInformationMessage(`${projectFileName}共生成提示组件共${compoentsMap.size}个`);
        } else {
            vscode.window.showInformationMessage(`当前工作区没有找到可以匹配的${projectFileName}项目`);
        }
    }
}

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

export const getFileName = (filsPath: String): string => {
    return filsPath.slice(filsPath.lastIndexOf("/") + 1, filsPath.lastIndexOf("."));
};

export const getParentFolderName = (filsPath: String): string => {
    const splitFolderNames = filsPath.split('/');
    return splitFolderNames[splitFolderNames.length - 2] || "";
};

export const fileIsStyleFile = (fileName: string): boolean => {
    return fileName.includes("style");
};

export const jointFile = (filePath: string, config: IFileIsStyleFile): string => {
    const fileName = getFileName(filePath);
    const folderName = getParentFolderName(filePath);
    const isStyle = fileIsStyleFile(fileName);

    let file = fileName;
    if (isStyle) {
        file = folderName + "-" + file;
    }

    if (config.sub) {
        const splitFiles = filePath.split("/");
        const subFileName = splitFiles[splitFiles.findIndex(v => v === "components") - 1];

        file = `${subFileName}-` + file;
    }

    return config.alias + file;
};