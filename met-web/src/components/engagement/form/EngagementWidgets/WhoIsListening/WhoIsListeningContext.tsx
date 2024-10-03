import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { ActionContext } from '../../ActionContext';
import { Contact } from 'models/contact';
import { useLazyGetContactsQuery } from 'apiManager/apiSlices/contacts';
import { fetchListeningWidget } from 'services/widgetService/ListeningService';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { WidgetType } from 'models/widget';
import { ListeningWidget } from 'models/listeningWidget';

export interface WhoIsListeningContextProps {
    contactToEdit: Contact | null;
    addContactDrawerOpen: boolean;
    handleAddContactDrawerOpen: (_open: boolean) => void;
    loadingContacts: boolean;
    contacts: Contact[];
    loadContacts: () => Promise<Contact[] | undefined>;
    listeningWidget: ListeningWidget;
    setListeningWidget: React.Dispatch<React.SetStateAction<ListeningWidget>>;
    loadListeningWidget: () => Promise<ListeningWidget | undefined>;
    handleChangeContactToEdit: (_contact: Contact | null) => void;
    setAddedContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
    addedContacts: Contact[];
}

export type EngagementParams = {
    engagementId: string;
};

const emptyListeningWidget = {
    id: 0,
    engagement_id: 0,
    widget_id: 0,
    description: '',
};

export const WhoIsListeningContext = createContext<WhoIsListeningContextProps>({
    loadingContacts: false,
    contactToEdit: null,
    addContactDrawerOpen: false,
    handleAddContactDrawerOpen: (_open: boolean) => {
        /*empty*/
    },
    contacts: [],
    loadContacts: () => Promise.resolve([]),
    listeningWidget: emptyListeningWidget,
    setListeningWidget: (updatedListeningWidget: React.SetStateAction<ListeningWidget>) => emptyListeningWidget,
    loadListeningWidget: () => Promise.resolve(emptyListeningWidget),
    handleChangeContactToEdit: () => {
        /*empty*/
    },
    setAddedContacts: (updatedContacts: React.SetStateAction<Contact[]>) => [],
    addedContacts: [],
});

export const WhoIsListeningProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const { savedEngagement } = useContext(ActionContext);
    const [getContactsTrigger] = useLazyGetContactsQuery();
    const dispatch = useAppDispatch();
    const { widgets } = useContext(WidgetDrawerContext);
    const widget = widgets.find((widget) => widget.widget_type_id === WidgetType.WhoIsListening) || null;

    const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);
    const [addContactDrawerOpen, setAddContactDrawerOpen] = useState(false);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [listeningWidget, setListeningWidget] = useState<ListeningWidget>(emptyListeningWidget);
    const [addedContacts, setAddedContacts] = useState<Contact[]>([]);
    const [loadingContacts, setLoadingContacts] = useState(true);

    useEffect(() => {
        loadContacts();
        loadListeningWidget();
    }, [savedEngagement]);

    const loadContacts = async () => {
        try {
            if (!savedEngagement.id) {
                setLoadingContacts(false);
                return Promise.resolve([]);
            }
            setLoadingContacts(true);
            const loadedContacts = await getContactsTrigger(undefined, false).unwrap();
            setContacts(loadedContacts);
            setLoadingContacts(false);
            return loadedContacts;
        } catch (error) {
            console.log(error);
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while attempting to load contacts' }));
            setLoadingContacts(false);
        }
    };

    const loadListeningWidget = async () => {
        try {
            if (!savedEngagement.id || !widget?.id) {
                return Promise.resolve(emptyListeningWidget);
            }
            const loadedListeningWidget = await fetchListeningWidget(widget.id);
            setListeningWidget(loadedListeningWidget);
            return loadedListeningWidget;
        } catch (error) {
            console.log(error);
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while attempting to load Who is Listening description',
                }),
            );
        }
    };

    const handleChangeContactToEdit = (contact: Contact | null) => {
        setContactToEdit(contact);
    };

    const handleAddContactDrawerOpen = (open: boolean) => {
        setAddContactDrawerOpen(open);
    };

    return (
        <WhoIsListeningContext.Provider
            value={{
                addContactDrawerOpen,
                handleAddContactDrawerOpen,
                loadingContacts,
                contacts,
                loadContacts,
                listeningWidget,
                setListeningWidget,
                loadListeningWidget,
                contactToEdit,
                handleChangeContactToEdit,
                setAddedContacts,
                addedContacts,
            }}
        >
            {children}
        </WhoIsListeningContext.Provider>
    );
};
