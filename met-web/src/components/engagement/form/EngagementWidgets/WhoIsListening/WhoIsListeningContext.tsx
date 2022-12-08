import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { ActionContext } from '../../ActionContext';
import { getContacts } from 'services/contactService';
import { Contact } from 'models/contact';

export interface WhoIsListeningContextProps {
    contactToEdit: Contact | null;
    addContactDrawerOpen: boolean;
    handleAddContactDrawerOpen: (_open: boolean) => void;
    loadingContacts: boolean;
    contacts: Contact[];
    loadContacts: () => Promise<Contact[] | undefined>;
    handleChangeContactToEdit: (_contact: Contact | null) => void;
    setAddedContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
    addedContacts: Contact[];
}

export type EngagementParams = {
    engagementId: string;
};

export const WhoIsListeningContext = createContext<WhoIsListeningContextProps>({
    loadingContacts: false,
    contactToEdit: null,
    addContactDrawerOpen: false,
    handleAddContactDrawerOpen: (_open: boolean) => {
        /* empty default method  */
    },
    contacts: [],
    loadContacts: () => Promise.resolve([]),
    handleChangeContactToEdit: () => {
        /* empty default method  */
    },
    setAddedContacts: (updatedContacts: React.SetStateAction<Contact[]>) => [],
    addedContacts: [],
});

export const WhoIsListeningProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const { savedEngagement } = useContext(ActionContext);
    const dispatch = useAppDispatch();
    const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);
    const [addContactDrawerOpen, setAddContactDrawerOpen] = useState(false);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [addedContacts, setAddedContacts] = useState<Contact[]>([]);
    const [loadingContacts, setLoadingContacts] = useState(true);

    const loadContacts = async () => {
        try {
            if (!savedEngagement.id) {
                setLoadingContacts(false);
                return Promise.resolve([]);
            }
            setLoadingContacts(true);
            const loadedContacts = await getContacts();
            setContacts(loadedContacts);
            setLoadingContacts(false);
            return loadedContacts;
        } catch (error) {
            console.log(error);
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while attempting to load contacts' }));
            setLoadingContacts(false);
        }
    };

    useEffect(() => {
        loadContacts();
    }, [savedEngagement]);

    const handleChangeContactToEdit = (contact: Contact | null) => {
        setContactToEdit(contact);
    };

    const handleAddContactDrawerOpen = (open: boolean) => {
        setAddContactDrawerOpen(open);
        if (!open && contactToEdit) {
            setContactToEdit(null);
        }
    };

    return (
        <WhoIsListeningContext.Provider
            value={{
                addContactDrawerOpen,
                handleAddContactDrawerOpen,
                loadingContacts,
                contacts,
                loadContacts,
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
