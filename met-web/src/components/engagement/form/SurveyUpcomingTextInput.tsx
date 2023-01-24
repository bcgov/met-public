import React, { useContext, useState } from 'react';
import { defaultUpcomingText } from 'constants/submissionStatusText';
import RichTextEditor from './RichTextEditor';
import { EngagementTabsContext } from './EngagementFormTabs/EngagementTabsContext';

export const SurveyUpcomingTextInput = () => {
    const { surveyBlockText, setSurveyBlockText } = useContext(EngagementTabsContext);
    const initialUpcomingTextState = useState(surveyBlockText.Upcoming);

    // capture changes in richdescription
    const handleStatusBlockContentChange = (newState: string) => {
        setSurveyBlockText((prevSurveyBlockText) => ({
            ...prevSurveyBlockText,
            Upcoming: newState,
        }));
    };

    return (
        <RichTextEditor
            handleEditorStateChange={handleStatusBlockContentChange}
            initialHTMLText={defaultUpcomingText}
            initialRawEditorState={initialUpcomingTextState[0]}
        />
    );
};
