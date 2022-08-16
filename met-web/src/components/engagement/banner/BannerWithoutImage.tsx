import React from 'react';
import { Grid, Box, Typography, Stack } from '@mui/material';
import { formatDate } from '../../common/dateHelper';
import { BannerProps } from '../view/types';
import { EngagementStatusChip } from '../status';
import { getEditorState } from 'utils';
import { Editor } from 'react-draft-wysiwyg';

const BannerWithoutImage = ({ savedEngagement }: BannerProps) => {
    const { rich_description, name, start_date, end_date, submission_status } = savedEngagement;
    return (
        <Box
            sx={{
                backgroundColor: '#F2F2F2',
                width: '100%',
            }}
        >
            <Grid
                container
                direction="row"
                justifyContent="flex-end"
                alignItems="flex-start"
                height="100%"
                padding="5em 5em 3em 3em"
            >
                <Grid item xs={12}>
                    <Typography variant="h3">{name}</Typography>
                    <Editor editorState={getEditorState(rich_description)} readOnly={true} toolbarHidden />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="subtitle1">
                        {`Engagement dates: ${formatDate(start_date, 'MMMM dd, yyyy')} to ${formatDate(
                            end_date,
                            'MMMM dd, yyyy',
                        )}`}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Stack direction="row" spacing={1}>
                        <Typography variant="subtitle1">status:</Typography>
                        <EngagementStatusChip submissionStatus={submission_status} />
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default BannerWithoutImage;
