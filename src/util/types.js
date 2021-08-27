"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmpty = exports.isUndefined = void 0;
const isUndefined = (opt) => {
    return opt === undefined;
};
exports.isUndefined = isUndefined;
const isEmpty = (opt) => {
    if (Array.isArray(opt) && opt.length) {
        return true;
    }
    return !(0, exports.isUndefined)(opt) || !opt;
};
exports.isEmpty = isEmpty;
//# sourceMappingURL=types.js.map