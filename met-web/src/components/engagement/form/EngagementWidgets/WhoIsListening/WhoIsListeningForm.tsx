import React, { useContext, useState, useEffect } from 'react';
import { Autocomplete, Grid, TextField } from '@mui/material';
import { MetLabel, PrimaryButton, SecondaryButton } from 'components/common';
import { Contact } from 'models/contact';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { postWidgetItems } from 'services/widgetService';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { WidgetType } from 'models/widget';
import ContactBlock from './ContactBlock';
import { WhoIsListeningContext } from './WhoIsListeningContext';

const WhoIsListeningForm = () => {
    const { handleWidgetDrawerOpen, widgets, loadWidgets } = useContext(WidgetDrawerContext);
    const { handleAddContactDrawerOpen, loadingContacts, contacts, addedContacts, setAddedContacts } =
        useContext(WhoIsListeningContext);
    const dispatch = useAppDispatch();
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [savingWidgetItems, setSavingWidgetItems] = useState(false);

    const widget = widgets.filter((widget) => widget.widget_type_id === WidgetType.WhoIsListening)[0] || null;
    useEffect(() => {
        const savedContacts = widget.items
            .map((widget_item) => {
                return contacts.find((contact) => contact.id === widget_item.widget_data_id);
            })
            .filter((contact) => !!contact) as Contact[];

        setAddedContacts((prevContacts: Contact[]) => {
            if (prevContacts.length === 0) {
                return savedContacts;
            }

            const prevContactIds = new Set(prevContacts.map((prevContact) => prevContact.id));

            const contactsToSet = [
                ...prevContacts,
                ...savedContacts.filter((savedContact) => !prevContactIds.has(savedContact.id)),
            ];

            const contactsMap = new Map(contacts.map((contact) => [contact.id, contact]));

            return contactsToSet
                .map((contactToSet) => contactsMap.get(contactToSet.id))
                .filter((contact) => Boolean(contact)) as Contact[];
        });
    }, [contacts, widget]);

    const addContact = async () => {
        if (!selectedContact) {
            return;
        }

        const alreadyAdded = addedContacts.map((contact) => contact.id).includes(selectedContact?.id || 0);
        if (alreadyAdded) {
            return;
        }

        setAddedContacts([...addedContacts, { ...selectedContact }]);
    };

    const saveWidgetItems = async () => {
        const widgetsToUpdate = addedContacts.map((addedContact) => {
            return {
                widget_id: widget.id,
                widget_data_id: addedContact.id,
            };
        });
        try {
            setSavingWidgetItems(true);
            await postWidgetItems(widget.id, widgetsToUpdate);
            await loadWidgets();
            dispatch(openNotification({ severity: 'success', text: 'Widgets successfully added' }));
            handleWidgetDrawerOpen(false);
            setSavingWidgetItems(false);
        } catch (error) {
            console.log(error);
            dispatch(
                openNotification({ severity: 'error', text: 'Error occurred while attempting to add the widgets' }),
            );
            setSavingWidgetItems(false);
        }
    };

    return (
        <>
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
                            getOptionDisabled={(option) =>
                                addedContacts.map((contact) => contact.id).includes(option.id)
                            }
                            disabled={loadingContacts}
                        />
                    </Grid>
                    <Grid item>
                        <PrimaryButton onClick={() => addContact()} sx={{ height: '100%' }} fullWidth>
                            Add This Contact
                        </PrimaryButton>
                    </Grid>
                    <Grid item>
                        <SecondaryButton
                            sx={{ height: '100%' }}
                            fullWidth
                            onClick={() => handleAddContactDrawerOpen(true)}
                        >
                            Create New Contact
                        </SecondaryButton>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <ContactBlock />
                </Grid>
                <Grid item xs={12} container direction="row" spacing={1} justifyContent={'flex-start'} marginTop="8em">
                    <Grid item>
                        <PrimaryButton
                            disabled={addedContacts.length === 0}
                            loading={savingWidgetItems}
                            onClick={() => saveWidgetItems()}
                        >{`Save & Close`}</PrimaryButton>
                    </Grid>
                    <Grid item>
                        <SecondaryButton onClick={() => handleWidgetDrawerOpen(false)}>{`Cancel`}</SecondaryButton>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default WhoIsListeningForm;
