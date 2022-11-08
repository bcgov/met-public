import React, { useContext, useState, useEffect } from 'react';
import { Autocomplete, Grid, TextField } from '@mui/material';
import { MetLabel, PrimaryButton, SecondaryButton } from 'components/common';
import { Contact } from 'models/contact';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { postWidgetItem, updateWidgetItemsSorting } from 'services/widgetService';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { WidgetType } from 'models/widget';
import ContactBlock from './ContactBlock';
import { WhoIsListeningContext } from './WhoIsListeningContext';

export interface AddedContact extends Contact {
    widget_item_id: number;
}
const WhoIsListeningForm = () => {
    const { handleWidgetDrawerOpen, widgets } = useContext(WidgetDrawerContext);
    const { handleAddContactDrawerOpen, loadingContacts, contacts } = useContext(WhoIsListeningContext);

    const dispatch = useAppDispatch();
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [addedContacts, setAddedContacts] = useState<AddedContact[]>([]);
    const [addingWidgetItems, setAddingWidgetItems] = useState(false);
    const [addingContact, setAddingContact] = useState(false);

    const widget = widgets.filter((widget) => widget.widget_type_id === WidgetType.WhoIsListening)[0] || null;
    useEffect(() => {
        const savedContacts = contacts
            .filter((contact) => widget.items.find((widget) => widget.widget_data_id === contact.id))
            .map((contact) => {
                const widgetItem = widget.items.find((widget) => widget.widget_data_id === contact.id);

                return {
                    ...contact,
                    widget_item_id: widgetItem?.id || 0,
                };
            });
        setAddedContacts(savedContacts);
    }, [contacts, widget]);

    const addContact = async () => {
        if (!selectedContact) {
            return;
        }

        const alreadyAdded = addedContacts.map((contact) => contact.id).includes(selectedContact?.id || 0);
        if (alreadyAdded) {
            return;
        }

        try {
            setAddingContact(true);
            const widgetItem = await postWidgetItem(widget.id, {
                widget_id: widget.id,
                widget_data_id: selectedContact.id,
            });
            dispatch(openNotification({ severity: 'success', text: 'Contact successfully added' }));
            setAddedContacts([...addedContacts, { ...selectedContact, widget_item_id: widgetItem.id }]);
            setAddingContact(false);
        } catch (error) {
            console.log(error);
            setAddingContact(false);
            dispatch(
                openNotification({ severity: 'error', text: 'Error occurred while attempting to add the contact' }),
            );
        }
    };

    const addWidgetItems = async () => {
        // TODO Update sorting only
        const widgetsToUpdate = addedContacts.map(() => {
            return {
                widget_id: widget.id,
            };
        });
        try {
            setAddingWidgetItems(true);
            await updateWidgetItemsSorting(widget.id, widgetsToUpdate);
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
                        <PrimaryButton
                            loading={addingContact}
                            onClick={() => addContact()}
                            sx={{ height: '100%' }}
                            fullWidth
                        >
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
        </>
    );
};

export default WhoIsListeningForm;
