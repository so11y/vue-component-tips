
/**
 * @param text 當前整個文檔
 * @param offsetIndex 当前光标所在位置
 * @returns {boolean}
 */
export const inOutsideTemplateInside = (text: string, offsetIndex: number) => {

    return  offsetIndex >= text.indexOf("<template>") && offsetIndex <= text.lastIndexOf("</template>");
};

/**
* @example  获取htmltag 向前向后获取
* @param {string} line 当前行
* @param {number} character 当前光标位置
*/
export const getHtmlTag = (line: string, character: number) => {

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

/**
 * @example  判断是否在html标签内部
 * @param {string} text 当前整个文档
 * @param {number} character 当前光标位置
 */
export const isInHtmlAttrInside = (text: string, posIndex: number) => {

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

/**
 * @example  判断是否在html标签内部
 * @param {string} text 当前整个文档
 * @param {number} character 当前光标位置
 */
export const getHtmlTagLately = (text: string, position: number) => {

    const textSplite = [' ', '>', '"', '\'', '.', '\\', "=", ":", "@", "(", ")", "[", "]", "{", "}", ",", "!", "\n", "\r"];

    // 通过前后字符串拼接成选择文本
    let posIndex = position;

    let textMeta = text.substr(posIndex, 1);

    let selectText = "";

    // 前向获取符合要求的字符串
    while (textMeta !== "<") {
        if (textSplite.indexOf(textMeta) === -1) {
            selectText = textMeta + selectText;
        } else {
            selectText = "";
        }
        textMeta = text.substr(--posIndex, 1);
    }

    return selectText;
};
