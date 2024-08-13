import React from 'react';
import { Grid } from '@mui/material';
import { formatDate } from 'components/common/dateHelper';
import { EventProps } from './InPersonEvent';
import { Link } from 'components/common/Navigation';
import { BodyText } from 'components/common/Typography';

const VirtualSession = ({ eventItem }: EventProps) => {
    const justifyContent = { xs: 'center', md: 'flex-start' };
    return (
        <>
            <Grid container justifyContent={justifyContent} paddingBottom={0.5} item xs={12}>
                <BodyText>{eventItem.description}</BodyText>
            </Grid>
            <Grid item container justifyContent={justifyContent} xs={12}>
                <Grid item xs={3} marginRight={2}>
                    <BodyText bold>Date:&nbsp;</BodyText>
                </Grid>
                <Grid item xs={8} paddingLeft={2}>
                    <BodyText>{formatDate(eventItem.start_date, 'MMMM DD, YYYY')}</BodyText>
                </Grid>
            </Grid>
            <Grid container justifyContent={justifyContent} item xs={12}>
                <Grid item xs={3} marginRight={2}>
                    <BodyText bold>Time:&nbsp;</BodyText>
                </Grid>
                <Grid item xs={8} paddingLeft={2}>
                    <BodyText>
                        {`${formatDate(eventItem.start_date, 'h:mm a')} to ${formatDate(
                            eventItem.end_date,
                            'h:mm a',
                        )} PT`}
                    </BodyText>
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
