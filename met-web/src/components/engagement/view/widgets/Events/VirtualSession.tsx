import React from 'react';
import { Grid, Link } from '@mui/material';
import { MetBodyOld } from 'components/common';
import { formatDate } from 'components/common/dateHelper';
import { EventProps } from './InPersonEvent';

const VirtualSession = ({ eventItem }: EventProps) => {
    const justifyContent = { xs: 'center', md: 'flex-start' };
    return (
        <>
            <Grid container justifyContent={justifyContent} paddingBottom={0.5} item xs={12}>
                <MetBodyOld>{eventItem.description}</MetBodyOld>
            </Grid>
            <Grid item container justifyContent={justifyContent} xs={12}>
                <Grid item xs={3} marginRight={2}>
                    <MetBodyOld bold>Date:&nbsp;</MetBodyOld>
                </Grid>
                <Grid item xs={8} paddingLeft={2}>
                    <MetBodyOld>{formatDate(eventItem.start_date, 'MMMM DD, YYYY')}</MetBodyOld>
                </Grid>
            </Grid>
            <Grid container justifyContent={justifyContent} item xs={12}>
                <Grid item xs={3} marginRight={2}>
                    <MetBodyOld bold>Time:&nbsp;</MetBodyOld>
                </Grid>
                <Grid item xs={8} paddingLeft={2}>
                    <MetBodyOld>
                        {`${formatDate(eventItem.start_date, 'h:mm a')} to ${formatDate(
                            eventItem.end_date,
                            'h:mm a',
                        )} PT`}
                    </MetBodyOld>
                </Grid>
            </Grid>
            <Grid container justifyContent={justifyContent} item xs={12} sx={{ whiteSpace: 'pre-line' }}>
                <Link target="_blank" href={`${eventItem.url}`}>
                    {eventItem.url_label}
                </Link>
            </Grid>
        </>
    );
};

export default VirtualSession;
