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
const compoentsMap_1 = require("../provider/compoentsMap");
const handelFileUtil_1 = require("./handelFileUtil");
class FilesConfigFactory {
    constructor(config) {
        this.config = config;
    }
    handleFile(filePath, scopeConfig) {
        return (0, handelFileUtil_1.handleFile)(filePath, scopeConfig);
    }
}
const fileFactorys = [
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
function getComponents(workspaceFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        const projectFileName = vscode.workspace.getConfiguration().get('zrrz.projectName');
        const watchFiles = [];
        if (!(0, types_1.isUndefined)(workspaceFolder)) {
            const rootUniApp = workspaceFolder.filter(v => v.name === (projectFileName || "saas"));
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
                                const { key, path } = fileConfigItem.handleFile(filsPath, fileConfigItem.config);
                                compoentsMap_1.compoentsMap.set(key, path);
                            });
                            watchFiles.push((0, exports.watchFile)(scopePath, fileConfigItem));
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
        return watchFiles;
    });
}
exports.getComponents = getComponents;
const watchFile = (scopePath, fileConfigItem) => {
    const watcherFiles = vscode.workspace.createFileSystemWatcher(scopePath, false, true, false);
    watcherFiles.onDidCreate((e) => {
        const { key, path } = fileConfigItem.handleFile(e.path, fileConfigItem.config);
        compoentsMap_1.compoentsMap.set(key, path);
    });
    watcherFiles.onDidDelete((e) => {
        compoentsMap_1.compoentsMap.delete((0, handelFileUtil_1.jointFile)(e.path, fileConfigItem.config));
    });
    return watcherFiles;
};
exports.watchFile = watchFile;
//# sourceMappingURL=handleFile.js.map