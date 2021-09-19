import * as  vscode from 'vscode';
import getProps from '../parse/getProps';
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
            } else {
                selectText = "";
            }
            textMeta = text.substr(--posIndex, 1);
        }

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

