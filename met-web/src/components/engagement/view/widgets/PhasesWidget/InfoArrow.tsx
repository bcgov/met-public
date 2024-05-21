import React from 'react';
import { MetSmallTextOld } from 'components/common';
import { Stack, Box } from '@mui/material';
import { INFO_ARROW } from 'models/engagementPhases';

export const InfoArrow = () => {
    return (
        <Stack direction="row" alignItems={'stretch'}>
            <Box
                sx={{
                    background: INFO_ARROW.backgroundColor,
                    padding: '0.25em 1em',
                }}
            >
                <MetSmallTextOld color="white">
                    Engagement and consensus-seeking with participating First Nations occur at each stage of the
                    process, supported by dispute resolution at certain stages if required.
                </MetSmallTextOld>
            </Box>
            <Box
                sx={{
                    clipPath: 'polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 0 50%, 0% 0%)',
                    background: INFO_ARROW.backgroundColor,
                    width: '3em',
                    padding: '0.25em 1em',
                    minHeight: '1.6em',
                }}
            ></Box>
        </Stack>
    );
};
