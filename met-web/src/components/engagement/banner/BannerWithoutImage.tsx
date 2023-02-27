import React, { useContext } from 'react';
import { Grid, Box, Typography, Stack } from '@mui/material';
import { MetHeader1 } from 'components/common';
import { BannerProps } from '../view/types';
import { EngagementStatusChip } from '../status';
import { EngagementStatus } from 'constants/engagementStatus';
import { Editor } from 'react-draft-wysiwyg';
import { getEditorState } from 'utils';
import dayjs from 'dayjs';
import { ActionContext } from '../view/ActionContext';

const BannerWithoutImage = ({ children }: BannerProps) => {
    return (
        <Box
            sx={{
                // backgroundColor: isDraft ? '#707070' : '#F2F2F2',
                backgroundColor: '#F2F2F2',
                width: '100%',
                position: 'relative',
            }}
        >
            <Box
                sx={{
                    height: '38em',
                    width: '100%',
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default BannerWithoutImage;
