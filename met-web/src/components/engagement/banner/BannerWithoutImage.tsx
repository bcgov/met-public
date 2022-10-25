import React from 'react';
import { Grid, Box, Typography, Stack } from '@mui/material';
import { MetHeader1 } from 'components/common';
import { formatDate } from '../../common/dateHelper';
import { BannerProps } from '../view/types';
import { EngagementStatusChip } from '../status';
import { EngagementStatus } from 'constants/engagementStatus';
import { Editor } from 'react-draft-wysiwyg';
import { getEditorState } from 'utils';

const BannerWithoutImage = ({ savedEngagement }: BannerProps) => {
    const { rich_description, name, scheduled_date, end_date, submission_status } = savedEngagement;
    const isDraft = savedEngagement.status_id === EngagementStatus.Draft;
    const dateFormat = 'MMM dd, yyyy';

    const EngagementDate = `Engagement dates: ${formatDate(scheduled_date, dateFormat)} to ${formatDate(
        end_date,
        dateFormat,
    )}`;

    return (
        <Box
            sx={{
                backgroundColor: isDraft ? '#707070' : '#F2F2F2',
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
                <Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    height="100%"
                    sx={{
                        position: 'absolute',
                        top: '0px',
                        left: '0px',
                    }}
                >
                    <Grid
                        item
                        lg={6}
                        sm={12}
                        container
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        sx={{
                            backgroundColor: 'rgba(242, 242, 242, 0.95)',
                            padding: '1em',
                            margin: '1em',
                            maxWidth: '90%',
                        }}
                        m={{ lg: '3em 5em 0 3em', md: '3em', sm: '1em' }}
                        rowSpacing={2}
                    >
                        <Grid item xs={12} sx={{ maxHeight: '20em', overflowY: 'auto', overflowX: 'auto' }}>
                            <MetHeader1>{name}</MetHeader1>
                            <Editor editorState={getEditorState(rich_description)} readOnly={true} toolbarHidden />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography sx={{ fontWeight: 'bold' }} variant="subtitle1" color="black">
                                {EngagementDate}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Stack direction="row" spacing={1}>
                                <Typography sx={{ fontWeight: 800 }} variant="subtitle1">
                                    Status:
                                </Typography>
                                <EngagementStatusChip submissionStatus={submission_status} />
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default BannerWithoutImage;
