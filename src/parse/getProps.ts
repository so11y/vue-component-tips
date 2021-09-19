import babelToProps from "./babelToProps";
import * as vscode from "vscode";

type Props = {
    key: string,
    default: string,
    enum: string
};
export default (path: string): Promise<Props[]> => {
    return new Promise((r) => {
        vscode.workspace.fs.readFile(vscode.Uri.file(path)).then((v) => {
            const startStr = 'export default';
            const lastStr = '</script>';
            const strFile = v.toString();
            const source = strFile.slice(strFile.indexOf(startStr), strFile.lastIndexOf(lastStr));

            babelToProps(source, (d: Props[]) => {
                r(d);
            });
        });
    });
};

