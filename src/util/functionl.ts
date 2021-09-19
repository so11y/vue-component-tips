export const isTrue = (opt: any): opt is boolean => {
    return opt;
};

export const where = <T>(is: any, cb1: () => T, cb2: () => T): T => {

    return isTrue(is) ? cb1() : cb2();
};
