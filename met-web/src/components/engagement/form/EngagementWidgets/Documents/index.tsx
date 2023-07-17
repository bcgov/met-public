import React from 'react';
import { DocumentsProvider } from './DocumentsContext';
import DocumentForm from './DocumentForm';
import AddFileDrawer from './AddFileDrawer';
import UploadFileDrawer from './UploadFileDrawer';

export const Documents = () => {
    return (
        <DocumentsProvider>
            <DocumentForm />
            <AddFileDrawer />
            <UploadFileDrawer />
        </DocumentsProvider>
    );
};

export default Documents;
