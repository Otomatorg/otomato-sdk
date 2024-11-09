export function getExternalVariable(prototype: String, args: Array<any>) {
    return `{{external.functions.${prototype}(${args})}}`;
};