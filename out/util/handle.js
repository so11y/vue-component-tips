"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jointFile = exports.fileIsStyleFile = exports.getParentFolderName = exports.getFileName = exports.filsPathConfig = exports.getComponents = void 0;
const vscode = require("vscode");
const glob_1 = require("glob");
const types_1 = require("./types");
const compoentsMap_1 = require("../provider/compoentsMap");
const handleFile = (filePath, scopeConfig) => {
    return {
        key: (0, exports.jointFile)(filePath, scopeConfig),
        path: filePath
    };
};
/**
 *
 * @example 获取匹配的文件
 */
function getComponents(workspaceFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        const projectFileName = vscode.workspace.getConfiguration().get('zrrz.projectName');
        if (!(0, types_1.isUndefined)(workspaceFolder)) {
            const rootUniApp = workspaceFolder.filter(v => v.name === (projectFileName || "saas"));
            if (rootUniApp.length) {
                yield new Promise(r => {
                    rootUniApp.forEach((folder, index) => __awaiter(this, void 0, void 0, function* () {
                        for (const [path, config] of Object.entries(exports.filsPathConfig)) {
                            const scopePath = folder.uri.fsPath + path;
                            const vueFiles = yield Promise.resolve().then(() => glob_1.glob.sync(scopePath));
                            vueFiles.forEach((filsPath) => {
                                const { key, path } = config.handleFile(filsPath, config);
                                compoentsMap_1.compoentsMap.set(key, path);
                            });
                        }
                        if (index === rootUniApp.length - 1) {
                            r();
                        }
                    }));
                });
                vscode.window.showInformationMessage(`${projectFileName}共生成提示组件共${compoentsMap_1.compoentsMap.size}个`);
            }
            else {
                vscode.window.showInformationMessage(`当前工作区没有找到可以匹配的${projectFileName}项目`);
            }
        }
    });
}
exports.getComponents = getComponents;
exports.filsPathConfig = {
    "/src/common/components/**/*.vue": {
        alias: "",
        sub: false,
        handleFile: handleFile //不需要而外处理的用这个方法
    },
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
const getFileName = (filsPath) => {
    return filsPath.slice(filsPath.lastIndexOf("/") + 1, filsPath.lastIndexOf("."));
};
exports.getFileName = getFileName;
const getParentFolderName = (filsPath) => {
    const splitFolderNames = filsPath.split('/');
    return splitFolderNames[splitFolderNames.length - 2] || "";
};
exports.getParentFolderName = getParentFolderName;
const fileIsStyleFile = (fileName) => {
    return fileName.includes("style");
};
exports.fileIsStyleFile = fileIsStyleFile;
const jointFile = (filePath, config) => {
    const fileName = (0, exports.getFileName)(filePath);
    const folderName = (0, exports.getParentFolderName)(filePath);
    const isStyle = (0, exports.fileIsStyleFile)(fileName);
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
//# sourceMappingURL=handle.js.map