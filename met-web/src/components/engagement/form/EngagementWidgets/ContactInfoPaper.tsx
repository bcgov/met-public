import React, { useContext, useRef } from 'react';
import { MetLabel, MetParagraph, MetWidgetPaper } from 'components/common';
import { Grid, IconButton } from '@mui/material';
import { Contact } from 'models/contact';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import type { Identifier, XYCoord } from 'dnd-core';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { WidgetDrawerContext } from './WidgetDrawerContext';
import { useDrag, useDrop } from 'react-dnd';
import { When } from 'react-if';

interface ContantInfoPaperProps {
    testId?: string;
    contact: Contact;
    index: number;
    removeContact: (contact: Contact) => void;
    moveContact: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
    index: number;
    id: string;
    type: string;
}

const ContantInfoPaper = ({ testId, contact, removeContact, index, moveContact, ...rest }: ContantInfoPaperProps) => {
    const { handleAddContactDrawerOpen } = useContext(WidgetDrawerContext);
    const ref = useRef<HTMLDivElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
        accept: 'Contact',
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(item: DragItem, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect();

            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

            // Determine mouse position
            const clientOffset = monitor.getClientOffset();

            // Get pixels to the top
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            // Time to actually perform the action
            moveContact(dragIndex, hoverIndex);

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex;
        },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [{ isDragging }, drag] = useDrag({
        type: 'Contact',
        item: () => {
            return { testId, index };
        },
        // eslint-disable-next-line
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    return (
        <MetWidgetPaper ref={ref} elevation={3} {...rest}>
            <Grid container direction="row" alignItems={'flex-start'} justifyContent="flex-start">
                <Grid item xs={1}>
                    <IconButton sx={{ padding: 0, margin: 0 }} color="info" aria-label="drag-indicator">
                        <DragIndicatorIcon />
                    </IconButton>
                </Grid>
                <Grid item xs={3} container direction="row" alignItems={'flex-start'} justifyContent="flex-start">
                    <Grid item xs={12}>
                        <MetLabel noWrap={true}>{contact.name}</MetLabel>
                    </Grid>
                    <Grid item xs={12}>
                        <MetParagraph overflow="hidden" textOverflow={'ellipsis'} whiteSpace="nowrap">
                            {contact.title}
                        </MetParagraph>
                    </Grid>
                </Grid>
                <Grid
                    item
                    xs={6.5}
                    container
                    direction="row"
                    alignItems={'flex-start'}
                    justifyContent="flex-start"
                    spacing={1}
                >
                    <When condition={!!contact.phone_number}>
                        =
                        <Grid item xs={3}>
                            <MetParagraph>Phone:</MetParagraph>
                        </Grid>
                        <Grid item xs={9}>
                            <MetParagraph overflow="hidden" textOverflow={'ellipsis'} whiteSpace="nowrap">
                                {contact.phone_number}
                            </MetParagraph>
                        </Grid>
                    </When>

                    <Grid item xs={3}>
                        <MetParagraph>Email:</MetParagraph>
                    </Grid>
                    <Grid item xs={9}>
                        <MetParagraph>{contact.email}</MetParagraph>
                    </Grid>
                    <When condition={!!contact.address}>
                        <Grid item xs={3}>
                            <MetParagraph>Address:</MetParagraph>
                        </Grid>
                        <Grid item xs={9}>
                            <MetParagraph
                                width={'100%'}
                                overflow="hidden"
                                textOverflow={'ellipsis'}
                                whiteSpace="nowrap"
                            >
                                {contact.address}
                            </MetParagraph>
                        </Grid>
                    </When>
                    <Grid item xs={3}>
                        <MetParagraph>Bio:</MetParagraph>
                    </Grid>
                    <Grid item xs={9}>
                        <MetParagraph width={'100%'} overflow="hidden" textOverflow={'ellipsis'} whiteSpace="nowrap">
                            {contact.bio}
                        </MetParagraph>
                    </Grid>
                </Grid>
                <Grid container item xs={1.5}>
                    <Grid item xs={6}>
                        <IconButton
                            sx={{ padding: 1, margin: 0 }}
                            onClick={() => handleAddContactDrawerOpen(true, { ...contact })}
                            color="info"
                            aria-label="edit-icon"
                        >
                            <EditIcon />
                        </IconButton>
                    </Grid>
                    <Grid item xs={6}>
                        <IconButton
                            sx={{ padding: 1, margin: 0 }}
                            onClick={() => removeContact(contact)}
                            color="info"
                            aria-label="delete-icon"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
        </MetWidgetPaper>
    );
};

export default ContantInfoPaper;
