import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { ActionContext } from '../../ActionContext';
import { Document } from 'models/document';

export interface DocumentsContextProps {
    documentToEdit: Document | null;
    addDocumentDrawerOpen: boolean;
    handleAddDocumentDrawerOpen: (_open: boolean) => void;
    clearSelected: () => void;
    loadingDocuments: boolean;
    documents: Document[];
    loadDocuments: () => Promise<Document[] | undefined>;
    handleChangeDocumentToEdit: (_document: Document | null) => void;
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
    handleChangeDocumentToEdit: () => {
        /* empty default method  */
    },
});

export const DocumentsProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const { savedEngagement } = useContext(ActionContext);
    const dispatch = useAppDispatch();
    const [documentToEdit, setDocumentToEdit] = useState<Document | null>(null);
    const [addDocumentDrawerOpen, setAddDocumentDrawerOpen] = useState(false);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loadingDocuments, setLoadingDocuments] = useState(true);

    const loadDocuments = async () => {
        try {
            if (!savedEngagement.id) {
                setLoadingDocuments(false);
                return Promise.resolve([]);
            }
            setLoadingDocuments(true);
            //TODO: setDocuments to fetched Data
            setDocuments([]);
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

    const handleChangeDocumentToEdit = (document: Document | null) => {
        setDocumentToEdit(document);
    };

    const handleAddDocumentDrawerOpen = (open: boolean) => {
        setAddDocumentDrawerOpen(open);
        if (!open && documentToEdit) {
            setDocumentToEdit(null);
        }
    };

    return (
        <DocumentsContext.Provider
            value={{
                addDocumentDrawerOpen,
                handleAddDocumentDrawerOpen,
                loadingDocuments,
                documents,
                loadDocuments,
                documentToEdit,
                clearSelected,
                handleChangeDocumentToEdit,
            }}
        >
            {children}
        </DocumentsContext.Provider>
    );
};
