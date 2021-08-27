"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class CompletionItemLabel {
    constructor(label, description, detail) {
        this.label = label;
        this.description = description;
        this.detail = detail;
    }
}
class VueCompoentsProvider {
    constructor(compoentsMap) {
        this.compoentsMap = compoentsMap;
    }
    provideCompletionItems(document, position, token, context) {
        return Array.from(this.compoentsMap.keys()).map((componentPathName) => new vscode.CompletionItem(new CompletionItemLabel(componentPathName, `<${componentPathName}></${componentPathName}>`), vscode.CompletionItemKind.EnumMember));
    }
}
exports.default = VueCompoentsProvider;
//# sourceMappingURL=VueCompoentsProvider.js.map