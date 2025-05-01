import React from 'react';
import { EventItem } from 'models/event';
import { Grid } from '@mui/material';
import { formatDate } from 'components/common/dateHelper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faCalendarDays, faClock } from '@fortawesome/pro-regular-svg-icons';
import { Palette } from 'styles/Theme';
import { BodyText } from 'components/common/Typography/Body';

export interface EventProps {
    eventItem: EventItem;
}

const InPersonEvent = ({ eventItem }: EventProps) => {
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
        color: Palette.text.primary,
    };

    // Parse the address into multiple lines
    const parsedAddress = eventItem.location_address?.split(',') || [''];
    const finalAddress = parsedAddress.every((val) => val === '')
        ? parsedAddress
        : parsedAddress.map((line, index) => (parsedAddress.length - 1 === index ? line : line + ','));

    // Create start and end time/date
    const startDate = formatDate(eventItem.start_date, 'DD MMM, YYYY');
    const startTime = formatDate(eventItem.start_date, 'h:mm a');
    const endTime = formatDate(eventItem.end_date, 'h:mm a');

    return (
        <>
            <Grid container justifyContent="flex-start" xs={12} sx={containerStyles} marginBottom={2}>
                <Grid item xs={0} sm={1}>
                    <FontAwesomeIcon icon={faLocationDot} style={fontStyles} />
                </Grid>
                <Grid item xs={6} md={3} xl={2}>
                    <strong>Location</strong>
                </Grid>
                <Grid item xs={12} md={8} xl={9}>
                    <BodyText style={{ ...pStyles, marginBottom: 'inherit' }}>{eventItem.location_name}</BodyText>
                </Grid>
                <Grid item xs={0} md={1}></Grid>
                <Grid item xs={6} md={3} xl={2} alignSelf="flex-start">
                    <strong>Address</strong>
                </Grid>
                <Grid item xs={12} md={8} xl={9}>
                    {finalAddress.map((aLine) => (
                        <p key={aLine} style={pStyles}>
                            {aLine ?? ''}
                        </p>
                    ))}
                </Grid>
            </Grid>
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
        </>
    );
};

export default InPersonEvent;
