import React from 'react';
import { ListItemButton, ListItem } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { Palette } from '../../../styles/Theme';
import { MetHeader4 } from 'components/common';
import { levenshteinDistance } from 'helper';

const THRESHOLD_SIMILARITY_SCORE = 10;
const HELP_URL = 'https://bcgov.github.io/met-guide';

const UserGuideNav = () => {
    const { pathname } = useLocation();

    const helpPaths: { [key: string]: string } = {
        '/': HELP_URL,
        '/engagements': `${HELP_URL}/posts/engagement-listing/`,
        '/surveys': `${HELP_URL}/posts/survey-listing/`,
        '/surveys/create': `${HELP_URL}/posts/create-survey/`,
        '/surveys/1/build': `${HELP_URL}/posts/survey-builder/`,
        '/surveys/1/submit': `${HELP_URL}/posts/survey-builder/`,
        '/surveys/1/comments': `${HELP_URL}/posts/comment-review/`,
        '/surveys/1/comments/all': `${HELP_URL}/posts/comment-review/`,
        '/surveys/1/submissions/1/review': `${HELP_URL}/posts/comment-review/`,
        '/engagements/create/form': `${HELP_URL}/posts/create-engagement/`,
        '/engagements/1/form': `${HELP_URL}/posts/edit-engagement/`,
        '/engagements/1/view': `${HELP_URL}/posts/preview-engagement/`,
        '/engagements/1/comments': `${HELP_URL}/posts/preview-engagement/`,
        '/engagements/1/dashboard': `${HELP_URL}/posts/manage-engagement/`,
        '/feedback': `${HELP_URL}/posts/feedback-tool/`,
        '/calendar': HELP_URL,
        '/reporting': `${HELP_URL}/posts/report/`,
        '/usermanagement': `${HELP_URL}/posts/user-management/`,
        '/usermanagement/1/details': `${HELP_URL}/posts/user-details/`,
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
            window.open(HELP_URL, '_blank', 'noopener');
            return;
        }
        const helpPagePath = key ? helpPaths[key] : HELP_URL;
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
