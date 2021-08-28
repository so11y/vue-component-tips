"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const VueCompoentsPathProvider_1 = require("./provider/VueCompoentsPathProvider");
const VueCompoentsProvider_1 = require("./provider/VueCompoentsProvider");
const compoentsMap_1 = require("./provider/compoentsMap");
const handle_1 = require("./util/handle");
function activate(context) {
    (0, handle_1.getComponents)(vscode.workspace.workspaceFolders);
    /**
     * 监听配置文件的修改
     */
    vscode.workspace.onDidChangeConfiguration(() => {
        (0, handle_1.getComponents)(vscode.workspace.workspaceFolders);
        vscode.window.showInformationMessage(`已重新生成完毕。`);
    });
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