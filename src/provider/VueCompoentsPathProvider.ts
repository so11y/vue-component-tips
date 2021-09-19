import * as vscode from "vscode";
import { vscodeStoreKey } from "../util/const";
import { ICompoentsMap } from "./compoentsMap";
import { getHtmlTag } from "../parse/htmlParseIndex";


export default class VueCompoentsPathProvider implements vscode.DefinitionProvider {
    constructor(private vscodeContext: vscode.ExtensionContext) { }

    provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Definition | vscode.LocationLink[]> {

        const workspaceVueCompoents: ICompoentsMap = this.vscodeContext.workspaceState.get(vscodeStoreKey)!;

        const iterationKeys: Array<string> = Object.keys(workspaceVueCompoents);

        if (!iterationKeys.length) {
            return [];
        }
        /**
         * 获取当前的tag
         */
        const selectText = getHtmlTag(document.lineAt(position.line).text, position.character);

        return iterationKeys
            .filter(v => v.includes(selectText))
            .map(v => new vscode.Location(
                vscode.Uri.file(workspaceVueCompoents[v].path),
                new vscode.Position(0, 0)
            ));
    }
}
