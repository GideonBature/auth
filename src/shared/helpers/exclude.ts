export function exclude<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    const clonedObj = { ...obj };

    keys.forEach((key) => {
        delete clonedObj[key];
    });

    return clonedObj;
}
