import {
    CompletionItemProvider,
    ExtensionContext,
    TextDocument,
    Position,
    CancellationToken,
    CompletionContext,
    ProviderResult,
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import { vscodeStoreKey } from '../util/const';
import { inOutsideTemplateInside, isInHtmlAttrInside } from "../parse/htmlParseIndex";
import { VCompletionItemLabel } from '../realize/realize';


export default class VueCompoentsProvider implements CompletionItemProvider {
    constructor(private vscodeContext: ExtensionContext) { }
    provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext): ProviderResult<CompletionItem[]> {


        const isInTemplateInside = inOutsideTemplateInside(document.getText(), document.offsetAt(position));

        //判断是否是在template内部
        if (isInTemplateInside) {

            // 判断是否是在标签内部
            if (!isInHtmlAttrInside(document.getText(), document.offsetAt(position))) {
                const workspaceVueCompoents = Object.keys(this.vscodeContext.workspaceState.get(vscodeStoreKey)!);

                if (!workspaceVueCompoents.length) {
                    return [];
                }

                return workspaceVueCompoents.map((componentPathName) => {
                    const item = new CompletionItem(
                        new VCompletionItemLabel(
                            componentPathName,
                            `<${componentPathName}></${componentPathName}>`,
                        ),
                        CompletionItemKind.EnumMember
                    );
                    item.insertText = new SnippetString(`<${componentPathName}>$1</${componentPathName}>`);
                    return item;
                });
            }

            return [];
        }
        return [];
    }
}

