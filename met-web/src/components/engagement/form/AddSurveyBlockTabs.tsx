import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import RichTextEditor from './RichTextEditor';
import { MetTab, MetTabList, MetTabPanel } from './StyledTabComponents';
import { defaultUpcomingText, defaultOpenText, defaultClosedText } from 'constants/submissionStatusText';
import { SubmissionStatusTypes, SUBMISSION_STATUS } from 'constants/engagementStatus';
import { EngagementStatusBlock } from '../../../models/engagementStatusBlock';
import { ActionContext } from './ActionContext';
import { EngagementTabsContext } from './EngagementFormTabs/EngagementTabsContext';

const AddSurveyBlockTabs = ({
    handleChange = (statusBlock: EngagementStatusBlock[]) => {
        /* empty default method  */
    },
}) => {
    // set initial value to upcoming
    const [value, setValue] = useState<SubmissionStatusTypes>(SUBMISSION_STATUS.UPCOMING);

    // get saved engagement details
    const { savedEngagement } = useContext(ActionContext);
    const { upcomingText, setUpcomingText, openText, setOpenText, closedText, setClosedText } =
        useContext(EngagementTabsContext);
    const { status_block } = savedEngagement;

    const blocks = status_block.map((block) => {
        return {
            [block.survey_status]: block.block_text,
        };
    });

    const [initialUpcomingText, setInitialUpcomingText] = useState('');
    const [initialOpenText, setInitialOpenText] = useState('');
    const [initialClosedText, setInitialClosedText] = useState('');

    useEffect(() => {
        console.log('use Effect called');
        console.log('upcomingText', upcomingText);
        setInitialUpcomingText(upcomingText);
        setInitialOpenText(openText);
        setInitialClosedText(closedText);
    }, []);

    const getsavedRichText = () => {
        console.log('getsavedRichText called');
        status_block.forEach((item) => {
            if (item.survey_status === SUBMISSION_STATUS.UPCOMING) {
                setUpcomingText(item.block_text);
            }
            if (item.survey_status === SUBMISSION_STATUS.OPEN) {
                setOpenText(item.block_text);
            }
            if (item.survey_status === SUBMISSION_STATUS.CLOSED) {
                setClosedText(item.block_text);
            }
        });
    };
    useEffect(() => {
        getsavedRichText();
    }, [savedEngagement]);

    // array to pass updated content to engagement context
    const surveyBlockContent = [
        {
            survey_status: SUBMISSION_STATUS.UPCOMING,
            block_text: upcomingText || '',
        },
        {
            survey_status: SUBMISSION_STATUS.OPEN,
            block_text: openText || '',
        },
        {
            survey_status: SUBMISSION_STATUS.CLOSED,
            block_text: closedText || '',
        },
    ];

    // capture changes in richdescription
    const handleStatusBlockContentChange = (newState: string) => {
        console.log('handleStatusBlockContentChange');
        surveyBlockContent.forEach((item) => {
            if (item.survey_status === value && newState) {
                item.block_text = newState;
            }
            return item;
        });
        if (value === SUBMISSION_STATUS.UPCOMING) {
            setUpcomingText(newState);
        }
        if (value === SUBMISSION_STATUS.OPEN) {
            setOpenText(newState);
        }
        if (value === SUBMISSION_STATUS.CLOSED) {
            setClosedText(newState);
        }
        handleChange(surveyBlockContent);
    };

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ marginBottom: '0.25em' }}>
                    <MetTabList
                        onChange={(_event: React.SyntheticEvent, newValue: SubmissionStatusTypes) => {
                            setValue(newValue);
                        }}
                        TabIndicatorProps={{
                            style: { transition: 'none', display: 'none' },
                        }}
                    >
                        <MetTab label="Upcoming" value={SUBMISSION_STATUS.UPCOMING} />
                        <MetTab label="Open" value={SUBMISSION_STATUS.OPEN} />
                        <MetTab label="Closed" value={SUBMISSION_STATUS.CLOSED} />
                    </MetTabList>
                </Box>
                <MetTabPanel value={SUBMISSION_STATUS.UPCOMING}>
                    <RichTextEditor
                        handleEditorStateChange={handleStatusBlockContentChange}
                        initialHTMLText={defaultUpcomingText}
                        initialRawEditorState={initialUpcomingText}
                    />
                </MetTabPanel>
                <MetTabPanel value={SUBMISSION_STATUS.OPEN}>
                    <RichTextEditor
                        handleEditorStateChange={handleStatusBlockContentChange}
                        initialHTMLText={defaultOpenText}
                        initialRawEditorState={initialOpenText}
                    />
                </MetTabPanel>
                <MetTabPanel value={SUBMISSION_STATUS.CLOSED}>
                    <RichTextEditor
                        handleEditorStateChange={handleStatusBlockContentChange}
                        initialHTMLText={defaultClosedText}
                        initialRawEditorState={initialClosedText}
                    />
                </MetTabPanel>
            </TabContext>
        </Box>
    );
};
export default AddSurveyBlockTabs;
