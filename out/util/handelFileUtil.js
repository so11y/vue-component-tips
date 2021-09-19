"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearStore = exports.removeStore = exports.setStore = exports.handleFile = exports.jointFile = void 0;
const const_1 = require("./const");
const getFileName = (filsPath) => {
    return filsPath.slice(filsPath.lastIndexOf("/") + 1, filsPath.lastIndexOf("."));
};
const getParentFolderName = (filsPath) => {
    const splitFolderNames = filsPath.split('/');
    return splitFolderNames[splitFolderNames.length - 2] || "";
};
const fileIsStyleFile = (fileName) => {
    return fileName.includes("style");
};
const jointFile = (filePath, config) => {
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
exports.jointFile = jointFile;
const handleFile = (filePath, scopeConfig) => {
    return {
        key: (0, exports.jointFile)(filePath, scopeConfig),
        path: filePath
    };
};
exports.handleFile = handleFile;
const setStore = (context, opt) => {
    const compoents = context.workspaceState.get(const_1.vscodeStoreKey);
    compoents[opt.key] = {
        path: opt.path
    };
    context.workspaceState.update(const_1.vscodeStoreKey, compoents);
};
exports.setStore = setStore;
const removeStore = (context, compoentsName) => {
    const compoents = context.workspaceState.get(const_1.vscodeStoreKey);
    Reflect.deleteProperty(compoents, compoentsName);
    context.workspaceState.update(const_1.vscodeStoreKey, compoents);
};
exports.removeStore = removeStore;
const clearStore = (context) => {
    context.workspaceState.update(const_1.vscodeStoreKey, {});
};
exports.clearStore = clearStore;
//# sourceMappingURL=handelFileUtil.js.map