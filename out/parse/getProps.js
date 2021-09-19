"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const babelToProps_1 = require("./babelToProps");
const vscode = require("vscode");
exports.default = (path) => {
    return new Promise((r) => {
        vscode.workspace.fs.readFile(vscode.Uri.file(path)).then((v) => {
            const startStr = 'export default';
            const lastStr = '</script>';
            const strFile = v.toString();
            const source = strFile.slice(strFile.indexOf(startStr), strFile.lastIndexOf(lastStr));
            (0, babelToProps_1.default)(source, (d) => {
                r(d);
            });
        });
    });
};
//# sourceMappingURL=getProps.js.map