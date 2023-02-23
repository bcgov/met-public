import React from 'react';
import { EventItem } from 'models/event';
import { Grid } from '@mui/material';
import { MetBody } from 'components/common';
import { formatDate } from 'components/common/dateHelper';

export interface EventProps {
    eventItem: EventItem;
}

const InPersonEvent = ({ eventItem }: EventProps) => {
    const justifyContent = { xs: 'center', md: 'flex-start' };

    return (
        <>
            <Grid container justifyContent={justifyContent} paddingBottom={1} item xs={12}>
                <MetBody>{eventItem.description}</MetBody>
            </Grid>
            <Grid container justifyContent={justifyContent} item xs={12}>
                <MetBody>Location: {eventItem.location_name}</MetBody>
            </Grid>
            <Grid container justifyContent={justifyContent} item xs={12}>
                <MetBody>Address: {eventItem.location_address}</MetBody>
            </Grid>
            <Grid item container justifyContent={justifyContent} xs={12}>
                <MetBody>Date: {formatDate(eventItem.start_date, 'MMMM DD, YYYY')}</MetBody>
            </Grid>
            <Grid container justifyContent={justifyContent} item xs={12}>
                <MetBody>
                    Time:{' '}
                    {`${formatDate(eventItem.start_date, 'h:mm a')} to ${formatDate(eventItem.end_date, 'h:mm a')} PST`}
                </MetBody>
            </Grid>
        </>
    );
};

export default InPersonEvent;
