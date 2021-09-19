"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@babel/core");
const generator_1 = require("@babel/generator");
const getProps = (cb) => {
    return (t) => {
        return {
            pre(file) {
                file.set("props", []);
            },
            visitor: {
                ObjectExpression(path, state) {
                    const sfcFileProps = state.file.get('props');
                    if (t.types.isExportDefaultDeclaration(path.parent)) {
                        //props 的 字面量
                        const sfcProps = path.node.properties.find((v) => v.key.name === "props");
                        sfcProps.value.properties.forEach((v) => {
                            var _a;
                            const props = {
                                key: v.key.name,
                                default: "",
                                enum: ""
                            };
                            if ((_a = v.leadingComments) === null || _a === void 0 ? void 0 : _a.length) {
                                v.leadingComments.forEach((comments) => {
                                    if (comments.type === "CommentLine" && comments.value.trim().startsWith("@enum")) {
                                        try {
                                            props.enum = comments.value.trim().replace("@enum ", "");
                                        }
                                        catch (e) {
                                            console.log("uniSass:propstoParse >> comments", e);
                                        }
                                    }
                                });
                            }
                            v.value.properties.forEach((k) => {
                                if (k.key.name === "default") {
                                    props.default = (0, generator_1.default)(k.value).code;
                                }
                            });
                            sfcFileProps.push(props);
                        });
                    }
                },
            },
            post(file) {
                cb(file.get("props"));
            }
        };
    };
};
exports.default = (source, cb) => {
    (0, core_1.transformSync)(source, {
        plugins: [
            getProps(cb)
        ]
    });
};
//# sourceMappingURL=babelToProps.js.map