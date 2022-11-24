import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { ActionContext } from '../../ActionContext';
import { DocumentItem } from 'models/document';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { Widget, WidgetType } from 'models/widget';
import { fetchDocuments } from 'services/widgetService/DocumentService.tsx';

export interface DocumentsContextProps {
    loadingDocuments: boolean;
    documents: DocumentItem[];
    loadDocuments: () => Promise<DocumentItem[] | undefined>;
    fileDrawerOpen: boolean;
    handleFileDrawerOpen: (_open: boolean) => void;
    widget: Widget | null;
}

export type EngagementParams = {
    engagementId: string;
};

export const DocumentsContext = createContext<DocumentsContextProps>({
    loadingDocuments: false,
    documents: [],
    loadDocuments: () => Promise.resolve([]),
    fileDrawerOpen: false,
    handleFileDrawerOpen: (_open: boolean) => {
        /* empty default method  */
    },
    widget: null,
});

export const DocumentsProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const dispatch = useAppDispatch();
    const { widgets } = useContext(WidgetDrawerContext);
    const { savedEngagement } = useContext(ActionContext);
    const [documents, setDocuments] = useState<DocumentItem[]>([]);
    const [loadingDocuments, setLoadingDocuments] = useState(true);
    const [fileDrawerOpen, setDrawerFileOpen] = useState(false);

    const widget = widgets.find((widget) => widget.widget_type_id === WidgetType.Document) || null;

    const loadDocuments = async () => {
        try {
            if (!savedEngagement.id || !widget) {
                setLoadingDocuments(false);
                return Promise.resolve([]);
            }
            setLoadingDocuments(true);
            //TODO: setDocuments to fetched Data
            const savedDocuments = await fetchDocuments(widget.id);
            setDocuments(savedDocuments);
            setLoadingDocuments(false);
            return documents;
        } catch (error) {
            console.log(error);
            dispatch(
                openNotification({ severity: 'error', text: 'Error occurred while attempting to load documents' }),
            );
            setLoadingDocuments(false);
        }
    };

    useEffect(() => {
        loadDocuments();
    }, [savedEngagement, widget]);

    const handleFileDrawerOpen = (open: boolean) => {
        setDrawerFileOpen(open);
    };

    return (
        <DocumentsContext.Provider
            value={{
                loadingDocuments,
                documents,
                loadDocuments,
                fileDrawerOpen,
                handleFileDrawerOpen,
                widget,
            }}
        >
            {children}
        </DocumentsContext.Provider>
    );
};
