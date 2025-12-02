const isInvalidSelectorError = (error: unknown): error is Error =>
    error instanceof Error && error.message.includes('is not a valid selector');

const createEmptyNodeList = () => document.createElement('div').querySelectorAll('met-empty-selector');

const swallowSelectorErrors = <T extends (...args: never[]) => unknown>(fn: T, fallback: () => ReturnType<T>): T => {
    return function patched(this: unknown, ...args: Parameters<T>): ReturnType<T> {
        try {
            return fn.apply(this, args) as ReturnType<T>;
        } catch (error) {
            if (isInvalidSelectorError(error)) {
                return fallback();
            }
            throw error;
        }
    } as T;
};

const patchJsdomSelectors = () => {
    const elementProto = Element.prototype as Element & {
        querySelectorAll(selector: string): NodeListOf<Element>;
    };
    const documentProto = Document.prototype as Document & {
        querySelectorAll(selector: string): NodeListOf<Element>;
    };

    elementProto.matches = swallowSelectorErrors(elementProto.matches, () => false);
    elementProto.querySelector = swallowSelectorErrors(elementProto.querySelector, () => null);
    elementProto.querySelectorAll = swallowSelectorErrors(elementProto.querySelectorAll, createEmptyNodeList);
    documentProto.querySelector = swallowSelectorErrors(documentProto.querySelector, () => null);
    documentProto.querySelectorAll = swallowSelectorErrors(documentProto.querySelectorAll, createEmptyNodeList);
};

patchJsdomSelectors();
