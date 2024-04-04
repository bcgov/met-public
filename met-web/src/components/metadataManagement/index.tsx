import React from 'react';
import ActionProvider from './ActionContext';
import { TaxonEditor } from './TaxonEditor';

const MetadataManagement = () => {
    return (
        <ActionProvider>
            <TaxonEditor />
        </ActionProvider>
    );
};

export default MetadataManagement;
