import React, { useContext, useState } from 'react';
import { defaultOpenText } from 'constants/submissionStatusText';
import RichTextEditor from './RichTextEditor';
import { EngagementTabsContext } from './EngagementFormTabs/EngagementTabsContext';

export const SurveyOpenTextInput = () => {
    const { surveyBlockText, setSurveyBlockText } = useContext(EngagementTabsContext);
    const initialOpenTextState = useState(surveyBlockText.Open);

    // capture changes in richdescription
    const handleStatusBlockContentChange = (newState: string) => {
        setSurveyBlockText((prevSurveyBlockText) => ({
            ...prevSurveyBlockText,
            Open: newState,
        }));
    };

    return (
        <RichTextEditor
            handleEditorStateChange={handleStatusBlockContentChange}
            initialHTMLText={defaultOpenText}
            initialRawEditorState={initialOpenTextState[0]}
        />
    );
};
