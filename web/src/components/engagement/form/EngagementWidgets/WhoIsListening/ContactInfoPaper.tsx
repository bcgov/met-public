import React, { useContext } from 'react';
import { BodyText } from 'components/common/Typography';
import { Grid2 as Grid, IconButton, Paper } from '@mui/material';
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
        <Paper elevation={3} {...rest}>
            <Grid container direction="row" alignItems={'flex-start'} justifyContent="flex-start">
                <Grid size={{ xs: 12, xl: 0.5 }} sx={{ pb: '0.5rem' }}>
                    <IconButton sx={{ padding: 0, margin: 0 }} color="inherit" aria-label="drag-indicator">
                        <FontAwesomeIcon icon={faGripDotsVertical} style={{ fontSize: '24px', margin: '0px 4px' }} />
                    </IconButton>
                </Grid>
                <Grid
                    size={{ xs: 12, xl: 3.5 }}
                    container
                    direction="row"
                    alignItems={'flex-start'}
                    justifyContent="flex-start"
                    sx={{ pb: '0.5rem' }}
                >
                    <Grid size={12}>
                        <BodyText bold noWrap={true}>
                            {contact.name}
                        </BodyText>
                    </Grid>
                    <When condition={Boolean(contact.title)}>
                        <Grid size={12}>
                            <BodyText overflow="hidden" textOverflow={'ellipsis'} whiteSpace="nowrap">
                                {contact.title}
                            </BodyText>
                        </Grid>
                    </When>
                </Grid>
                <Grid
                    size={{ xs: 12, xl: 6.25 }}
                    container
                    direction="row"
                    alignItems={'flex-start'}
                    justifyContent="flex-start"
                    spacing={1}
                    sx={{ pb: '0.5rem' }}
                >
                    <When condition={!!contact.phone_number}>
                        <Grid size={{ xs: 12, xl: 2.5 }}>
                            <BodyText>Phone:</BodyText>
                        </Grid>
                        <Grid size={{ xs: 12, xl: 9.5 }}>
                            <BodyText overflow="hidden" textOverflow={'ellipsis'} whiteSpace="nowrap">
                                {contact.phone_number}
                            </BodyText>
                        </Grid>
                    </When>

                    <Grid size={{ xs: 12, xl: 2.5 }}>
                        <BodyText>Email:</BodyText>
                    </Grid>
                    <Grid size={{ xs: 12, xl: 9.5 }}>
                        <BodyText style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{contact.email}</BodyText>
                    </Grid>
                    <When condition={!!contact.address}>
                        <Grid size={{ xs: 12, xl: 2.5 }}>
                            <BodyText>Address:</BodyText>
                        </Grid>
                        <Grid size={{ xs: 12, xl: 9.5 }}>
                            <BodyText width={'100%'} overflow="hidden" textOverflow={'ellipsis'} whiteSpace="nowrap">
                                {contact.address}
                            </BodyText>
                        </Grid>
                    </When>
                    <When condition={Boolean(contact.bio)}>
                        <Grid size={{ xs: 12, xl: 2.5 }}>
                            <BodyText>Bio:</BodyText>
                        </Grid>
                        <Grid size={{ xs: 12, xl: 9.5 }}>
                            <BodyText width={'100%'} overflow="hidden" textOverflow={'ellipsis'} whiteSpace="nowrap">
                                {contact.bio}
                            </BodyText>
                        </Grid>
                    </When>
                </Grid>
                <Grid container size={1.75} sx={{ ml: 'auto', flexWrap: 'nowrap' }}>
                    <Grid size={{ xs: 6, xl: 6.25 }} sx={{ display: 'flex' }}>
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
                    <Grid size={{ xs: 6, xl: 6.25 }} sx={{ ml: 'auto', display: 'flex' }}>
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
        </Paper>
    );
};

export default ContactInfoPaper;
