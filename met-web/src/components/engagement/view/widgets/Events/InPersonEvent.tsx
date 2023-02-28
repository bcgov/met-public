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
            <Grid container justifyContent={justifyContent} paddingBottom={0.5} item xs={12}>
                <MetBody>{eventItem.description}</MetBody>
            </Grid>
            <Grid container justifyContent={justifyContent} item xs={12}>
                <MetBody bold>Location:&nbsp;</MetBody>
                <MetBody>{eventItem.location_name}</MetBody>
            </Grid>
            <Grid container justifyContent={justifyContent} item xs={12}>
                <MetBody bold>Address:&nbsp;</MetBody>
                <MetBody>{eventItem.location_address}</MetBody>
            </Grid>
            <Grid item container justifyContent={justifyContent} xs={12}>
                <MetBody sx={{ display: 'flex', alignItems: 'baseline' }}>
                    <MetBody bold>Date:&nbsp;</MetBody>
                    <MetBody>{formatDate(eventItem.start_date, 'MMMM DD, YYYY')}</MetBody>
                </MetBody>
            </Grid>
            <Grid container justifyContent={justifyContent} item xs={12}>
                <MetBody bold>Time:&nbsp;</MetBody>
                <MetBody>
                    {`${formatDate(eventItem.start_date, 'h:mm a')} to ${formatDate(eventItem.end_date, 'h:mm a')} PST`}
                </MetBody>
            </Grid>
        </>
    );
};

export default InPersonEvent;
