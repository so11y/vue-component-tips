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
const VuePropsProvider_1 = require("./provider/VuePropsProvider");
const handleFile_1 = require("./util/handleFile");
const const_1 = require("./util/const");
const handelFileUtil_1 = require("./util/handelFileUtil");
function init(context) {
    return __awaiter(this, void 0, void 0, function* () {
        // is dev environment
        // if (!context.workspaceState.get(vscodeStoreKey)) {
        context.workspaceState.update(const_1.vscodeStoreKey, {});
        return yield (0, handleFile_1.getComponents)(vscode.workspace.workspaceFolders, context);
        // }
        // return [];
    });
}
function main(context) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if ((_a = vscode.workspace.workspaceFolders) === null || _a === void 0 ? void 0 : _a.length) {
            const watchFiles = [];
            watchFiles.push(...yield init(context));
            /**
             * 监听配置文件的修改
             */
            vscode.workspace.onDidChangeConfiguration(() => __awaiter(this, void 0, void 0, function* () {
                var _b;
                (0, handelFileUtil_1.clearStore)(context);
                while (watchFiles.length) {
                    (_b = watchFiles.shift()) === null || _b === void 0 ? void 0 : _b.dispose();
                }
                watchFiles.push(...yield (0, handleFile_1.getComponents)(vscode.workspace.workspaceFolders, context));
                vscode.window.showInformationMessage(`已重新生成完毕。`);
            }));
        }
    });
}
function activate(context) {
    main(context);
    /**
     * 注册语法提示
     */
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider('vue', new VueCompoentsProvider_1.default(context)));
    /**
     * 注册文件定位
     */
    context.subscriptions.push(vscode.languages.registerDefinitionProvider('vue', new VueCompoentsPathProvider_1.default(context)));
    /**
      * 注册VueProps提示
      */
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider('vue', new VuePropsProvider_1.default(context), ":"));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map