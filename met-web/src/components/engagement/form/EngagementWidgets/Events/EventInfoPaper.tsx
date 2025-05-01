import React, { useContext } from 'react';
import { MetWidgetPaper } from 'components/common';
import { Grid, IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripDotsVertical } from '@fortawesome/pro-solid-svg-icons/faGripDotsVertical';
import { faCircleXmark } from '@fortawesome/pro-regular-svg-icons/faCircleXmark';
import { faPen } from '@fortawesome/pro-regular-svg-icons/faPen';
import { When } from 'react-if';
import { Event } from 'models/event';
import { formatDate } from 'components/common/dateHelper';
import { EventsContext } from './EventsContext';
import { BodyText } from 'components/common/Typography';

export interface EventInfoPaperProps {
    event: Event;
    removeEvent: (_eventId: number) => void;
}

const EventInfoPaper = ({ event, removeEvent, ...rest }: EventInfoPaperProps) => {
    const eventItem = event.event_items[0];
    const { handleChangeEventToEdit, handleEventDrawerOpen } = useContext(EventsContext);

    return (
        <MetWidgetPaper elevation={1} {...rest}>
            <Grid container direction="row" alignItems={'flex-start'} justifyContent="flex-start">
                <Grid item xs={1}>
                    <IconButton sx={{ padding: 0, margin: 0 }} color="inherit" aria-label="drag-indicator">
                        <FontAwesomeIcon icon={faGripDotsVertical} style={{ fontSize: '24px', margin: '0px 4px' }} />
                    </IconButton>
                </Grid>

                <Grid
                    item
                    xs={9.5}
                    container
                    direction="row"
                    alignItems={'flex-start'}
                    justifyContent="flex-start"
                    spacing={1}
                >
                    <When condition={!!eventItem.event_name}>
                        <Grid item xs={3}>
                            <BodyText>Name:</BodyText>
                        </Grid>
                        <Grid item xs={9}>
                            <BodyText overflow="hidden" textOverflow={'ellipsis'} whiteSpace="nowrap">
                                {eventItem.event_name}
                            </BodyText>
                        </Grid>
                    </When>

                    <When condition={!!eventItem.description}>
                        <Grid item xs={3}>
                            <BodyText>Description:</BodyText>
                        </Grid>
                        <Grid item xs={9}>
                            <BodyText overflow="hidden" textOverflow={'ellipsis'} whiteSpace="nowrap">
                                {eventItem.description}
                            </BodyText>
                        </Grid>
                    </When>

                    <Grid item xs={3}>
                        <BodyText>Location:</BodyText>
                    </Grid>
                    <Grid item xs={9}>
                        <BodyText overflow="hidden" textOverflow={'ellipsis'} whiteSpace="nowrap">
                            {eventItem.location_name}
                        </BodyText>
                    </Grid>
                    <Grid item xs={3}>
                        <BodyText>Address:</BodyText>
                    </Grid>

                    <Grid item xs={9}>
                        <BodyText overflow="hidden" textOverflow={'ellipsis'} whiteSpace="nowrap">
                            {eventItem.location_address}
                        </BodyText>
                    </Grid>

                    <Grid item xs={3}>
                        <BodyText>Date:</BodyText>
                    </Grid>
                    <Grid item xs={9}>
                        <BodyText overflow="hidden" textOverflow={'ellipsis'} whiteSpace="nowrap">
                            {formatDate(eventItem.start_date, 'MMMM DD, YYYY')}
                        </BodyText>
                    </Grid>

                    <Grid item xs={3}>
                        <BodyText>Time:</BodyText>
                    </Grid>
                    <Grid item xs={9}>
                        <BodyText overflow="hidden" textOverflow={'ellipsis'} whiteSpace="nowrap">
                            {`${formatDate(eventItem.start_date, 'h:mm a')} to ${formatDate(
                                eventItem.end_date,
                                'h:mm a',
                            )} PT`}
                        </BodyText>
                    </Grid>
                </Grid>
                <Grid container item xs={1.5}>
                    <Grid item xs={6}>
                        <IconButton sx={{ padding: 1, margin: 0 }} color="inherit" aria-label="edit-icon">
                            <FontAwesomeIcon
                                icon={faPen}
                                style={{ fontSize: '22px' }}
                                onClick={() => {
                                    handleChangeEventToEdit(event);
                                    handleEventDrawerOpen(event.type, true);
                                }}
                            />
                        </IconButton>
                    </Grid>
                    <Grid item xs={6}>
                        <IconButton
                            onClick={() => removeEvent(event.id)}
                            sx={{ padding: 1, margin: 0 }}
                            color="inherit"
                            aria-label="delete-icon"
                        >
                            <FontAwesomeIcon icon={faCircleXmark} style={{ fontSize: '22px' }} />
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
        </MetWidgetPaper>
    );
};

export default EventInfoPaper;
