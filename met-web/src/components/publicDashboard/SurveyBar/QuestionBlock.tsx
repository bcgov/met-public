import { Box, List, ListItem, ListItemButton, Stack } from '@mui/material';
import { MetParagraph } from 'components/common';
import React from 'react';
import { SurveyBarData } from '../types';
import { DASHBOARD } from '../constants';

interface QuestionBlockProps {
    data: SurveyBarData[];
    selected: number;
    handleSelected: (data: SurveyBarData) => void;
}

export const QuestionBlock = ({ data, selected, handleSelected }: QuestionBlockProps) => {
    return (
        <Box
            sx={{
                background: DASHBOARD.SURVEY_RESULT.BACKGROUND_COLOR,
                width: '100%',
                height: '450px',
                borderRight: '1px solid #cdcdcd',
            }}
            overflow="auto"
        >
            <List sx={{ paddingTop: '2.5em' }}>
                {data.map((result, index) => (
                    <ListItem key={result.postion}>
                        <ListItemButton
                            onClick={() => handleSelected(result)}
                            sx={{
                                '&:hover': {
                                    backgroundColor: DASHBOARD.SURVEY_RESULT.HOVER_COLOR,
                                },
                            }}
                        >
                            <Stack direction="column">
                                <MetParagraph color={'gray'}>Question {index + 1}</MetParagraph>
                                <MetParagraph
                                    sx={{ fontWeight: 'bold' }}
                                    color={DASHBOARD.SURVEY_RESULT.SELECTED_TEXT_COLOR}
                                >
                                    {result.label}
                                </MetParagraph>
                            </Stack>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};
