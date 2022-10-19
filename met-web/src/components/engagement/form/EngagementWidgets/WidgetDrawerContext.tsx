import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAppDispatch } from 'hooks';
import { WidgetsList } from 'models/widget';
import { openNotification } from 'services/notificationService/notificationSlice';
import { getWidgets } from 'services/widgetService';
import { ActionContext } from '../ActionContext';
import { getContacts } from 'services/contactService';
import { Contact } from 'models/contact';
import { WidgetTabValues } from './type';

export interface WidgetDrawerContextProps {
    widgets: WidgetsList[];
    widgetDrawerOpen: boolean;
    handleWidgetDrawerOpen: (_open: boolean) => void;
    widgetDrawerTabValue: string;
    handleWidgetDrawerTabValueChange: (_tabValue: string) => void;
    addContactDrawerOpen: boolean;
    handleAddContactDrawerOpen: (_open: boolean) => void;
    isWidgetsLoading: boolean;
    loadWidgets: () => Promise<void>;
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
    widgetDrawerTabValue: WidgetTabValues.WIDGET_OPTIONS,
    handleWidgetDrawerTabValueChange: (_tabValue: string) => {
        /* empty default method  */
    },
    loadWidgets: () => Promise.resolve(),
    contacts: [],
    loadContacts: () => {
        /* empty default method  */
    },
});

export const WidgetDrawerProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const { savedEngagement } = useContext(ActionContext);
    const dispatch = useAppDispatch();

    const [widgets, setWidgets] = useState<WidgetsList[]>([]);
    const [isWidgetsLoading, setIsWidgetsLoading] = useState(true);
    const [widgetDrawerOpen, setWidgetDrawerOpen] = useState(false);
    const [widgetDrawerTabValue, setWidgetDrawerTabValue] = React.useState(WidgetTabValues.WIDGET_OPTIONS);
    const [addContactDrawerOpen, setAddContactDrawerOpen] = useState(false);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loadingContacts, setLoadingContacts] = useState(true);

    const loadContacts = async () => {
        try {
            if (!savedEngagement.id) {
                setLoadingContacts(false);
                return;
            }
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

    const loadWidgets = async () => {
        if (!savedEngagement.id) {
            setIsWidgetsLoading(false);
            return;
        }

        try {
            setIsWidgetsLoading(true);
            const widgetsList = await getWidgets(savedEngagement.id);
            setWidgets(widgetsList);
            setIsWidgetsLoading(false);
        } catch (err) {
            console.log(err);
            setIsWidgetsLoading(false);
            dispatch(openNotification({ severity: 'error', text: 'Error fetching engagement widgets' }));
        }
    };

    useEffect(() => {
        loadWidgets();
        loadContacts();
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
