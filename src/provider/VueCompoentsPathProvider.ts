import {
    DefinitionProvider,
    CancellationToken,
    Position,
    ExtensionContext,
    TextDocument,
    ProviderResult,
    Definition,
    Location,
    Uri
} from "vscode";
import { vscodeStoreKey } from "../util/const";
import { ICompoentsMap } from "./compoentsMap";
import { getHtmlTag } from "../parse/htmlParseIndex";


export default class VueCompoentsPathProvider implements DefinitionProvider {

    constructor(private vscodeContext: ExtensionContext) { }

    provideDefinition(document: TextDocument, position: Position): ProviderResult<Definition> {

        const workspaceVueCompoents: ICompoentsMap = this.vscodeContext.workspaceState.get(vscodeStoreKey)!;

        const iterationKeys: Array<string> = Object.keys(workspaceVueCompoents);

        if (!iterationKeys.length) {
            return [];
        }

        const selectText = getHtmlTag(document.lineAt(position.line).text, position.character);

        return iterationKeys
            .filter(v => v.includes(selectText))
            .map(v => new Location(
                Uri.file(workspaceVueCompoents[v].path),
                new Position(0, 0)
            ));
    }
}
