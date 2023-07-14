import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { ActionContext } from '../../ActionContext';
import { DocumentItem } from 'models/document';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { Widget, WidgetType } from 'models/widget';
import { fetchDocuments } from 'services/widgetService/DocumentService';

export interface DocumentsContextProps {
    documentToEdit: DocumentItem | null;
    loadingDocuments: boolean;
    documents: DocumentItem[];
    loadDocuments: () => Promise<DocumentItem[] | undefined>;
    addFileDrawerOpen: boolean;
    handleAddFileDrawerOpen: (_open: boolean) => void;
    widget: Widget | null;
    handleChangeDocumentToEdit: (_document: DocumentItem | null) => void;
    setDocuments: React.Dispatch<React.SetStateAction<DocumentItem[]>>;
    uploadFileDrawerOpen: boolean;
    setUploadFileDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export type EngagementParams = {
    engagementId: string;
};

export const DocumentsContext = createContext<DocumentsContextProps>({
    documentToEdit: null,
    loadingDocuments: false,
    documents: [],
    loadDocuments: () => Promise.resolve([]),
    addFileDrawerOpen: false,
    handleAddFileDrawerOpen: (_open: boolean) => {
        /* empty default method  */
    },
    handleChangeDocumentToEdit: () => {
        /* empty default method  */
    },
    widget: null,
    setDocuments: () => {
        throw new Error('setDocuments() not implemented');
    },
    uploadFileDrawerOpen: false,
    setUploadFileDrawerOpen: () => {
        throw new Error('setUploadFileDrawerOpen not implemented');
    },
});

export const DocumentsProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const dispatch = useAppDispatch();
    const { widgets } = useContext(WidgetDrawerContext);
    const { savedEngagement } = useContext(ActionContext);
    const [documentToEdit, setDocumentToEdit] = useState<DocumentItem | null>(null);
    const [documents, setDocuments] = useState<DocumentItem[]>([]);
    const [loadingDocuments, setLoadingDocuments] = useState(true);
    const [addFileDrawerOpen, setAddDrawerFileOpen] = useState(false);
    const [uploadFileDrawerOpen, setUploadFileDrawerOpen] = useState(false);

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
    const handleChangeDocumentToEdit = (document: DocumentItem | null) => {
        setDocumentToEdit(document);
    };

    const handleAddFileDrawerOpen = (open: boolean) => {
        setAddDrawerFileOpen(open);
        if (!open && documentToEdit) {
            setDocumentToEdit(null);
        }
    };

    useEffect(() => {
        loadDocuments();
    }, [savedEngagement, widget]);

    return (
        <DocumentsContext.Provider
            value={{
                handleChangeDocumentToEdit,
                documentToEdit,
                loadingDocuments,
                documents,
                setDocuments,
                loadDocuments,
                addFileDrawerOpen,
                handleAddFileDrawerOpen,
                widget,
                uploadFileDrawerOpen,
                setUploadFileDrawerOpen,
            }}
        >
            {children}
        </DocumentsContext.Provider>
    );
};
