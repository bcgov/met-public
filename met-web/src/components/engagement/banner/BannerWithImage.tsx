import React, { useState } from 'react';
import { Grid, Box, Typography, Stack } from '@mui/material';
import { formatDate } from '../../common/dateHelper';
import BannerWithoutImage from './BannerWithoutImage';
import { EngagementBannerProps } from '../view/types';
import { EngagementStatusChip } from '../status';

const BannerWithImage = ({ savedEngagement, children }: EngagementBannerProps) => {
    const { description, name, start_date, end_date, banner_url, engagement_status } = savedEngagement;
    const [imageError, setImageError] = useState(false);

    if (imageError) {
        return <BannerWithoutImage savedEngagement={savedEngagement} />;
    }

    return (
        <>
            <Box
                sx={{
                    height: '30em',
                    width: '100%',
                    position: 'relative',
                }}
            >
                <img
                    src={banner_url}
                    style={{
                        objectFit: 'cover',
                        height: '30em',
                        width: '100%',
                    }}
                    onError={(e) => {
                        console.log(e);
                        setImageError(true);
                    }}
                />

                <Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    height="100%"
                    padding="5em 5em 0 3em"
                    sx={{
                        position: 'absolute',
                        top: '0px',
                        left: '0px',
                    }}
                >
                    <Grid
                        item
                        xs={6}
                        container
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        sx={{
                            backgroundColor: 'rgba(242, 242, 242, 0.85)',
                            padding: '1em',
                        }}
                        rowSpacing={2}
                    >
                        <Grid item xs={12}>
                            <Typography variant="h3" style={{ fontWeight: 500 }}>
                                {name}
                            </Typography>
                            <Typography variant="subtitle2" style={{ fontWeight: 600 }}>
                                {description}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" style={{ fontWeight: 600 }}>
                                {`Engagement dates: ${formatDate(start_date, 'MMMM dd, yyyy')} to ${formatDate(
                                    end_date,
                                    'MMMM dd, yyyy',
                                )}`}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Stack direction="row" spacing={1}>
                                <Typography variant="subtitle1">status:</Typography>
                                <EngagementStatusChip status={engagement_status.status_name} />
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
