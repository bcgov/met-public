import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppDispatch } from 'hooks';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { Widget, WidgetType } from 'models/widget';
import { Subscribe, Subscribe_TYPE, SubscribeTypeLabel, SubscribeForm } from 'models/subscription';
import { getSubscriptionsForms, sortWidgetSubscribeForms } from 'services/subscriptionService';
import { openNotification } from 'services/notificationService/notificationSlice';

export interface SubscribeContextProps {
    emailListTabOpen: boolean;
    setEmailListTabOpen: React.Dispatch<React.SetStateAction<boolean>>;
    formSignUpTabOpen: boolean;
    setFormSignUpTabOpen: React.Dispatch<React.SetStateAction<boolean>>;
    widget: Widget | null;
    loadSubscribe: () => void;
    isLoadingSubscribe: boolean;
    subscribe: SubscribeForm[];
    subscribeToEdit: SubscribeForm | null;
    setSubscribe: React.Dispatch<React.SetStateAction<SubscribeForm[]>>;
    setSubscribeToEdit: React.Dispatch<React.SetStateAction<SubscribeForm | null>>;
    handleSubscribeDrawerOpen: (_Subscribe: SubscribeTypeLabel, _open: boolean) => void;
    updateWidgetSubscribeSorting: (widget_Subscribe: Subscribe[]) => void;
    richEmailListDescription: string;
    setRichEmailListDescription: React.Dispatch<React.SetStateAction<string>>;
    richFormSignUpDescription: string;
    setRichFormSignUpDescription: React.Dispatch<React.SetStateAction<string>>;
}

export type EngagementParams = {
    engagementId: string;
};

export const SubscribeContext = createContext<SubscribeContextProps>({
    emailListTabOpen: false,
    formSignUpTabOpen: false,
    setEmailListTabOpen: () => {
        throw new Error(' setEmailListTabOpen not implemented');
    },
    setFormSignUpTabOpen: () => {
        throw new Error('setFormSignUpTabOpen not implemented');
    },
    widget: null,
    loadSubscribe: () => {
        throw new Error('loadSubscribe not implemented');
    },
    isLoadingSubscribe: false,
    setSubscribe: (updatedSubscribe: React.SetStateAction<SubscribeForm[]>) => [],
    setSubscribeToEdit: (updatedSubscribe: React.SetStateAction<SubscribeForm | null>) => [],
    subscribe: [],
    subscribeToEdit: null,
    handleSubscribeDrawerOpen: (_Subscribe: SubscribeTypeLabel, _open: boolean) => {
        /* empty default method  */
    },
    updateWidgetSubscribeSorting: (widget_Subscribe: Subscribe[]) => {
        /* empty default method  */
    },
    richEmailListDescription: '',
    setRichEmailListDescription: () => {
        throw new Error('setrichEmailListDescription is unimplemented');
    },
    richFormSignUpDescription: '',
    setRichFormSignUpDescription: () => {
        throw new Error('setrichEmailListDescription is unimplemented');
    },
});

export const SubscribeProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const dispatch = useAppDispatch();
    const { widgets } = useContext(WidgetDrawerContext);
    const widget = widgets.find((widget) => widget.widget_type_id === WidgetType.Subscribe) || null;
    const [subscribeToEdit, setSubscribeToEdit] = useState<SubscribeForm | null>(null);
    const [emailListTabOpen, setEmailListTabOpen] = useState(false);
    const [formSignUpTabOpen, setFormSignUpTabOpen] = useState(false);
    const [isLoadingSubscribe, setIsLoadingSubscribe] = useState(true);
    const [subscribe, setSubscribe] = useState<SubscribeForm[]>([]);
    const [richEmailListDescription, setRichEmailListDescription] = useState('');
    const [richFormSignUpDescription, setRichFormSignUpDescription] = useState('');

    const loadSubscribe = async () => {
        if (!widget) {
            return;
        }
        try {
            setIsLoadingSubscribe(true);
            const loadedSubscribe = await getSubscriptionsForms(widget.id);
            setSubscribe(loadedSubscribe);
            setIsLoadingSubscribe(false);
        } catch (error) {
            dispatch(
                openNotification({ severity: 'error', text: 'An error occurred while trying to load the Subscribe' }),
            );
        }
    };

    const handleSubscribeDrawerOpen = (type: SubscribeTypeLabel, open: boolean) => {
        if (type == Subscribe_TYPE.EMAIL_LIST) {
            setEmailListTabOpen(open);
        } else if (type == Subscribe_TYPE.FORM) {
            setFormSignUpTabOpen(open);
        }
    };

    useEffect(() => {
        loadSubscribe();
    }, [widget]);

    const updateWidgetSubscribeSorting = async (resortedWidgetSubscribe: Subscribe[]) => {
        if (!widget) {
            return;
        }
        try {
            await sortWidgetSubscribeForms(widget.id, resortedWidgetSubscribe);
        } catch (err) {
            dispatch(openNotification({ severity: 'error', text: 'Error sorting widget Subscribe' }));
        }
    };

    return (
        <SubscribeContext.Provider
            value={{
                formSignUpTabOpen,
                setFormSignUpTabOpen,
                emailListTabOpen,
                setEmailListTabOpen,
                subscribeToEdit,
                handleSubscribeDrawerOpen,
                widget,
                loadSubscribe,
                isLoadingSubscribe,
                setSubscribe,
                setSubscribeToEdit,
                subscribe,
                updateWidgetSubscribeSorting,
                richEmailListDescription,
                richFormSignUpDescription,
                setRichFormSignUpDescription,
                setRichEmailListDescription,
            }}
        >
            {children}
        </SubscribeContext.Provider>
    );
};
