import React from 'react';
import { DocumentsProvider } from './DocumentsContext';
import DocumentForm from './DocumentForm';
import FileDrawer from './FileDrawer';

export const Documents = () => {
    return (
        <DocumentsProvider>
            <DocumentForm />
            <FileDrawer />
        </DocumentsProvider>
    );
};

export default Documents;
