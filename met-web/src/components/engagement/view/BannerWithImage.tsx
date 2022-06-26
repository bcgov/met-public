import React, { useContext, useState } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { ActionContext } from './ActionContext';
import { formatDate } from '../../common/dateHelper';
import BannerWithoutImage from './BannerWithoutImage';

const BannerWithImage = () => {
    const { savedEngagement } = useContext(ActionContext);

    const { description, name, start_date, end_date, banner_url } = savedEngagement;
    const [imageError, setImageError] = useState(false);

    if (imageError) { 
        return <BannerWithoutImage />;
    }

    return (
        <>
            <Box
                sx={{
                    height: '20em',
                    width: '100%',
                    position: 'relative',
                }}
            >
                <img
                    src={banner_url}
                    style={{
                        objectFit: 'cover',
                        height: '20em',
                        width: '100%',
                    }}
                    onError={(e) => {
                        console.log(e);
                        setImageError(true);
                    }}
                />

                <Grid
                    container
                    direction="column"
                    justifyContent="flex-end"
                    alignItems="flex-start"
                    height="100%"
                    padding="5em 5em 0 3em"
                    sx={{
                        backgroundColor: 'rgba(96, 96, 96, 0.7)',
                        position: 'absolute',
                        top: '0px',
                        left: '0px',
                    }}
                >
                    <Grid item xs={10}>
                        <Typography color="white" variant="h3">
                            {name}
                        </Typography>
                        <Typography color="white" variant="subtitle2" style={{ fontWeight: 600 }}>
                            {description}
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography color="white" variant="subtitle1">
                            {`Engagement dates: ${formatDate(start_date, 'MMMM dd, yyyy')} to ${formatDate(
                                end_date,
                                'MMMM dd, yyyy',
                            )}`}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default BannerWithImage;
