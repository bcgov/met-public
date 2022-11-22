import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { ActionContext } from '../../ActionContext';
import { DocumentItem } from 'models/document';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { Widget, WidgetType } from 'models/widget';
import { fetchDocuments } from 'services/widgetService/DocumentService.tsx';

export interface DocumentsContextProps {
    documentToEdit: Document | null;
    addDocumentDrawerOpen: boolean;
    handleAddDocumentDrawerOpen: (_open: boolean) => void;
    clearSelected: () => void;
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
    documentToEdit: null,
    addDocumentDrawerOpen: false,
    handleAddDocumentDrawerOpen: (_open: boolean) => {
        /* empty default method  */
    },
    clearSelected: () => {
        /* empty default method  */
    },
    documents: [],
    loadDocuments: () => Promise.resolve([]),
    fileDrawerOpen: false,
    handleFileDrawerOpen: (_open: boolean) => {
        /* empty default method  */
    },
    widget: null,
});

export const DocumentsProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const { savedEngagement } = useContext(ActionContext);
    const dispatch = useAppDispatch();
    const [documentToEdit, setDocumentToEdit] = useState<Document | null>(null);
    const [addDocumentDrawerOpen, setAddDocumentDrawerOpen] = useState(false);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loadingDocuments, setLoadingDocuments] = useState(true);
    const [fileDrawerOpen, setDrawerFileOpen] = useState(false);

    const widget = widgets.find((widget) => widget.widget_type_id === WidgetType.Document) || null;

    const mockDocuments = [
        {
            id: 1,
            name: 'Folder One',
            folder: true,
            items: [],
        },
    ];

    const loadDocuments = async () => {
        try {
            if (!savedEngagement.id) {
                setLoadingDocuments(false);
                return Promise.resolve([]);
            }
            setLoadingDocuments(true);
            //TODO: setDocuments to fetched Data
            // const savedDocuments = await fetchDocuments(widget.id);
            setDocuments(mockDocuments);
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

    const clearSelected = () => {
        setDocumentToEdit(null);
    };

    useEffect(() => {
        loadDocuments();
    }, [savedEngagement]);

    const handleFileDrawerOpen = (open: boolean) => {
        setDrawerFileOpen(open);
    };

    return (
        <DocumentsContext.Provider
            value={{
                addDocumentDrawerOpen,
                handleAddDocumentDrawerOpen,
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
