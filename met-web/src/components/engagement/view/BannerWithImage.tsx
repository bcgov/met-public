import React, { useContext } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { ActionContext } from './ActionContext';
import { formatDate } from '../../common/dateHelper';

const BannerWithImage = () => {
    //Just a place holder image
    const imageLink =
        'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?ixlib=rb-1.2.1&w=1200&fit=crop&q=60&fm=jpg&crop=faces%2Cedges&cs=tinysrgb&auto=format&h=630&mark-w=64&mark-align=top%2Cleft&mark-pad=50&blend-mode=normal&blend-alpha=10&blend-w=1&mark=https%3A%2F%2Fimages.unsplash.com%2Fopengraph%2Flogo.png&blend=000000';
    const imageHeight = '20em';

    const { savedEngagement } = useContext(ActionContext);

    const { description, name, start_date, end_date } = savedEngagement;
    return (
        <Box
            sx={{
                height: imageHeight,
                width: '100%',
                background: ` url(${imageLink}) no-repeat`,
                backgroundSize: `cover`,
            }}
        >
            <Box
                sx={{
                    backgroundColor: 'rgba(96, 96, 96, 0.7)',
                    height: '100%',
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
                        <Typography color="white" variant="h3">
                            {name}
                        </Typography>
                        <Typography color="white" variant="subtitle2">
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
        </Box>
    );
};

export default BannerWithImage;
