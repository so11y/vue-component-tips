import * as  vscode from 'vscode';
import { ICompoentsMap } from './compoentsMap';


class CompletionItemLabel implements vscode.CompletionItemLabel {
    constructor(
        public label: string,
        public description: string,
        public detail?: string) { }
}



export default class VueCompoentsProvider implements vscode.CompletionItemProvider {
    constructor(private compoentsMap: ICompoentsMap) { }
    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>> {

        return Array.from(this.compoentsMap.keys()).map((componentPathName) =>
            new vscode.CompletionItem(
                new CompletionItemLabel(
                    componentPathName,
                    `<${componentPathName}></${componentPathName}>`,
                ),
                vscode.CompletionItemKind.EnumMember
            )
        );
    }
}

