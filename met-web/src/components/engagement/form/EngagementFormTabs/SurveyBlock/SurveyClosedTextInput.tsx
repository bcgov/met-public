import React, { useContext, useState } from 'react';
import { defaultClosedText } from 'constants/submissionStatusText';
import RichTextEditor from 'components/common/RichTextEditor';
import { EngagementTabsContext } from '../EngagementTabsContext';

export const SurveyClosedTextInput = () => {
    const { setSurveyBlockText, surveyBlockText } = useContext(EngagementTabsContext);
    const initialClosedTextState = useState(surveyBlockText.Closed);

    const handleSurveyBlockTextChange = (newState: string) => {
        setSurveyBlockText((prevSurveyBlockText) => ({
            ...prevSurveyBlockText,
            Closed: newState,
        }));
    };

    return (
        <RichTextEditor
            handleEditorStateChange={handleSurveyBlockTextChange}
            initialHTMLText={defaultClosedText}
            initialRawEditorState={initialClosedTextState[0]}
        />
    );
};
