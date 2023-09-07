import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppDispatch } from 'hooks';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { Widget, WidgetType } from 'models/widget';
import { SUBSCRIBE_TYPE, SubscribeTypeLabel, SubscribeForm } from 'models/subscription';
import { getSubscriptionsForms, sortWidgetSubscribeForms } from 'services/subscriptionService';
import { openNotification } from 'services/notificationService/notificationSlice';

export interface SubscribeContextProps {
    emailListTabOpen: boolean;
    setEmailListTabOpen: React.Dispatch<React.SetStateAction<boolean>>;
    formSignUpTabOpen: boolean;
    setFormSignUpTabOpen: React.Dispatch<React.SetStateAction<boolean>>;
    widget: Widget | null;
    loadSubscribeOptions: () => void;
    isLoadingSubscribe: boolean;
    subscribeOptions: SubscribeForm[];
    subscribeOptionToEdit: SubscribeForm | null;
    setSubscribeOptions: React.Dispatch<React.SetStateAction<SubscribeForm[]>>;
    setSubscribeOptionToEdit: React.Dispatch<React.SetStateAction<SubscribeForm | null>>;
    handleSubscribeDrawerOpen: (_Subscribe: SubscribeTypeLabel, _open: boolean) => void;
    updateWidgetSubscribeSorting: (widget_Subscribe: SubscribeForm[]) => void;
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
    loadSubscribeOptions: () => {
        throw new Error('loadSubscribeOptions not implemented');
    },
    isLoadingSubscribe: false,
    setSubscribeOptions: () => {
        return;
    },
    setSubscribeOptionToEdit: () => {
        return;
    },
    subscribeOptions: [],
    subscribeOptionToEdit: null,
    handleSubscribeDrawerOpen: (_Subscribe: SubscribeTypeLabel, _open: boolean) => {
        /* empty default method  */
    },
    updateWidgetSubscribeSorting: (widget_Subscribe: SubscribeForm[]) => {
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
    const [subscribeOptionToEdit, setSubscribeOptionToEdit] = useState<SubscribeForm | null>(null);
    const [emailListTabOpen, setEmailListTabOpen] = useState(false);
    const [formSignUpTabOpen, setFormSignUpTabOpen] = useState(false);
    const [isLoadingSubscribe, setIsLoadingSubscribe] = useState(true);
    const [subscribeOptions, setSubscribeOptions] = useState<SubscribeForm[]>([]);
    const [richEmailListDescription, setRichEmailListDescription] = useState('');
    const [richFormSignUpDescription, setRichFormSignUpDescription] = useState('');

    const loadSubscribeOptions = async () => {
        if (!widget) {
            return;
        }
        try {
            setIsLoadingSubscribe(true);
            const loadedSubscribe = await getSubscriptionsForms(widget.id);
            setSubscribeOptions(loadedSubscribe);
            setIsLoadingSubscribe(false);
        } catch (error) {
            dispatch(
                openNotification({ severity: 'error', text: 'An error occurred while trying to load the Subscribe' }),
            );
        }
    };

    const resetFormData = () => {
        setRichEmailListDescription('');
        setRichFormSignUpDescription('');
    };

    const handleSubscribeDrawerOpen = (type: SubscribeTypeLabel, open: boolean) => {
        if (type == SUBSCRIBE_TYPE.EMAIL_LIST) {
            setEmailListTabOpen(open);
        } else if (type == SUBSCRIBE_TYPE.SIGN_UP) {
            setFormSignUpTabOpen(open);
        }
        if (open == false) {
            resetFormData();
        }
    };

    useEffect(() => {
        loadSubscribeOptions();
    }, [widget]);

    const updateWidgetSubscribeSorting = async (resortedWidgetSubscribe: SubscribeForm[]) => {
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
                subscribeOptionToEdit,
                handleSubscribeDrawerOpen,
                widget,
                loadSubscribeOptions,
                isLoadingSubscribe,
                setSubscribeOptions,
                setSubscribeOptionToEdit,
                subscribeOptions,
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
