import * as vscode from "vscode";
import { vscodeStoreKey } from "../util/const";
import { ICompoentsMap } from "./compoentsMap";

export default class VueCompoentsPathProvider implements vscode.DefinitionProvider {
    constructor(private vscodeContext: vscode.ExtensionContext) { }

    provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Definition | vscode.LocationLink[]> {

        const workspaceVueCompoents: ICompoentsMap = this.vscodeContext.workspaceState.get(vscodeStoreKey)!;

        const iterationKeys: Array<string> = Object.keys(workspaceVueCompoents);

        if (!iterationKeys.length) {
            return [];
        }

        const line = document.lineAt(position.line);

        const textSplite = [' ', '<', '>', '"', '\'', '.', '\\', "=", ":", "@", "(", ")", "[", "]", "{", "}", ",", "!"];

        // 通过前后字符串拼接成选择文本
        let posIndex = position.character;

        let textMeta = line.text.substr(posIndex, 1);

        let selectText = '';

        // 前向获取符合要求的字符串
        while (textSplite.indexOf(textMeta) === -1 && posIndex <= line.text.length) {
            selectText += textMeta;
            textMeta = line.text.substr(++posIndex, 1);
        }

        // 往后获取符合要求的字符串
        posIndex = position.character - 1;
        textMeta = line.text.substr(posIndex, 1);
        while (textSplite.indexOf(textMeta) === -1 && posIndex > 0) {
            selectText = textMeta + selectText;
            textMeta = line.text.substr(--posIndex, 1);
        }


        return iterationKeys
            .filter(v => v.includes(selectText))
            .map(v => new vscode.Location(
                vscode.Uri.file(workspaceVueCompoents[v]!),
                new vscode.Position(0, 0)
            ));
    }
}
