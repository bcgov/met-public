import React from 'react';
import { ListItemButton, ListItem } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { Palette } from '../../../styles/Theme';
import { MetHeader4 } from 'components/common';
import { levenshteinDistance } from 'helper';

const THRESHOLD_SIMILARITY_SCORE = 10;
const DEFAULT_HELP_PATH = 'https://www.example.com/help/dashboard';

const UserGuideNav = () => {
    const { pathname } = useLocation();

    const helpPaths: { [key: string]: string } = {
        '/': 'https://www.example.com/help/dashboard',
        '/engagements': 'https://www.example.com/help/engagements',
        '/surveys': 'https://www.example.com/help/surveys',
        '/surveys/create': 'https://www.example.com/help/create-survey',
        '/surveys/1/build': 'https://www.example.com/help/survey-builder',
        '/surveys/1/submit': 'https://www.example.com/help/survey-submission',
        '/surveys/1/comments': 'https://www.example.com/help/survey-comments',
        '/surveys/1/comments/all': 'https://www.example.com/help/all-comments',
        '/surveys/1/submissions/1/review': 'https://www.example.com/help/review-submission',
        '/engagements/create/form': 'https://www.example.com/help/create-engagement',
        '/engagements/1/form': 'https://www.example.com/help/edit-engagement',
        '/engagements/1/view': 'https://www.example.com/help/view-engagement',
        '/engagements/1/comments': 'https://www.example.com/help/engagement-comments',
        '/engagements/1/dashboard': 'https://www.example.com/help/engagement-dashboard',
        '/feedback': 'https://www.example.com/help/feedback',
        '/calendar': 'https://www.example.com/help/calendar',
        '/reporting': 'https://www.example.com/help/reporting',
        '/usermanagement': 'https://www.example.com/help/user-management',
        '/usermanagement/1/details': 'https://www.example.com/help/user-details',
    };

    const handleSimilarityScore = () => {
        let leastDifferenceScore = THRESHOLD_SIMILARITY_SCORE * 10;
        let keyWithLeastDifference = '';

        Object.keys(helpPaths).forEach((key) => {
            const differenceScore = levenshteinDistance(key, pathname);
            if (differenceScore < leastDifferenceScore) {
                leastDifferenceScore = differenceScore;
                keyWithLeastDifference = key;
            }
        });

        if (leastDifferenceScore < THRESHOLD_SIMILARITY_SCORE) {
            return keyWithLeastDifference;
        } else {
            return '';
        }
    };

    const openHelpPage = () => {
        const key = handleSimilarityScore();
        if (!key) {
            window.open(DEFAULT_HELP_PATH, '_blank', 'noopener');
            return;
        }
        const helpPagePath = key ? helpPaths[key] : DEFAULT_HELP_PATH;
        window.open(helpPagePath, '_blank', 'noopener');
    };

    return (
        <ListItem key="user-guide">
            <ListItemButton
                onClick={openHelpPage}
                sx={{
                    '&:hover': {
                        backgroundColor: Palette.hover.light,
                    },
                }}
            >
                <MetHeader4 color="white">User Guide</MetHeader4>
            </ListItemButton>
        </ListItem>
    );
};

export default UserGuideNav;
