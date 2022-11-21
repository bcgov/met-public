import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { ActionContext } from '../../ActionContext';
import { DocumentItem } from 'models/document';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { WidgetType } from 'models/widget';
import { fetchDocuments } from 'services/widgetService/DocumentService.tsx';

export interface DocumentsContextProps {
    loadingDocuments: boolean;
    documents: DocumentItem[];
    loadDocuments: () => Promise<DocumentItem[] | undefined>;
}

export type EngagementParams = {
    engagementId: string;
};

export const DocumentsContext = createContext<DocumentsContextProps>({
    loadingDocuments: false,
    documents: [],
    loadDocuments: () => Promise.resolve([]),
});

export const DocumentsProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const { widgets } = useContext(WidgetDrawerContext);
    const { savedEngagement } = useContext(ActionContext);
    const dispatch = useAppDispatch();
    const [documents, setDocuments] = useState<DocumentItem[]>([]);
    const [loadingDocuments, setLoadingDocuments] = useState(true);

    const widget = widgets.find((widget) => widget.widget_type_id === WidgetType.Document);

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

    return (
        <DocumentsContext.Provider
            value={{
                loadingDocuments,
                documents,
                loadDocuments,
            }}
        >
            {children}
        </DocumentsContext.Provider>
    );
};
