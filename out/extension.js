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
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const glob_1 = require("glob");
const types_1 = require("./util/types");
const VueCompoentsPathProvider_1 = require("./provider/VueCompoentsPathProvider");
const VueCompoentsProvider_1 = require("./provider/VueCompoentsProvider");
const compoentsMap_1 = require("./provider/compoentsMap");
/**
 *
 * @example 获取匹配的文件
 */
function getComponents(workspaceFolder) {
    const projectFileName = vscode.workspace.getConfiguration().get('zrrz.projectName');
    if (!(0, types_1.isUndefined)(workspaceFolder)) {
        const rootUniApp = workspaceFolder.filter(v => v.name === (projectFileName || "saas"));
        if (rootUniApp.length) {
            rootUniApp.forEach((folder) => __awaiter(this, void 0, void 0, function* () {
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
                try {
                    const path = folder.uri.fsPath + "/**/*.vue";
                    const vueFiles = glob_1.glob.sync(path);
                    vueFiles.forEach((filsPath) => {
                        compoentsMap_1.compoentsMap.set(filsPath.slice(filsPath.lastIndexOf("/") + 1, filsPath.lastIndexOf(".")), filsPath);
                    });
                }
                catch (error) {
                    vscode.window.showInformationMessage(`${error}`);
                }
            }));
            vscode.window.showInformationMessage(`${projectFileName}共生成提示组件共${compoentsMap_1.compoentsMap.size}个`);
        }
        else {
            vscode.window.showInformationMessage(`当前工作区没有找到可以匹配的${projectFileName}项目`);
        }
    }
}
function activate(context) {
    getComponents(vscode.workspace.workspaceFolders);
    // vscode.workspace.onDidChangeConfiguration  用于监听配置更改
    /**
     * 注册语法提示
     */
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider('vue', new VueCompoentsProvider_1.default(compoentsMap_1.compoentsMap)));
    /**
     * 注册文件定位
     */
    context.subscriptions.push(vscode.languages.registerDefinitionProvider('vue', new VueCompoentsPathProvider_1.default(compoentsMap_1.compoentsMap)));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map