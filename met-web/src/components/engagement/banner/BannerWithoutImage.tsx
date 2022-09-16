import React from 'react';
import { Grid, Box, Typography, Stack, useMediaQuery, Theme } from '@mui/material';
import { MetHeader1, MetHeader2, MetHeader3 } from 'components/common';
import { formatDate } from '../../common/dateHelper';
import { BannerProps } from '../view/types';
import { EngagementStatusChip } from '../status';
import { EngagementStatus } from 'constants/engagementStatus';
import { Editor } from 'react-draft-wysiwyg';
import { getEditorState } from 'utils';

const BannerWithoutImage = ({ savedEngagement }: BannerProps) => {
    const { rich_description, name, start_date, end_date, submission_status } = savedEngagement;
    const isDraft = savedEngagement.status_id === EngagementStatus.Draft;
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const EngagementDate = `Engagement dates: ${formatDate(start_date, 'MMMM dd, yyyy')} to ${formatDate(
        end_date,
        'MMMM dd, yyyy',
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
                            {isSmallScreen ? (
                                <MetHeader2 sx={{ mb: 1 }}>{name}</MetHeader2>
                            ) : (
                                <MetHeader1 sx={{ mb: 1 }}>{name}</MetHeader1>
                            )}

                            <Editor editorState={getEditorState(rich_description)} readOnly={true} toolbarHidden />
                        </Grid>
                        <Grid item xs={12}>
                            {isSmallScreen ? (
                                <MetHeader3 style={{ fontWeight: 600 }} color="black">
                                    {EngagementDate}
                                </MetHeader3>
                            ) : (
                                <MetHeader2 style={{ fontWeight: 600 }} color="black">
                                    {EngagementDate}
                                </MetHeader2>
                            )}
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
