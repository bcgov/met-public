import React, { useState } from 'react';
import { Grid, Box, Typography, Stack, useMediaQuery, Theme } from '@mui/material';
import { formatDate } from '../../common/dateHelper';
import BannerWithoutImage from './BannerWithoutImage';
import { BannerProps } from '../view/types';
import { EngagementStatusChip } from '../status';
import { Editor } from 'react-draft-wysiwyg';
import { getEditorState } from 'utils';

const BannerWithImage = ({ savedEngagement, children }: BannerProps) => {
    const { name, start_date, end_date, banner_url, submission_status, rich_description } = savedEngagement;
    const [imageError, setImageError] = useState(false);
    const isSmallscreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));

    if (imageError) {
        return <BannerWithoutImage savedEngagement={savedEngagement} />;
    }

    return (
        <>
            <Box
                sx={{
                    height: '38em',
                    width: '100%',
                    position: 'relative',
                }}
            >
                <img
                    src={banner_url}
                    style={{
                        objectFit: 'cover',
                        height: '38em',
                        width: '100%',
                    }}
                    onError={(_e) => {
                        setImageError(true);
                    }}
                />

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
                            <Typography variant={isSmallscreen ? 'h3' : 'h4'} color="black">
                                {name}
                            </Typography>
                            <Editor
                                editorState={getEditorState(rich_description)}
                                readOnly={true}
                                onChange={() => {
                                    //do nothing because this is read only
                                }}
                                toolbarHidden
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" style={{ fontWeight: 600 }} color="black">
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
                        {children}
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default BannerWithImage;
