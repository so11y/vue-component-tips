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
exports.watchFile = exports.getComponents = void 0;
const vscode = require("vscode");
const glob_1 = require("glob");
const types_1 = require("./types");
const handelFileUtil_1 = require("./handelFileUtil");
const const_1 = require("./const");
class FilesConfigFactory {
    constructor(config) {
        this.config = config;
    }
    handleFile(filePath, scopeConfig) {
        return (0, handelFileUtil_1.handleFile)(filePath, scopeConfig);
    }
}
const getFileFactorys = () => {
    const configList = vscode.workspace.getConfiguration().get('zrrz.configList') || [];
    return configList.map(v => new FilesConfigFactory(v));
};
/**
 *
 * @example 获取匹配的文件
 */
function getComponents(workspaceFolder, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const projectFileName = vscode.workspace.getConfiguration().get('zrrz.projectName');
        const watchFiles = [];
        if (!(0, types_1.isUndefined)(workspaceFolder)) {
            const rootUniApp = workspaceFolder.filter(v => v.name === (projectFileName || "saas"));
            const fileFactorys = getFileFactorys();
            if (rootUniApp.length) {
                yield new Promise(r => {
                    //工作区
                    rootUniApp.forEach((folder, index) => __awaiter(this, void 0, void 0, function* () {
                        //文件匹配多种规则
                        for (const fileConfigItem of fileFactorys) {
                            const scopePath = folder.uri.fsPath + fileConfigItem.config.path;
                            const vueFiles = yield Promise.resolve().then(() => glob_1.glob.sync(scopePath));
                            //解析出的每组文件按规定方式重新生成提示命名
                            vueFiles.forEach((filsPath) => {
                                (0, handelFileUtil_1.setStore)(context, fileConfigItem.handleFile(filsPath, fileConfigItem.config));
                            });
                            watchFiles.push((0, exports.watchFile)(scopePath, fileConfigItem, context));
                        }
                        if (index === rootUniApp.length - 1) {
                            r();
                        }
                    }));
                });
                vscode.window.showInformationMessage(`${projectFileName}共生成提示组件共${Object.keys(context.workspaceState.get(const_1.vscodeStoreKey)).length}个`);
            }
            else {
                vscode.window.showInformationMessage(`当前工作区没有找到可以匹配的${projectFileName}项目`);
            }
        }
        return watchFiles;
    });
}
exports.getComponents = getComponents;
const watchFile = (scopePath, fileConfigItem, context) => {
    const watcherFiles = vscode.workspace.createFileSystemWatcher(scopePath, false, true, false);
    watcherFiles.onDidCreate((e) => {
        (0, handelFileUtil_1.setStore)(context, fileConfigItem.handleFile(e.path, fileConfigItem.config));
    });
    watcherFiles.onDidDelete((e) => {
        (0, handelFileUtil_1.removeStore)(context, (0, handelFileUtil_1.jointFile)(e.path, fileConfigItem.config));
    });
    return watcherFiles;
};
exports.watchFile = watchFile;
//# sourceMappingURL=handleFile.js.map