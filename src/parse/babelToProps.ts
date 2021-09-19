import { transformSync } from '@babel/core';

const getProps = (cb: Function) => {
    return (t:any) => {
        return {
            pre(file:any) {
                file.set("props", []);
            },
            visitor: {
                ObjectExpression(path:any, state:any) {
                    const sfcFileProps = state.file.get('props');
                    if (t.types.isExportDefaultDeclaration(path.parent)) {
                        //props 的 字面量
                        const sfcProps = path.node.properties.find((v:any) => v.key.name === "props");
                        sfcProps.value.properties.forEach((v:any) => sfcFileProps.push(v.key.name));
                    }
                },
            },
            post(file:any) {
                cb(file.get("props"));
            }
        };
    };
};


export default (source: string, cb: Function) => {
    transformSync(source, {
        plugins: [
            getProps(cb)
        ]
    });
};

