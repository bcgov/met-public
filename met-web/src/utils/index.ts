import { EditorState, convertFromRaw } from 'draft-js';

export function hasKey<O>(obj: O, key: PropertyKey): key is keyof O {
    return key in obj;
}

export function getErrorMessage(error: unknown) {
    if (error instanceof Error) return error.message;
    return String(error);
}

export function checkEmail(email: string) {
    const filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return filter.test(email);
}

// For draft-js to convert raw text to editor state
export const getEditorState = (rawTextToConvert: string) => {
    if (!rawTextToConvert) {
        return EditorState.createEmpty();
    }
    const rawContentFromStore = convertFromRaw(JSON.parse(rawTextToConvert));
    return EditorState.createWithContent(rawContentFromStore);
};

export const getNewObjectWithChangedProperties = (originalObject = {}, changedObject = {}) => {
    const filteredEntries = Object.entries(changedObject).filter(([key, value]) => {
        //Shouldn't happend unless changedObject has properites that don't exist on originalObject
        if (!hasKey(originalObject, key)) {
            throw new Error(`Key ${key} not found in savedEngagement`);
        }

        return originalObject[key] !== value;
    });

    return Object.fromEntries(filteredEntries);
};
