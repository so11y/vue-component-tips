import {
    ExtensionContext,
    TextDocument,
    Position,
    CompletionItemProvider,
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import getProps from '../parse/getProps';
import { getHtmlTagLately } from '../parse/htmlParseIndex';
import { VCompletionItemLabel } from '../realize/realize';
import { vscodeStoreKey } from '../util/const';
import { where } from '../util/functionl';
import { ICompoentsMap } from "./compoentsMap";
const kebabCase = require("lodash/kebabCase");


export default class VueCompoentsProvider implements CompletionItemProvider {

    constructor(private vscodeContext: ExtensionContext) { }

    provideCompletionItems(document: TextDocument, position: Position): Promise<CompletionItem[]> {

        const workspaceVueCompoents: ICompoentsMap = this.vscodeContext.workspaceState.get(vscodeStoreKey)!;

        const iterationKeys: Array<string> = Object.keys(workspaceVueCompoents);

        if (!iterationKeys.length) {
            return Promise.resolve([]);
        }

        const selectText = getHtmlTagLately(document.getText(), document.offsetAt(position));

        const sfcKey = iterationKeys.find(v => v === selectText);

        return where(
            sfcKey,
            () => {
                return getProps(workspaceVueCompoents[sfcKey!].path).then((v) => {
                    return v.map((prop) => {
                        const item = new CompletionItem(
                            new VCompletionItemLabel(
                                ":" + kebabCase(prop.key),
                                ``,
                            ),
                            CompletionItemKind.EnumMember
                        );
                        if (prop.default || prop.enum) {

                            /**
                             * 这里先判断如果default里如果包含, 这里在vscode会被分割提示所以直接显示default
                             * 还不知道怎么处理
                             */
                            if (prop.default && prop.default.includes(",")) {
                                item.insertText = new SnippetString(kebabCase(prop.key) + '="${1:' + prop.default + '}"');
                            } else {
                                /**
                                 * 这里同样过滤掉带 , 号的枚举
                                 */
                                const joinProp = [prop.default, ...prop.enum.split("|")].filter(v => {
                                   return v && !v.includes(",");
                                }).join();

                                item.insertText = new SnippetString(kebabCase(prop.key) + '="${1|' + joinProp + '|}"');

                            }
                        } else {
                            item.insertText = new SnippetString(kebabCase(prop.key) + '="$1"');
                        }
                        return item;
                    });
                });
            },
            () => {
                return Promise.resolve([]);
            }
        );
    }
}

