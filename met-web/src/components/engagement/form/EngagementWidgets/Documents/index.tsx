import React from 'react';
import { DocumentsProvider } from './DocumentsContext';
import DocumentForm from './DocumentForm';

export const Documents = () => {
    return (
        <DocumentsProvider>
            <DocumentForm />
        </DocumentsProvider>
    );
};

export default Documents;
