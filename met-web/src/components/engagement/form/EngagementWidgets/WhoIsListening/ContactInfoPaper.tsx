import React, { useContext } from 'react';
import { MetLabel, MetParagraphOld, MetWidgetPaper } from 'components/common';
import { Grid, IconButton } from '@mui/material';
import { Contact } from 'models/contact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripDotsVertical } from '@fortawesome/pro-solid-svg-icons/faGripDotsVertical';
import { faCircleXmark } from '@fortawesome/pro-regular-svg-icons/faCircleXmark';
import { faPen } from '@fortawesome/pro-regular-svg-icons/faPen';
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
                <Grid item xs={12} xl={0.5} sx={{ pb: '0.5rem' }}>
                    <IconButton sx={{ padding: 0, margin: 0 }} color="inherit" aria-label="drag-indicator">
                        <FontAwesomeIcon icon={faGripDotsVertical} style={{ fontSize: '24px', margin: '0px 4px' }} />
                    </IconButton>
                </Grid>
                <Grid
                    item
                    xs={12}
                    xl={3.5}
                    container
                    direction="row"
                    alignItems={'flex-start'}
                    justifyContent="flex-start"
                    sx={{ pb: '0.5rem' }}
                >
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
                    xs={12}
                    xl={6.25}
                    container
                    direction="row"
                    alignItems={'flex-start'}
                    justifyContent="flex-start"
                    spacing={1}
                    sx={{ pb: '0.5rem' }}
                >
                    <When condition={!!contact.phone_number}>
                        <Grid item xs={12} xl={2.5}>
                            <MetParagraphOld>Phone:</MetParagraphOld>
                        </Grid>
                        <Grid item xs={12} xl={9.5}>
                            <MetParagraphOld overflow="hidden" textOverflow={'ellipsis'} whiteSpace="nowrap">
                                {contact.phone_number}
                            </MetParagraphOld>
                        </Grid>
                    </When>

                    <Grid item xs={12} xl={2.5}>
                        <MetParagraphOld>Email:</MetParagraphOld>
                    </Grid>
                    <Grid item xs={12} xl={9.5}>
                        <MetParagraphOld style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {contact.email}
                        </MetParagraphOld>
                    </Grid>
                    <When condition={!!contact.address}>
                        <Grid item xs={12} xl={2.5}>
                            <MetParagraphOld>Address:</MetParagraphOld>
                        </Grid>
                        <Grid item xs={12} xl={9.5}>
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
                        <Grid item xs={12} xl={2.5}>
                            <MetParagraphOld>Bio:</MetParagraphOld>
                        </Grid>
                        <Grid item xs={12} xl={9.5}>
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
                <Grid container item xs={1.75} sx={{ ml: 'auto', flexWrap: 'nowrap' }}>
                    <Grid item xs={6} sx={{ display: 'flex' }}>
                        <IconButton
                            sx={{ padding: 0, margin: 0, ml: 'auto' }}
                            onClick={() => {
                                handleChangeContactToEdit(contact);
                                handleAddContactDrawerOpen(true);
                            }}
                            color="inherit"
                            aria-label="edit-icon"
                        >
                            <FontAwesomeIcon icon={faPen} style={{ fontSize: '22px' }} />
                        </IconButton>
                    </Grid>
                    <Grid item xs={6} sx={{ ml: 'auto', display: 'flex' }}>
                        <IconButton
                            sx={{ padding: 0, margin: 0, ml: 'auto' }}
                            onClick={() => removeContact(contact.id)}
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

export default ContactInfoPaper;
