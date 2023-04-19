import { Box, List, ListItem, ListItemButton } from '@mui/material';
import { MetHeader4 } from 'components/common';
import React from 'react';
import { Palette } from 'styles/Theme';
import { SurveyBarData } from '../types';

interface QuestionBlockProps {
    data: SurveyBarData[];
    selected: number;
    handleSelected: (data: SurveyBarData) => void;
}

export const QuestionBlock = ({ data, selected, handleSelected }: QuestionBlockProps) => {
    return (
        <Box sx={{ background: Palette.primary.main }}>
            <List sx={{ paddingTop: '2.5em' }}>
                {data.map((result) => (
                    <ListItem key={result.key}>
                        <ListItemButton
                            onClick={() => handleSelected(result)}
                            sx={{
                                '&:hover': {
                                    backgroundColor: Palette.hover.light,
                                },
                            }}
                        >
                            <MetHeader4 color={selected === result.key ? Palette.secondary.main : 'white'} bold>
                                {result.label}
                            </MetHeader4>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};
