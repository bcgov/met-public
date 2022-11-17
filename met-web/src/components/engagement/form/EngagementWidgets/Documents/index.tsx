import React from 'react';
import AddDocumentDrawer from './AddDocumentDrawer';
import { DocumentsProvider } from './DocumentsContext';
import DocumentForm from './DocumentForm';

export const Documents = () => {
    return (
        <DocumentsProvider>
            <DocumentForm />
            <AddDocumentDrawer />
        </DocumentsProvider>
    );
};

export default Documents;
