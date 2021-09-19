import { transformSync } from '@babel/core';
import generator from "@babel/generator";

const getProps = (cb: Function) => {
    return (t: any) => {
        return {
            pre(file: any) {
                file.set("props", []);
            },
            visitor: {
                ObjectExpression(path: any, state: any) {
                    const sfcFileProps = state.file.get('props');
                    if (t.types.isExportDefaultDeclaration(path.parent)) {
                        //props 的 字面量
                        const sfcProps = path.node.properties.find((v: any) => v.key.name === "props");

                        sfcProps.value.properties.forEach((v: any) => {
                            const props = {
                                key: v.key.name,
                                default: "" ,
                                enum: ""
                            };
                            if (v.leadingComments?.length) {
                                v.leadingComments.forEach((comments: any) => {
                                    if (comments.type === "CommentLine" && comments.value.trim().startsWith("@enum")) {
                                        try {
                                            props.enum = comments.value.trim().replace("@enum ", "");
                                        } catch (e) {
                                            console.log("uniSass:propstoParse >> comments", e);
                                        }
                                    }
                                });
                            }
                            v.value.properties.forEach((k: any) => {
                                if (k.key.name === "default") {
                                    props.default = generator(k.value).code;
                                }
                            });
                            sfcFileProps.push(props);
                        });
                    }
                },
            },
            post(file: any) {
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

