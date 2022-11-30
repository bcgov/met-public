import React, { useContext } from 'react';
import { Grid } from '@mui/material';
import DocumentSwitch from './DocumentSwitch';
import { DocumentsContext } from './DocumentsContext';

const DocumentsBlock = () => {
    const { documents } = useContext(DocumentsContext);

    return (
        <Grid item xs={12} container alignItems="flex-start" justifyContent={'flex-start'} spacing={2}>
            {documents.map((document) => {
                return <DocumentSwitch key={`document-${document.id}`} documentItem={document} />;
            })}
        </Grid>
    );
};

export default DocumentsBlock;
