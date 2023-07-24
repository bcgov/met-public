import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppDispatch } from 'hooks';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { Widget, WidgetType } from 'models/widget';
import { Subscribe, Unsubscribe, Subscribe_TYPE, SubscribeTypeLabel } from 'models/subscription';
import { openNotification } from 'services/notificationService/notificationSlice';

export interface SubscribeContextProps {
    emailListTabOpen: boolean;
    setEmailListTabOpen: React.Dispatch<React.SetStateAction<boolean>>;
    formSignUpTabOpen: boolean;
    setFormSignUpTabOpen: React.Dispatch<React.SetStateAction<boolean>>;
    widget: Widget | null;
    loadSubscribe: () => void;
    isLoadingSubscribe: boolean;
    Subscribe: Subscribe[];
    SubscribeToEdit: Subscribe | null;
    setSubscribe: React.Dispatch<React.SetStateAction<Subscribe[]>>;
    handleChangeSubscribeToEdit: (_Subscribe: Subscribe | null) => void;
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
    setSubscribe: (updatedSubscribe: React.SetStateAction<Subscribe[]>) => [],
    Subscribe: [],
    SubscribeToEdit: null,
    handleChangeSubscribeToEdit: () => {
        /* empty default method  */
    },
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
    const [SubscribeToEdit, setSubscribeToEdit] = useState<Subscribe | null>(null);
    const [emailListTabOpen, setEmailListTabOpen] = useState(false);
    const [formSignUpTabOpen, setFormSignUpTabOpen] = useState(false);
    const [isLoadingSubscribe, setIsLoadingSubscribe] = useState(true);
    const [Subscribe, setSubscribe] = useState<Subscribe[]>([]);
    const [richEmailListDescription, setRichEmailListDescription] = useState('');
    const [richFormSignUpDescription, setRichFormSignUpDescription] = useState('');
    const loadSubscribe = async () => {
        // if (!widget) {
        //     return;
        // }
        // try {
        //     setIsLoadingSubscribe(true);
        //     const loadedSubscribe = await getSubscribe(widget.id);
        //     setSubscribe(loadedSubscribe);
        //     setIsLoadingSubscribe(false);
        // } catch (error) {
        //     dispatch(
        //         openNotification({ severity: 'error', text: 'An error occurred while trying to load the Subscribe' }),
        //     );
        // }
    };

    const handleChangeSubscribeToEdit = (Subscribe: Subscribe | null) => {
        // setSubscribeToEdit(Subscribe);
    };

    const handleSubscribeDrawerOpen = (type: SubscribeTypeLabel, open: boolean) => {
        if (type == Subscribe_TYPE.EMAIL_LIST) {
            console.log('TYPE:' + type + ' : ' + open);
            setEmailListTabOpen(open);
        } else if (type == Subscribe_TYPE.FORM) {
            console.log('TYPE:' + type + ' : ' + open);
            setFormSignUpTabOpen(open);
        }
    };

    useEffect(() => {
        loadSubscribe();
    }, [widget]);

    const updateWidgetSubscribeSorting = async (resortedWidgetSubscribe: Subscribe[]) => {
        // if (!widget) {
        //     return;
        // }
        // try {
        //     await sortWidgetSubscribe(widget.id, resortedWidgetSubscribe);
        // } catch (err) {
        //     dispatch(openNotification({ severity: 'error', text: 'Error sorting widget Subscribe' }));
        // }
    };

    return (
        <SubscribeContext.Provider
            value={{
                formSignUpTabOpen,
                setFormSignUpTabOpen,
                emailListTabOpen,
                setEmailListTabOpen,
                SubscribeToEdit,
                handleChangeSubscribeToEdit,
                handleSubscribeDrawerOpen,
                widget,
                loadSubscribe,
                isLoadingSubscribe,
                setSubscribe,
                Subscribe,
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
