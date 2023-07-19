import React, { useContext, useState } from 'react';
import { defaultUpcomingText } from 'constants/submissionStatusText';
import RichTextEditor from 'components/common/RichTextEditor';
import { EngagementTabsContext } from '../EngagementTabsContext';

export const SurveyUpcomingTextInput = () => {
    const { surveyBlockText, setSurveyBlockText } = useContext(EngagementTabsContext);
    const initialUpcomingTextState = useState(surveyBlockText.Upcoming);

    const handleSurveyBlockTextChange = (newState: string) => {
        setSurveyBlockText((prevSurveyBlockText) => ({
            ...prevSurveyBlockText,
            Upcoming: newState,
        }));
    };

    return (
        <RichTextEditor
            handleEditorStateChange={handleSurveyBlockTextChange}
            initialHTMLText={defaultUpcomingText}
            initialRawEditorState={initialUpcomingTextState[0]}
        />
    );
};
