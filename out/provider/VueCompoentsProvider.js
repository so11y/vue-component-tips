"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const const_1 = require("../util/const");
const htmlParseIndex_1 = require("../parse/htmlParseIndex");
const realize_1 = require("../realize/realize");
class VueCompoentsProvider {
    constructor(vscodeContext) {
        this.vscodeContext = vscodeContext;
    }
    provideCompletionItems(document, position, token, context) {
        const isInTemplateInside = (0, htmlParseIndex_1.inOutsideTemplateInside)(document.getText(), document.offsetAt(position));
        //判断是否是在template内部
        if (isInTemplateInside) {
            // 判断是否是在标签内部
            if (!(0, htmlParseIndex_1.isInHtmlAttrInside)(document.getText(), document.offsetAt(position))) {
                const workspaceVueCompoents = Object.keys(this.vscodeContext.workspaceState.get(const_1.vscodeStoreKey));
                if (!workspaceVueCompoents.length) {
                    return [];
                }
                return workspaceVueCompoents.map((componentPathName) => {
                    const item = new vscode_1.CompletionItem(new realize_1.VCompletionItemLabel(componentPathName, `<${componentPathName}></${componentPathName}>`), vscode_1.CompletionItemKind.EnumMember);
                    item.insertText = new vscode_1.SnippetString(`<${componentPathName}>$1</${componentPathName}>`);
                    return item;
                });
            }
            return [];
        }
        return [];
    }
}
exports.default = VueCompoentsProvider;
//# sourceMappingURL=VueCompoentsProvider.js.map