import React, { useContext, useState } from 'react';
import { MetLabel, MetParagraph, MetWidgetPaper } from 'components/common';
import { Grid, IconButton } from '@mui/material';
import { Contact } from 'models/contact';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { WidgetDrawerContext } from './WidgetDrawerContext';
interface ContantInfoPaperProps {
    testId?: string;
    contact: Contact;
    removeContact: (contact: Contact) => void;
}

const ContantInfoPaper = ({ testId, contact, removeContact, ...rest }: ContantInfoPaperProps) => {
    const { handleAddContactDrawerOpen } = useContext(WidgetDrawerContext);

    return (
        <MetWidgetPaper elevation={3} {...rest}>
            <Grid container direction="row" alignItems={'flex-start'} justifyContent="flex-start">
                <Grid item xs={1}>
                    <IconButton sx={{ padding: 0, margin: 0 }} color="info" aria-label="drag-indicator">
                        <DragIndicatorIcon />
                    </IconButton>
                </Grid>
                <Grid item xs={2} container direction="row" alignItems={'flex-start'} justifyContent="flex-start">
                    <Grid item xs={12}>
                        <MetLabel>{contact.name}</MetLabel>
                    </Grid>
                    <Grid item xs={12}>
                        <MetParagraph>{contact.title}</MetParagraph>
                    </Grid>
                </Grid>
                <Grid
                    item
                    xs={8}
                    container
                    direction="row"
                    alignItems={'flex-start'}
                    justifyContent="flex-start"
                    spacing={1}
                >
                    <Grid item xs={2}>
                        <MetParagraph>Phone:</MetParagraph>
                    </Grid>
                    <Grid item xs={10}>
                        <MetParagraph>{contact.phone_number}</MetParagraph>
                    </Grid>

                    <Grid item xs={2}>
                        <MetParagraph>Email:</MetParagraph>
                    </Grid>
                    <Grid item xs={10}>
                        <MetParagraph>{contact.email}</MetParagraph>
                    </Grid>

                    <Grid item xs={2}>
                        <MetParagraph>Address:</MetParagraph>
                    </Grid>
                    <Grid item xs={10}>
                        <MetParagraph>{contact.address}</MetParagraph>
                    </Grid>

                    <Grid item xs={2}>
                        <MetParagraph>Bio:</MetParagraph>
                    </Grid>
                    <Grid item xs={10}>
                        <MetParagraph width={'100%'} overflow="hidden" textOverflow={'ellipsis'} whiteSpace="nowrap">
                            {contact.bio}
                        </MetParagraph>
                    </Grid>
                </Grid>
                <Grid container item xs={1}>
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
