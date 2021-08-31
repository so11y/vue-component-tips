import * as vscode from "vscode";
import { ICompoentsMap } from "../provider/compoentsMap";
import { vscodeStoreKey } from "./const";

type HandleFile = (filePath: string, scopeConfig: FileConfig) => Record<"key" | "path", string>;

export type FileConfig = Record<"path" | "alias", string> & { sub: boolean };

const getFileName = (filsPath: String): string => {
    return filsPath.slice(filsPath.lastIndexOf("/") + 1, filsPath.lastIndexOf("."));
};

const getParentFolderName = (filsPath: String): string => {
    const splitFolderNames = filsPath.split('/');
    return splitFolderNames[splitFolderNames.length - 2] || "";
};

const fileIsStyleFile = (fileName: string): boolean => {
    return fileName.includes("style");
};

export const jointFile = (filePath: string, config: FileConfig): string => {
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


export const handleFile: HandleFile = (filePath, scopeConfig) => {
    return {
        key: jointFile(filePath, scopeConfig),
        path: filePath
    };
};


export const setStore = (context: vscode.ExtensionContext, opt: { key: string, path: string }) => {

    const compoents: ICompoentsMap = context.workspaceState.get(vscodeStoreKey)!;

    compoents[opt.key] = opt.path;

    context.workspaceState.update(
        vscodeStoreKey,
        compoents
    );

};

export const removeStore = (context: vscode.ExtensionContext, compoentsName: string) => {

    const compoents: ICompoentsMap = context.workspaceState.get(vscodeStoreKey)!;

    Reflect.deleteProperty(compoents, compoentsName);

    context.workspaceState.update(
        vscodeStoreKey,
        compoents
    );

};

export const clearStore = (context: vscode.ExtensionContext) =>{
    context.workspaceState.update(
        vscodeStoreKey,
        {}
    );
};