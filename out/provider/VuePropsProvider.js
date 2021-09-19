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
const vscode = require("vscode");
const getProps_1 = require("../parse/getProps");
const const_1 = require("../util/const");
const kebabCase = require("lodash/kebabCase");
class CompletionItemLabel {
    constructor(label, description, detail) {
        this.label = label;
        this.description = description;
        this.detail = detail;
    }
}
class VueCompoentsProvider {
    constructor(vscodeContext) {
        this.vscodeContext = vscodeContext;
    }
    provideCompletionItems(document, position, token, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const workspaceVueCompoents = this.vscodeContext.workspaceState.get(const_1.vscodeStoreKey);
            const iterationKeys = Object.keys(workspaceVueCompoents);
            if (!iterationKeys.length) {
                return [];
            }
            const textSplite = [' ', '>', '"', '\'', '.', '\\', "=", ":", "@", "(", ")", "[", "]", "{", "}", ",", "!", "\n", "\r"];
            const text = document.getText();
            // 通过前后字符串拼接成选择文本
            let posIndex = document.offsetAt(position);
            let textMeta = text.substr(posIndex, 1);
            let selectText = "";
            // 前向获取符合要求的字符串
            while (textMeta !== "<") {
                if (textSplite.indexOf(textMeta) === -1) {
                    selectText = textMeta + selectText;
                }
                else {
                    selectText = "";
                }
                textMeta = text.substr(--posIndex, 1);
            }
            const sfcKey = iterationKeys.find(v => v === selectText);
            if (sfcKey) {
                return (0, getProps_1.default)(workspaceVueCompoents[sfcKey].path).then((v) => {
                    return v.map((key) => {
                        const item = new vscode.CompletionItem(new CompletionItemLabel(":" + kebabCase(key), ``), vscode.CompletionItemKind.EnumMember);
                        item.insertText = `${kebabCase(key)}=""`;
                        return item;
                    });
                });
            }
            return [];
        });
    }
}
exports.default = VueCompoentsProvider;
//# sourceMappingURL=VuePropsProvider.js.map