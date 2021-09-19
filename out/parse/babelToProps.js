"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@babel/core");
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
                        sfcProps.value.properties.forEach((v) => sfcFileProps.push(v.key.name));
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