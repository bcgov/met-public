import { ContentState, EditorState, convertFromHTML, convertFromRaw } from 'draft-js';

// For draft-js to convert raw text to editor state
export const getEditorStateFromRaw = (rawTextToConvert: string) => {
    if (!rawTextToConvert) {
        return EditorState.createEmpty();
    }
    const rawContentFromStore = convertFromRaw(JSON.parse(rawTextToConvert));
    return EditorState.createWithContent(rawContentFromStore);
};

// For draft-js to convert html to editor state
export const getEditorStateFromHtml = (htmlToConvert: string) => {
    const blocksFromHTML = convertFromHTML(htmlToConvert);
    const contentState = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
    return EditorState.createWithContent(contentState);
};
