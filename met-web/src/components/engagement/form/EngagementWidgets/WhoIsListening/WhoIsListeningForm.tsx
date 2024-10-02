import React, { useContext, useState, useEffect } from 'react';
import { Autocomplete, Grid, TextField, Divider } from '@mui/material';
import { MetLabel, PrimaryButtonOld, SecondaryButtonOld } from 'components/common';
import { Contact } from 'models/contact';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { WidgetType } from 'models/widget';
import ContactBlock from './ContactBlock';
import { WhoIsListeningContext } from './WhoIsListeningContext';
import { useCreateWidgetItemsMutation } from 'apiManager/apiSlices/widgets';
import { WidgetTitle } from '../WidgetTitle';
import { patchListeningWidget, postListeningWidget } from 'services/widgetService/ListeningService';

const WhoIsListeningForm = () => {
    const { handleWidgetDrawerOpen, widgets, loadWidgets } = useContext(WidgetDrawerContext);
    const {
        handleAddContactDrawerOpen,
        loadingContacts,
        contacts,
        addedContacts,
        setAddedContacts,
        listeningWidget,
        setListeningWidget,
        loadListeningWidget,
    } = useContext(WhoIsListeningContext);
    const dispatch = useAppDispatch();
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [savingWidgetItems, setSavingWidgetItems] = useState(false);
    const [createWidgetItems] = useCreateWidgetItemsMutation();
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
            await createWidgetItems({ widget_id: widget.id, widget_items_data: widgetsToUpdate }).unwrap();
            await loadWidgets();
            if (listeningWidget.id) {
                await patchListeningWidget(widget.id, listeningWidget.id, {
                    description: listeningWidget.description,
                });
            } else {
                await postListeningWidget(widget.id, {
                    engagement_id: widget.engagement_id,
                    widget_id: widget.id,
                    description: listeningWidget.description,
                });
            }
            await loadListeningWidget();
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
        <Grid item xs={12} container alignItems="flex-start" justifyContent={'flex-start'} spacing={3}>
            <Grid item xs={12}>
                <WidgetTitle widget={widget} />
                <Divider sx={{ marginTop: '0.5em' }} />
            </Grid>
            <Grid item xs={12}>
                <MetLabel>Description (Optional)</MetLabel>
                <TextField
                    name="description"
                    variant="outlined"
                    value={listeningWidget?.description}
                    onChange={(e) => {
                        setListeningWidget({ ...listeningWidget, description: e.target.value });
                    }}
                    label=" "
                    aria-label="Description: optional."
                    InputLabelProps={{
                        shrink: false,
                    }}
                    fullWidth
                    multiline
                    rows={4}
                />
            </Grid>
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
                                aria-label="Select an existing contact."
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
                    <PrimaryButtonOld onClick={() => addContact()} fullWidth>
                        Add This Contact
                    </PrimaryButtonOld>
                </Grid>
                <Grid item>
                    <SecondaryButtonOld fullWidth onClick={() => handleAddContactDrawerOpen(true)}>
                        Create New Contact
                    </SecondaryButtonOld>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <ContactBlock />
            </Grid>
            <Grid item xs={12} container direction="row" spacing={1} justifyContent={'flex-start'} marginTop="8em">
                <Grid item>
                    <PrimaryButtonOld
                        disabled={addedContacts.length === 0}
                        loading={savingWidgetItems}
                        onClick={() => saveWidgetItems()}
                    >{`Save & Close`}</PrimaryButtonOld>
                </Grid>
                <Grid item>
                    <SecondaryButtonOld onClick={() => handleWidgetDrawerOpen(false)}>{`Cancel`}</SecondaryButtonOld>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default WhoIsListeningForm;
