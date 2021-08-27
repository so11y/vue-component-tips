"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class VueCompoentsPathProvider {
    constructor(compoentsMap) {
        this.compoentsMap = compoentsMap;
    }
    provideDefinition(document, position, token) {
        const word = document.getText(document.getWordRangeAtPosition(position));
        return Array.from(this.compoentsMap.keys())
            .filter(v => v.includes(word))
            .map(v => new vscode.Location(vscode.Uri.file(this.compoentsMap.get(v)), new vscode.Position(0, 0)));
    }
}
exports.default = VueCompoentsPathProvider;
//# sourceMappingURL=VueCompoentsPathProvider.js.map