import React from 'react';
import { Grid } from '@mui/material';
import { formatDate } from 'components/common/dateHelper';
import { EventProps } from './InPersonEvent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faClock } from '@fortawesome/pro-regular-svg-icons';
import { Palette } from 'styles/Theme';
import { BodyText } from 'components/common/Typography/Body';
import { Button } from 'components/common/Input';

const VirtualSession = ({ eventItem }: EventProps) => {
    // Define styles
    const containerStyles = {
        alignItems: 'center',
        paddingLeft: '0 !important',
    };
    const fontStyles = {
        display: 'flex',
        marginLeft: 'auto',
        marginRight: '14px',
        color: Palette.text.primary,
        fontSize: '24px',
        width: '24px',
        justifyContent: 'center',
    };
    const pStyles = {
        margin: 0,
        color: Palette.gray[100],
    };

    // Define time/date
    const startDate = formatDate(eventItem.start_date, 'DD MMM, YYYY');
    const startTime = formatDate(eventItem.start_date, 'h:mm a');
    const endTime = formatDate(eventItem.end_date, 'h:mm a');

    return (
        <>
            <Grid item container justifyContent="flex-start" xs={12} sx={containerStyles}>
                <Grid item xs={0} sm={1}>
                    <FontAwesomeIcon icon={faCalendarDays} style={fontStyles} />
                </Grid>
                <Grid item xs={6} md={3} xl={2}>
                    <strong>Date</strong>
                </Grid>
                <Grid item xs={12} md={8} xl={9}>
                    <BodyText style={pStyles}>{startDate}</BodyText>
                </Grid>
            </Grid>
            <Grid container justifyContent="flex-start" item xs={12} sx={containerStyles}>
                <Grid item xs={0} sm={1}>
                    <FontAwesomeIcon icon={faClock} style={fontStyles} />
                </Grid>
                <Grid item xs={6} md={3} xl={2}>
                    <strong>Time</strong>
                </Grid>
                <Grid item xs={12} md={8} xl={9}>
                    <BodyText style={pStyles}>{`${startTime} to ${endTime} PT`}</BodyText>
                </Grid>
            </Grid>
            <Grid container justifyContent="flex-start" item xs={12} sx={containerStyles}>
                <Button variant="primary" size="large" href={eventItem.url}>
                    {eventItem.url_label}
                </Button>
            </Grid>
        </>
    );
};

export default VirtualSession;
