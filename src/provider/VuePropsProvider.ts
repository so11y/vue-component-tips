import * as  vscode from 'vscode';
import getProps from '../parse/getProps';
import { getHtmlTagLately } from '../parse/htmlParseIndex';
import { vscodeStoreKey } from '../util/const';
import { ICompoentsMap } from "./compoentsMap";
const kebabCase = require("lodash/kebabCase");


class CompletionItemLabel implements vscode.CompletionItemLabel {
    constructor(
        public label: string,
        public description: string,
        public detail?: string) { }
}

export default class VueCompoentsProvider implements vscode.CompletionItemProvider {
    constructor(private vscodeContext: vscode.ExtensionContext) { }
    async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): Promise<vscode.CompletionItem[]> {

        const workspaceVueCompoents: ICompoentsMap = this.vscodeContext.workspaceState.get(vscodeStoreKey)!;

        const iterationKeys: Array<string> = Object.keys(workspaceVueCompoents);


        if (!iterationKeys.length) {
            return [];
        }

        const selectText = getHtmlTagLately(document.getText(), document.offsetAt(position));

        const sfcKey = iterationKeys.find(v => v === selectText);

        if (sfcKey) {
            return getProps(workspaceVueCompoents[sfcKey].path).then((v) => {
                return v.map((key) => {
                    const item = new vscode.CompletionItem(
                        new CompletionItemLabel(
                            ":" + kebabCase(key),
                            ``,
                        ),
                        vscode.CompletionItemKind.EnumMember
                    );
                    item.insertText = `${kebabCase(key)}=""`;
                    return item;
                });
            });
        }
        return [];
    }
}

