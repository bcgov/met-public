import React, { useContext } from 'react';
import { MetParagraphOld, MetWidgetPaper } from 'components/common';
import { Grid, IconButton } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import EditIcon from '@mui/icons-material/Edit';
import { When } from 'react-if';
import { Event } from 'models/event';
import { formatDate } from 'components/common/dateHelper';
import { EventsContext } from './EventsContext';

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
                        <DragIndicatorIcon />
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
                    <When condition={!!eventItem.description}>
                        <Grid item xs={3}>
                            <MetParagraphOld>Description:</MetParagraphOld>
                        </Grid>
                        <Grid item xs={9}>
                            <MetParagraphOld overflow="hidden" textOverflow={'ellipsis'} whiteSpace="nowrap">
                                {eventItem.description}
                            </MetParagraphOld>
                        </Grid>
                    </When>

                    <Grid item xs={3}>
                        <MetParagraphOld>Location:</MetParagraphOld>
                    </Grid>
                    <Grid item xs={9}>
                        <MetParagraphOld overflow="hidden" textOverflow={'ellipsis'} whiteSpace="nowrap">
                            {eventItem.location_name}
                        </MetParagraphOld>
                    </Grid>
                    <Grid item xs={3}>
                        <MetParagraphOld>Address:</MetParagraphOld>
                    </Grid>

                    <Grid item xs={9}>
                        <MetParagraphOld overflow="hidden" textOverflow={'ellipsis'} whiteSpace="nowrap">
                            {eventItem.location_address}
                        </MetParagraphOld>
                    </Grid>

                    <Grid item xs={3}>
                        <MetParagraphOld>Date:</MetParagraphOld>
                    </Grid>
                    <Grid item xs={9}>
                        <MetParagraphOld overflow="hidden" textOverflow={'ellipsis'} whiteSpace="nowrap">
                            {formatDate(eventItem.start_date, 'MMMM DD, YYYY')}
                        </MetParagraphOld>
                    </Grid>

                    <Grid item xs={3}>
                        <MetParagraphOld>Time:</MetParagraphOld>
                    </Grid>
                    <Grid item xs={9}>
                        <MetParagraphOld overflow="hidden" textOverflow={'ellipsis'} whiteSpace="nowrap">
                            {`${formatDate(eventItem.start_date, 'h:mm a')} to ${formatDate(
                                eventItem.end_date,
                                'h:mm a',
                            )} PT`}
                        </MetParagraphOld>
                    </Grid>
                </Grid>
                <Grid container item xs={1.5}>
                    <Grid item xs={6}>
                        <IconButton sx={{ padding: 1, margin: 0 }} color="inherit" aria-label="edit-icon">
                            <EditIcon
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
                            <HighlightOffIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
        </MetWidgetPaper>
    );
};

export default EventInfoPaper;
