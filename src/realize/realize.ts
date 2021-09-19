import {
    CompletionItemLabel
} from "vscode";


export class VCompletionItemLabel implements CompletionItemLabel {
    constructor(
        public label: string,
        public description: string,
        public detail?: string) { }
}
