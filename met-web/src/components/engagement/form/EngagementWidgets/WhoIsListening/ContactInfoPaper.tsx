import React, { useContext } from 'react';
import { MetLabel, MetParagraph, MetWidgetPaper } from 'components/common';
import { Grid, IconButton } from '@mui/material';
import { Contact } from 'models/contact';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteIcon from '@mui/icons-material/Delete';
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
        <MetWidgetPaper elevation={3} {...rest}>
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
                            onClick={() => {
                                handleChangeContactToEdit(contact);
                                handleAddContactDrawerOpen(true);
                            }}
                            color="info"
                            aria-label="edit-icon"
                        >
                            <EditIcon />
                        </IconButton>
                    </Grid>
                    <Grid item xs={6}>
                        <IconButton
                            sx={{ padding: 1, margin: 0 }}
                            onClick={() => removeContact(contact.id)}
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

export default ContactInfoPaper;
