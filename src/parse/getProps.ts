import babelToProps from "./babelToProps";
import * as vscode from "vscode";


export default (path: string): Promise<string[]> => {
    return new Promise((r) => {
        vscode.workspace.fs.readFile(vscode.Uri.file(path)).then((v) => {
            const startStr = 'export default';
            const lastStr = '</script>';
            const strFile = v.toString();
            const source = strFile.slice(strFile.indexOf(startStr), strFile.lastIndexOf(lastStr));

            babelToProps(source, (d: string[]) => {
                r(d);
            });
        });
    });
};

