"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const const_1 = require("../util/const");
const htmlParseIndex_1 = require("../parse/htmlParseIndex");
class VueCompoentsPathProvider {
    constructor(vscodeContext) {
        this.vscodeContext = vscodeContext;
    }
    provideDefinition(document, position) {
        const workspaceVueCompoents = this.vscodeContext.workspaceState.get(const_1.vscodeStoreKey);
        const iterationKeys = Object.keys(workspaceVueCompoents);
        if (!iterationKeys.length) {
            return [];
        }
        const selectText = (0, htmlParseIndex_1.getHtmlTag)(document.lineAt(position.line).text, position.character);
        return iterationKeys
            .filter(v => v.includes(selectText))
            .map(v => new vscode_1.Location(vscode_1.Uri.file(workspaceVueCompoents[v].path), new vscode_1.Position(0, 0)));
    }
}
exports.default = VueCompoentsPathProvider;
//# sourceMappingURL=VueCompoentsPathProvider.js.map