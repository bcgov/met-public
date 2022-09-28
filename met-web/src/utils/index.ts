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
