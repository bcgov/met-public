import React, { useContext, useEffect, useState } from 'react';
import { Autocomplete, Grid, TextField, Typography } from '@mui/material';
import { ActionContext } from '../ActionContext';
import { MetLabel, PrimaryButton, SecondaryButton } from 'components/common';
import { Contact } from 'models/contact';
import { getContacts } from 'services/contactService';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { postWidgets } from 'services/widgetService';

const WhoIsListeningForm = () => {
    const { handleWidgetDrawerOpen, handleAddContactDrawerOpen, savedEngagement } = useContext(ActionContext);
    const dispatch = useAppDispatch();
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [addedContacts, setAddedContacts] = useState<Contact[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loadingContacts, setLoadingContacts] = useState(false);
    const [addingWidgets, setAddingWidgets] = useState(false);

    useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = async () => {
        try {
            setLoadingContacts(true);
            const loadedContacts = await getContacts();
            setContacts(loadedContacts);
            setLoadingContacts(false);
        } catch (error) {
            console.log(error);
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while attempting to load contacts' }));
            setLoadingContacts(false);
        }
    };

    const addContact = () => {
        if (!selectedContact || addedContacts.map((contact) => contact.id).includes(selectedContact.id)) {
            return;
        }

        setAddedContacts([...addedContacts, selectedContact]);
    };

    const addWidgets = async () => {
        if (addedContacts.length === 0) {
            return;
        }

        const widgetsToAdd = addedContacts.map((addedContact) => {
            return {
                widget_type_id: 1,
                widget_data_id: addedContact.id,
                engagement_id: savedEngagement.id,
            };
        });

        try {
            await postWidgets(savedEngagement.id, widgetsToAdd);
            dispatch(openNotification({ severity: 'success', text: 'Widgets successfully added' }));
            handleWidgetDrawerOpen(false);
        } catch (error) {
            console.log(error);
            dispatch(
                openNotification({ severity: 'error', text: 'Error occurred while attempting to add the widgets' }),
            );
        }
    };
    return (
        <Grid item xs={12} container alignItems="flex-start" justifyContent={'flex-start'} spacing={1}>
            <Grid item xs={12}>
                <MetLabel>Select Existing Contact</MetLabel>
            </Grid>
            <Grid item xs={12} container direction="row" justifyContent={'flex-start'} spacing={1}>
                <Grid item xs={12}>
                    <Autocomplete
                        id="contact-selector"
                        options={contacts}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label=" "
                                InputLabelProps={{
                                    shrink: false,
                                }}
                            />
                        )}
                        getOptionLabel={(contact: Contact) => contact.name}
                        onChange={(_e: React.SyntheticEvent<Element, Event>, contact: Contact | null) =>
                            setSelectedContact(contact)
                        }
                        getOptionDisabled={(option) => addedContacts.map((contact) => contact.id).includes(option.id)}
                        disabled={loadingContacts}
                    />
                </Grid>
                <Grid item>
                    <PrimaryButton onClick={() => addContact()} sx={{ height: '100%' }} fullWidth>
                        Add selected contac
                    </PrimaryButton>
                </Grid>
                <Grid item>
                    <SecondaryButton sx={{ height: '100%' }} fullWidth onClick={() => handleAddContactDrawerOpen(true)}>
                        Create New Contact
                    </SecondaryButton>
                </Grid>
            </Grid>
            {addedContacts.map((addedContact, index) => {
                return (
                    <Grid key={`added-contact-${addedContact.id}`} item xs={12}>
                        <Typography>{addedContact.name}</Typography>
                    </Grid>
                );
            })}
            <Grid item xs={12} container direction="row" spacing={1} justifyContent={'flex-start'} marginTop="8em">
                <Grid item>
                    <PrimaryButton
                        disabled={addedContacts.length === 0}
                        loading={addingWidgets}
                        onClick={() => addWidgets()}
                    >{`Save & Close`}</PrimaryButton>
                </Grid>
                <Grid item>
                    <SecondaryButton onClick={() => handleWidgetDrawerOpen(false)}>{`Cancel`}</SecondaryButton>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default WhoIsListeningForm;
