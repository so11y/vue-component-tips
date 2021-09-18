import * as  vscode from 'vscode';
import { vscodeStoreKey } from '../util/const';
// import { compile, parseComponent, ssrCompile } from "../util/vueTemplateCompiler";


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
        // const vueSfc = parseComponent(activeDocumentText);

        const insetOffset = offsetIndex >= activeDocumentText.indexOf("<template>") && offsetIndex <= activeDocumentText.lastIndexOf("</template>");

        if (insetOffset) {

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
}

