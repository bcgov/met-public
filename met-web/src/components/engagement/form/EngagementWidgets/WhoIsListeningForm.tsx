import React, { useContext, useState, useCallback, useEffect } from 'react';
import { Autocomplete, Grid, TextField } from '@mui/material';
import { MetLabel, PrimaryButton, SecondaryButton } from 'components/common';
import { Contact } from 'models/contact';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { postWidgetItems } from 'services/widgetService';
import { WidgetDrawerContext } from './WidgetDrawerContext';
import { WidgetType } from 'models/widget';
import update from 'immutability-helper';
import ContactBlock from './ContactBlock';

const WhoIsListeningForm = () => {
    const { handleWidgetDrawerOpen, handleAddContactDrawerOpen, loadingContacts, contacts, widgets } =
        useContext(WidgetDrawerContext);
    const dispatch = useAppDispatch();
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [addedContacts, setAddedContacts] = useState<Contact[]>([]);
    const [addingWidgetItems, setAddingWidgetItems] = useState(false);

    useEffect(() => {
        const filteredContacts = contacts.filter((contact: Contact) =>
            addedContacts.map((addedContact: Contact) => addedContact.id).includes(contact.id),
        );
        setAddedContacts(filteredContacts);
    }, [contacts]);

    const widgetId = widgets.filter((widget) => widget.widget_type_id === WidgetType.WhoIsListening)[0]?.id || null;

    const addContact = () => {
        if (!selectedContact) {
            return;
        }

        const alreadyAdded = addedContacts.map((contact) => contact.id).includes(selectedContact?.id || 0);
        if (alreadyAdded) {
            return;
        }

        setAddedContacts([...addedContacts, selectedContact]);
    };

    const addWidgetItems = async () => {
        if (addedContacts.length === 0) {
            return;
        }

        if (!widgetId) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'The widget needs to be created before the contacts can be added',
                }),
            );
            handleWidgetDrawerOpen(false);
            return;
        }

        const widgetsToAdd = addedContacts.map((addedContact) => {
            return {
                widget_id: widgetId,
                widget_data_id: addedContact.id,
            };
        });

        try {
            setAddingWidgetItems(true);
            await postWidgetItems(widgetId, widgetsToAdd);
            dispatch(openNotification({ severity: 'success', text: 'Widgets successfully added' }));
            handleWidgetDrawerOpen(false);
            setAddingWidgetItems(false);
        } catch (error) {
            console.log(error);
            dispatch(
                openNotification({ severity: 'error', text: 'Error occurred while attempting to add the widgets' }),
            );
            setAddingWidgetItems(false);
        }
    };

    return (
        <Grid item xs={12} container alignItems="flex-start" justifyContent={'flex-start'} spacing={3}>
            <Grid item xs={12} container direction="row" justifyContent={'flex-start'} spacing={1}>
                <Grid item xs={12}>
                    <MetLabel>Select Existing Contact</MetLabel>
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
                        getOptionLabel={(contact: Contact) => `${contact.name} - ${contact.title}`}
                        onChange={(_e: React.SyntheticEvent<Element, Event>, contact: Contact | null) =>
                            setSelectedContact(contact)
                        }
                        getOptionDisabled={(option) => addedContacts.map((contact) => contact.id).includes(option.id)}
                        disabled={loadingContacts}
                    />
                </Grid>
                <Grid item>
                    <PrimaryButton onClick={() => addContact()} sx={{ height: '100%' }} fullWidth>
                        Add This Contact
                    </PrimaryButton>
                </Grid>
                <Grid item>
                    <SecondaryButton sx={{ height: '100%' }} fullWidth onClick={() => handleAddContactDrawerOpen(true)}>
                        Create New Contact
                    </SecondaryButton>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <ContactBlock addedContacts={addedContacts} setAddedContacts={setAddedContacts} />
            </Grid>
            <Grid item xs={12} container direction="row" spacing={1} justifyContent={'flex-start'} marginTop="8em">
                <Grid item>
                    <PrimaryButton
                        disabled={addedContacts.length === 0}
                        loading={addingWidgetItems}
                        onClick={() => addWidgetItems()}
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
