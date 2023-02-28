import React from 'react';
import { EventItem } from 'models/event';
import { Box, Grid } from '@mui/material';
import { MetBody } from 'components/common';
import { formatDate } from 'components/common/dateHelper';

export interface EventProps {
    eventItem: EventItem;
}

const InPersonEvent = ({ eventItem }: EventProps) => {
    const justifyContent = { xs: 'center', md: 'flex-start' };

    return (
        <>
            <Grid container justifyContent={justifyContent} paddingBottom={0.5} item xs={12}>
                <MetBody>{eventItem.description}</MetBody>
            </Grid>
            <Grid container justifyContent={justifyContent} item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                    <MetBody bold>Location: </MetBody> <MetBody>&nbsp;</MetBody> {' ' + eventItem.location_name}
                </Box>
            </Grid>
            <Grid container justifyContent={justifyContent} item xs={12}>
                <MetBody bold>Address: </MetBody>
                <MetBody>&nbsp;</MetBody> <MetBody>{' ' + eventItem.location_address} </MetBody>
            </Grid>
            <Grid item container justifyContent={justifyContent} xs={12}>
                <MetBody sx={{ display: 'flex', alignItems: 'baseline' }}>
                    <MetBody bold>Date: </MetBody>
                    <MetBody>&nbsp;</MetBody> {formatDate(eventItem.start_date, 'MMMM DD, YYYY')}
                </MetBody>
            </Grid>
            <Grid container justifyContent={justifyContent} item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                    <MetBody bold>Time: </MetBody>
                    <MetBody>&nbsp;</MetBody>
                    <MetBody>
                        {`${formatDate(eventItem.start_date, 'h:mm a')} to ${formatDate(
                            eventItem.end_date,
                            'h:mm a',
                        )} PST`}
                    </MetBody>
                </Box>
            </Grid>
        </>
    );
};

export default InPersonEvent;
