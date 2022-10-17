import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from 'hooks';
import { WidgetsList } from 'models/widget';
import { openNotification } from 'services/notificationService/notificationSlice';
import { getWidgets } from 'services/widgetService';
import { ActionContext } from '../ActionContext';
import { getContacts } from 'services/contactService';
import { Contact } from 'models/contact';

export interface WidgetDrawerContextProps {
    widgets: WidgetsList[];
    widgetDrawerOpen: boolean;
    handleWidgetDrawerOpen: (_open: boolean) => void;
    widgetDrawerTabValue: string;
    handleWidgetDrawerTabValueChange: (_tabValue: string) => void;
    addContactDrawerOpen: boolean;
    handleAddContactDrawerOpen: (_open: boolean) => void;
    isWidgetsLoading: boolean;
    loadWidgets: () => void;
    loadingContacts: boolean;
    contacts: Contact[];
    loadContacts: () => void;
}

export type EngagementParams = {
    engagementId: string;
};

export const WidgetDrawerContext = createContext<WidgetDrawerContextProps>({
    widgets: [],
    isWidgetsLoading: false,
    loadingContacts: false,
    widgetDrawerOpen: false,
    handleWidgetDrawerOpen: (_open: boolean) => {
        /* empty default method  */
    },
    addContactDrawerOpen: false,
    handleAddContactDrawerOpen: (_open: boolean) => {
        /* empty default method  */
    },
    widgetDrawerTabValue: 'widgetOptions',
    handleWidgetDrawerTabValueChange: (_tabValue: string) => {
        /* empty default method  */
    },
    loadWidgets: () => {
        /* empty default method  */
    },
    contacts: [],
    loadContacts: () => {
        /* empty default method  */
    },
});

export const WidgetDrawerProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const { savedEngagement } = useContext(ActionContext);
    const dispatch = useAppDispatch();

    const [widgets, setWidgets] = useState<WidgetsList[]>([]);
    const [isWidgetsLoading, setIsWidgetsLoading] = useState(false);
    const [widgetDrawerOpen, setWidgetDrawerOpen] = useState(false);
    const [widgetDrawerTabValue, setWidgetDrawerTabValue] = React.useState('widgetOptions');
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loadingContacts, setLoadingContacts] = useState(false);

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

    const [addContactDrawerOpen, setAddContactDrawerOpen] = useState(false);

    const loadWidgets = async () => {
        if (!savedEngagement.id) {
            return;
        }

        try {
            setIsWidgetsLoading(true);
            const widgetsList = await getWidgets(savedEngagement.id, { grouped_by_type: true });
            setWidgets(widgetsList);
            setIsWidgetsLoading(false);
            console.log(widgetsList);
        } catch (err) {
            console.log(err);
            setIsWidgetsLoading(false);
            dispatch(openNotification({ severity: 'error', text: 'Error fetching engagement widgets' }));
        }
    };

    useEffect(() => {
        console.log(savedEngagement);
        loadWidgets();
    }, [savedEngagement]);

    const handleWidgetDrawerOpen = (open: boolean) => {
        setWidgetDrawerOpen(open);
    };

    const handleAddContactDrawerOpen = (open: boolean) => {
        setAddContactDrawerOpen(open);
    };

    const handleWidgetDrawerTabValueChange = (tabValue: string) => {
        setWidgetDrawerTabValue(tabValue);
    };

    return (
        <WidgetDrawerContext.Provider
            value={{
                widgets,
                widgetDrawerOpen,
                handleWidgetDrawerOpen,
                widgetDrawerTabValue,
                handleWidgetDrawerTabValueChange,
                addContactDrawerOpen,
                handleAddContactDrawerOpen,
                isWidgetsLoading,
                loadWidgets,
                loadingContacts,
                contacts,
                loadContacts,
            }}
        >
            {children}
        </WidgetDrawerContext.Provider>
    );
};
