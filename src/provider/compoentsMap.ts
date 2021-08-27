/**
 * 用来后面给Map的value存储
 */
export interface IVueFile {
    fileName: String;
    path: String;
    perentPath: String;
}

export type ICompoentsMap = Map<string, string>;


export const compoentsMap: ICompoentsMap = new Map<string, string>();