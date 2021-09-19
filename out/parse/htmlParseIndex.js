"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHtmlTagLately = exports.isInHtmlAttrInside = exports.getHtmlTag = exports.inOutsideTemplateInside = void 0;
/**
 * @param text 當前整個文檔
 * @param offsetIndex 当前光标所在位置
 * @returns {boolean}
 */
const inOutsideTemplateInside = (text, offsetIndex) => {
    return offsetIndex >= text.indexOf("<template>") && offsetIndex <= text.lastIndexOf("</template>");
};
exports.inOutsideTemplateInside = inOutsideTemplateInside;
/**
* @example  获取htmltag 向前向后获取
* @param {string} line 当前行
* @param {number} character 当前光标位置
*/
const getHtmlTag = (line, character) => {
    const textSplite = [' ', '<', '>', '"', '\'', '.', '\\', "=", ":", "@", "(", ")", "[", "]", "{", "}", ",", "!"];
    // 通过前后字符串拼接成选择文本
    let posIndex = character;
    let textMeta = line.substr(posIndex, 1);
    let selectText = '';
    // 前向获取符合要求的字符串
    while (textSplite.indexOf(textMeta) === -1 && posIndex <= line.length) {
        selectText += textMeta;
        textMeta = line.substr(++posIndex, 1);
    }
    // 往后获取符合要求的字符串
    posIndex = character - 1;
    textMeta = line.substr(posIndex, 1);
    while (textSplite.indexOf(textMeta) === -1 && posIndex > 0) {
        selectText = textMeta + selectText;
        textMeta = line.substr(--posIndex, 1);
    }
    return selectText;
};
exports.getHtmlTag = getHtmlTag;
/**
 * @example  判断是否在html标签内部
 * @param {string} text 当前整个文档
 * @param {number} character 当前光标位置
 */
const isInHtmlAttrInside = (text, posIndex) => {
    let textMeta = text.substr(posIndex, 1);
    let isInHtmlInside = false;
    while (textMeta !== ">" && isInHtmlInside === false) {
        if (textMeta === "<") {
            isInHtmlInside = true;
        }
        textMeta = text.substr(--posIndex, 1);
    }
    return isInHtmlInside;
};
exports.isInHtmlAttrInside = isInHtmlAttrInside;
/**
 * @example  判断是否在html标签内部
 * @param {string} text 当前整个文档
 * @param {number} character 当前光标位置
 */
const getHtmlTagLately = (text, position) => {
    const textSplite = [' ', '>', '"', '\'', '.', '\\', "=", ":", "@", "(", ")", "[", "]", "{", "}", ",", "!", "\n", "\r"];
    // 通过前后字符串拼接成选择文本
    let posIndex = position;
    let textMeta = text.substr(posIndex, 1);
    let selectText = "";
    // 前向获取符合要求的字符串
    while (textMeta !== "<") {
        if (textSplite.indexOf(textMeta) === -1) {
            selectText = textMeta + selectText;
        }
        else {
            selectText = "";
        }
        textMeta = text.substr(--posIndex, 1);
    }
    return selectText;
};
exports.getHtmlTagLately = getHtmlTagLately;
//# sourceMappingURL=htmlParseIndex.js.map