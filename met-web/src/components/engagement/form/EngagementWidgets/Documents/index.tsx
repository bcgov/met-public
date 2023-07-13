import React from 'react';
import { DocumentsProvider } from './DocumentsContext';
import DocumentForm from './DocumentForm';
import AddFileDrawer from './AddFileDrawer';

export const Documents = () => {
    return (
        <DocumentsProvider>
            <DocumentForm />
            <AddFileDrawer />
        </DocumentsProvider>
    );
};

export default Documents;
