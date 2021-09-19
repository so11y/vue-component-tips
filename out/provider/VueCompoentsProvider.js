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
        const activeDocumentText = document.getText();
        const offsetIndex = document.offsetAt(position);
        const insetOffset = offsetIndex >= activeDocumentText.indexOf("<template>") && offsetIndex <= activeDocumentText.lastIndexOf("</template>");
        //判断是否是在template内部
        if (insetOffset) {
            const text = document.getText();
            // 通过前后字符串拼接成选择文本
            let posIndex = document.offsetAt(position);
            let textMeta = text.substr(posIndex, 1);
            let isInHtmlInside = false;
            while (textMeta !== ">" && isInHtmlInside === false) {
                if (textMeta === "<") {
                    isInHtmlInside = true;
                }
                textMeta = text.substr(--posIndex, 1);
            }
            // 判断是否是在标签内部
            if (!isInHtmlInside) {
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
            return [];
        }
        return [];
    }
}
exports.default = VueCompoentsProvider;
//# sourceMappingURL=VueCompoentsProvider.js.map