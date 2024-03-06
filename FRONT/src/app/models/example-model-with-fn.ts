export interface ExampleModelWithFn {
    Nombre: string;
    Edad: number;
    Concat(callbackFn: concatCallBackFn, args: paramCallBackFn[]): void;
}

export type paramCallBackFn = string | number | null
export type concatCallBackFn = (par1: number, par2: paramCallBackFn) => void

export type consoleLogObjectToShow = {
    [propertyName: string] : paramCallBackFn
}