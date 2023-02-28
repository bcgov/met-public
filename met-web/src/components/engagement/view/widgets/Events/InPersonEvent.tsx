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
                <Grid item xs={3} marginRight={2}>
                    <MetBody bold>Location:&nbsp;</MetBody>
                </Grid>
                <Grid item xs={8} paddingLeft={2}>
                    <MetBody>{eventItem.location_name}</MetBody>
                </Grid>
            </Grid>
            <Grid container justifyContent={justifyContent} item xs={12}>
                <Grid item xs={3} marginRight={2}>
                    <MetBody bold>Address:&nbsp;</MetBody>
                </Grid>
                <Grid item xs={8} paddingLeft={2}>
                    <MetBody>{eventItem.location_address}</MetBody>
                </Grid>
            </Grid>
            <Grid item container justifyContent={justifyContent} xs={12}>
                <Grid item xs={3} marginRight={2}>
                    <MetBody bold>Date:&nbsp;</MetBody>
                </Grid>
                <Grid item xs={8} paddingLeft={2}>
                    <MetBody>{formatDate(eventItem.start_date, 'MMMM DD, YYYY')}</MetBody>
                </Grid>
            </Grid>
            <Grid container justifyContent={justifyContent} item xs={12}>
                <Grid item xs={3} marginRight={2}>
                    <MetBody bold>Time:&nbsp;</MetBody>
                </Grid>
                <Grid item xs={8} paddingLeft={2}>
                    <MetBody>
                        {`${formatDate(eventItem.start_date, 'h:mm a')} to ${formatDate(
                            eventItem.end_date,
                            'h:mm a',
                        )} PST`}
                    </MetBody>
                </Grid>
            </Grid>
        </>
    );
};

export default InPersonEvent;
