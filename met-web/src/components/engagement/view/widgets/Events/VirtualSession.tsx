import React from 'react';
import { Grid, Link } from '@mui/material';
import { MetBody } from 'components/common';
import { formatDate } from 'components/common/dateHelper';
import { EventProps } from './InPersonEvent';

const VirtualSession = ({ eventItem }: EventProps) => {
    const justifyContent = { xs: 'center', md: 'flex-start' };
    return (
        <>
            <Grid container justifyContent={justifyContent} paddingBottom={0.5} item xs={12}>
                <MetBody>{eventItem.description}</MetBody>
            </Grid>
            <Grid item container justifyContent={justifyContent} xs={12}>
                <Grid item xs={3}>
                    <MetBody bold>Date:&nbsp;</MetBody>
                </Grid>
                <Grid item xs={8}>
                    <MetBody>{formatDate(eventItem.start_date, 'MMMM DD, YYYY')}</MetBody>
                </Grid>
            </Grid>
            <Grid container justifyContent={justifyContent} item xs={12}>
                <Grid item xs={3}>
                    <MetBody bold>Time:&nbsp;</MetBody>
                </Grid>
                <Grid item xs={8}>
                    <MetBody>
                        {`${formatDate(eventItem.start_date, 'h:mm a')} to ${formatDate(
                            eventItem.end_date,
                            'h:mm a',
                        )} PST`}
                    </MetBody>
                </Grid>
            </Grid>
            <Grid container justifyContent={justifyContent} item xs={12} sx={{ whiteSpace: 'pre-line' }}>
                <Link href={`${eventItem.url}`}>{eventItem.url_label}</Link>
            </Grid>
        </>
    );
};

export default VirtualSession;
