"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.where = exports.isTrue = void 0;
const isTrue = (opt) => {
    return opt;
};
exports.isTrue = isTrue;
const where = (is, cb1, cb2) => {
    return (0, exports.isTrue)(is) ? cb1() : cb2();
};
exports.where = where;
//# sourceMappingURL=functionl.js.map