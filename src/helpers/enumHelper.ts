export function getKeyByValue(object: { [x: string]: any; }, value: any): string {
    const key = Object.keys(object).find(key => object[key] === value);

    if (!key) {
        throw new Error('Invalid value');
    }

    return key;
}