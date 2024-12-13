export const pick = <T extends Record<string, unknown>, K extends keyof T>(
    obj: T,
    keys: K[]
): Partial<T> => {
    const finalObj: Partial<T> = {};

    keys.forEach((key) => {
        if (obj && Object.hasOwnProperty.call(obj, key)) {
            finalObj[key] = obj[key];
        }
    });
    return finalObj;
};
