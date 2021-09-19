import * as  vscode from 'vscode';
import { vscodeStoreKey } from '../util/const';


class CompletionItemLabel implements vscode.CompletionItemLabel {
    constructor(
        public label: string,
        public description: string,
        public detail?: string) { }
}

export default class VueCompoentsProvider implements vscode.CompletionItemProvider {
    constructor(private vscodeContext: vscode.ExtensionContext) { }
    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>> {
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
                const workspaceVueCompoents = Object.keys(this.vscodeContext.workspaceState.get(vscodeStoreKey)!);

                if (!workspaceVueCompoents.length) {
                    return [];
                }

                return workspaceVueCompoents.map((componentPathName) => {
                    const item = new vscode.CompletionItem(
                        new CompletionItemLabel(
                            componentPathName,
                            `<${componentPathName}></${componentPathName}>`,
                        ),
                        vscode.CompletionItemKind.EnumMember
                    );
                    item.insertText = `<${componentPathName}></${componentPathName}>`;
                    return item;
                });
            }

            return [];
        }
        return [];
    }
}

