"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const const_1 = require("../util/const");
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
        const workspaceVueCompoents = Object.keys(this.vscodeContext.workspaceState.get(const_1.vscodeStoreKey));
        if (!workspaceVueCompoents.length) {
            return [];
        }
        return workspaceVueCompoents.map((componentPathName) => {
            const item = new vscode.CompletionItem(new CompletionItemLabel(componentPathName, `<${componentPathName}></${componentPathName}>`), vscode.CompletionItemKind.EnumMember);
            item.insertText = `<${componentPathName}></${componentPathName}>`;
            return item;
        });
    }
}
exports.default = VueCompoentsProvider;
//# sourceMappingURL=VueCompoentsProvider.js.map