import React, { useContext } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { ActionContext } from './ActionContext';
import { formatDate } from '../../common/dateHelper';

const BannerWithoutImage = () => {
    const { savedEngagement } = useContext(ActionContext);

    const { description, name, start_date, end_date } = savedEngagement;
    return (
        <Box
            sx={{
                backgroundColor: '#F2F2F2',
                height: '20em',
                width: '100%',
            }}
        >
            <Grid
                container
                direction="column"
                justifyContent="flex-end"
                alignItems="flex-start"
                height="100%"
                padding="5em 5em 0 3em"
            >
                <Grid item xs={10}>
                    <Typography variant="h3">{name}</Typography>
                    <Typography variant="subtitle2">{description}</Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography variant="subtitle1">
                        {`Engagement dates: ${formatDate(start_date, 'MMMM dd, yyyy')} to ${formatDate(
                            end_date,
                            'MMMM dd, yyyy',
                        )}`}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
};

export default BannerWithoutImage;
