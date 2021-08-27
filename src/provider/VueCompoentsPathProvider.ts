import * as vscode from "vscode";
import { ICompoentsMap } from "./compoentsMap";

export default class VueCompoentsPathProvider implements vscode.DefinitionProvider {
    constructor(private compoentsMap: ICompoentsMap) { }

    provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Definition | vscode.LocationLink[]> {
        const word = document.getText(document.getWordRangeAtPosition(position));
        return Array.from(this.compoentsMap.keys())
            .filter(v => v.includes(word))
            .map(v => new vscode.Location(
                vscode.Uri.file(this.compoentsMap.get(v)!),
                new vscode.Position(0, 0)
            ));
    }
}
