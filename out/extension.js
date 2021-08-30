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
const VueCompoentsPathProvider_1 = require("./provider/VueCompoentsPathProvider");
const VueCompoentsProvider_1 = require("./provider/VueCompoentsProvider");
const compoentsMap_1 = require("./provider/compoentsMap");
const handleFile_1 = require("./util/handleFile");
function activate(context) {
    (0, handleFile_1.getComponents)(vscode.workspace.workspaceFolders);
    /**
     * 监听配置文件的修改
     */
    vscode.workspace.onDidChangeConfiguration(() => __awaiter(this, void 0, void 0, function* () {
        yield (0, handleFile_1.getComponents)(vscode.workspace.workspaceFolders);
        vscode.window.showInformationMessage(`已重新生成完毕。`);
    }));
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