import React, { useContext } from 'react';
import { MetParagraph, MetWidgetPaper } from 'components/common';
import { Grid, IconButton } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import EditIcon from '@mui/icons-material/Edit';
import { When } from 'react-if';
import { formatDate } from 'components/common/dateHelper';
import { EventInfoPaperProps } from './EventInfoPaper';
import { EventsContext } from './EventsContext';

const VirtualEventInfoPaper = ({ event, removeEvent, ...rest }: EventInfoPaperProps) => {
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
                            <MetParagraph>Description:</MetParagraph>
                        </Grid>
                        <Grid item xs={9}>
                            <MetParagraph overflow="hidden" textOverflow={'ellipsis'} whiteSpace="nowrap">
                                {eventItem.description}
                            </MetParagraph>
                        </Grid>
                    </When>
                    <Grid item xs={3}>
                        <MetParagraph>Date:</MetParagraph>
                    </Grid>
                    <Grid item xs={9}>
                        <MetParagraph overflow="hidden" textOverflow={'ellipsis'} whiteSpace="nowrap">
                            {formatDate(eventItem.start_date, 'MMMM DD, YYYY')}
                        </MetParagraph>
                    </Grid>

                    <Grid item xs={3}>
                        <MetParagraph>Time:</MetParagraph>
                    </Grid>
                    <Grid item xs={9}>
                        <MetParagraph overflow="hidden" textOverflow={'ellipsis'} whiteSpace="nowrap">
                            {`${formatDate(eventItem.start_date, 'h:mm a')} to ${formatDate(
                                eventItem.end_date,
                                'h:mm a',
                            )} PST`}
                        </MetParagraph>
                    </Grid>
                    <Grid item xs={3}>
                        <MetParagraph>Link: </MetParagraph>
                    </Grid>

                    <Grid item xs={9}>
                        <MetParagraph overflow="hidden" textOverflow={'ellipsis'} whiteSpace="nowrap">
                            {eventItem.url} - {eventItem.url_label}
                        </MetParagraph>
                    </Grid>
                </Grid>
                <Grid container item xs={1.5}>
                    <Grid item xs={6}>
                        <IconButton
                            onClick={() => {
                                handleChangeEventToEdit(event);
                                handleEventDrawerOpen(event.type, true);
                            }}
                            sx={{ padding: 1, margin: 0 }}
                            color="inherit"
                            aria-label="edit-icon"
                        >
                            <EditIcon />
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

export default VirtualEventInfoPaper;
