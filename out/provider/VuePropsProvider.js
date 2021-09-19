"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const getProps_1 = require("../parse/getProps");
const htmlParseIndex_1 = require("../parse/htmlParseIndex");
const realize_1 = require("../realize/realize");
const const_1 = require("../util/const");
const functionl_1 = require("../util/functionl");
const kebabCase = require("lodash/kebabCase");
class VueCompoentsProvider {
    constructor(vscodeContext) {
        this.vscodeContext = vscodeContext;
    }
    provideCompletionItems(document, position) {
        const workspaceVueCompoents = this.vscodeContext.workspaceState.get(const_1.vscodeStoreKey);
        const iterationKeys = Object.keys(workspaceVueCompoents);
        if (!iterationKeys.length) {
            return Promise.resolve([]);
        }
        const selectText = (0, htmlParseIndex_1.getHtmlTagLately)(document.getText(), document.offsetAt(position));
        const sfcKey = iterationKeys.find(v => v === selectText);
        return (0, functionl_1.where)(sfcKey, () => {
            return (0, getProps_1.default)(workspaceVueCompoents[sfcKey].path).then((v) => {
                return v.map((prop) => {
                    const item = new vscode_1.CompletionItem(new realize_1.VCompletionItemLabel(":" + kebabCase(prop.key), ``), vscode_1.CompletionItemKind.EnumMember);
                    if (prop.default || prop.enum) {
                        /**
                         * 这里先判断如果default里如果包含, 这里在vscode会被分割提示所以直接显示default
                         * 还不知道怎么处理
                         */
                        if (prop.default && prop.default.includes(",")) {
                            item.insertText = new vscode_1.SnippetString(kebabCase(prop.key) + '="${1:' + prop.default + '}"');
                        }
                        else {
                            /**
                             * 这里同样过滤掉带 , 号的枚举
                             */
                            const joinProp = [prop.default, ...prop.enum.split("|")].filter(v => {
                                return v && !v.includes(",");
                            }).join();
                            item.insertText = new vscode_1.SnippetString(kebabCase(prop.key) + '="${1|' + joinProp + '|}"');
                        }
                    }
                    else {
                        item.insertText = new vscode_1.SnippetString(kebabCase(prop.key) + '="$1"');
                    }
                    return item;
                });
            });
        }, () => {
            return Promise.resolve([]);
        });
    }
}
exports.default = VueCompoentsProvider;
//# sourceMappingURL=VuePropsProvider.js.map