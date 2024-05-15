import React, { useContext } from 'react';
import { MetLabel, MetParagraphOld, MetWidgetPaper } from 'components/common';
import { Grid, IconButton } from '@mui/material';
import { Contact } from 'models/contact';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import EditIcon from '@mui/icons-material/Edit';
import { When } from 'react-if';
import { WhoIsListeningContext } from './WhoIsListeningContext';

interface ContactInfoPaperProps {
    contact: Contact;
    removeContact: (contactId: number) => void;
}

const ContactInfoPaper = ({ contact, removeContact, ...rest }: ContactInfoPaperProps) => {
    const { handleChangeContactToEdit, handleAddContactDrawerOpen } = useContext(WhoIsListeningContext);

    return (
        <MetWidgetPaper elevation={1} {...rest}>
            <Grid container direction="row" alignItems={'flex-start'} justifyContent="flex-start">
                <Grid item xs={1}>
                    <IconButton sx={{ padding: 0, margin: 0 }} color="inherit" aria-label="drag-indicator">
                        <DragIndicatorIcon />
                    </IconButton>
                </Grid>
                <Grid item xs={3} container direction="row" alignItems={'flex-start'} justifyContent="flex-start">
                    <Grid item xs={12}>
                        <MetLabel noWrap={true}>{contact.name}</MetLabel>
                    </Grid>
                    <When condition={Boolean(contact.title)}>
                        <Grid item xs={12}>
                            <MetParagraphOld overflow="hidden" textOverflow={'ellipsis'} whiteSpace="nowrap">
                                {contact.title}
                            </MetParagraphOld>
                        </Grid>
                    </When>
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
                        <Grid item xs={3}>
                            <MetParagraphOld>Phone:</MetParagraphOld>
                        </Grid>
                        <Grid item xs={9}>
                            <MetParagraphOld overflow="hidden" textOverflow={'ellipsis'} whiteSpace="nowrap">
                                {contact.phone_number}
                            </MetParagraphOld>
                        </Grid>
                    </When>

                    <Grid item xs={3}>
                        <MetParagraphOld>Email:</MetParagraphOld>
                    </Grid>
                    <Grid item xs={9}>
                        <MetParagraphOld>{contact.email}</MetParagraphOld>
                    </Grid>
                    <When condition={!!contact.address}>
                        <Grid item xs={3}>
                            <MetParagraphOld>Address:</MetParagraphOld>
                        </Grid>
                        <Grid item xs={9}>
                            <MetParagraphOld
                                width={'100%'}
                                overflow="hidden"
                                textOverflow={'ellipsis'}
                                whiteSpace="nowrap"
                            >
                                {contact.address}
                            </MetParagraphOld>
                        </Grid>
                    </When>
                    <When condition={Boolean(contact.bio)}>
                        <Grid item xs={3}>
                            <MetParagraphOld>Bio:</MetParagraphOld>
                        </Grid>
                        <Grid item xs={9}>
                            <MetParagraphOld
                                width={'100%'}
                                overflow="hidden"
                                textOverflow={'ellipsis'}
                                whiteSpace="nowrap"
                            >
                                {contact.bio}
                            </MetParagraphOld>
                        </Grid>
                    </When>
                </Grid>
                <Grid container item xs={1.5}>
                    <Grid item xs={6}>
                        <IconButton
                            sx={{ padding: 1, margin: 0 }}
                            onClick={() => {
                                handleChangeContactToEdit(contact);
                                handleAddContactDrawerOpen(true);
                            }}
                            color="inherit"
                            aria-label="edit-icon"
                        >
                            <EditIcon />
                        </IconButton>
                    </Grid>
                    <Grid item xs={6}>
                        <IconButton
                            sx={{ padding: 1, margin: 0 }}
                            onClick={() => removeContact(contact.id)}
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

export default ContactInfoPaper;
