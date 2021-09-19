"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const const_1 = require("../util/const");
class VueCompoentsPathProvider {
    constructor(vscodeContext) {
        this.vscodeContext = vscodeContext;
    }
    provideDefinition(document, position, token) {
        const workspaceVueCompoents = this.vscodeContext.workspaceState.get(const_1.vscodeStoreKey);
        const iterationKeys = Object.keys(workspaceVueCompoents);
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
            .map(v => new vscode.Location(vscode.Uri.file(workspaceVueCompoents[v].path), new vscode.Position(0, 0)));
    }
}
exports.default = VueCompoentsPathProvider;
//# sourceMappingURL=VueCompoentsPathProvider.js.map