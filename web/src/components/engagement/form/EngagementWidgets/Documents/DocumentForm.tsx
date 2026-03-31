import React, { useContext } from 'react';
import { Divider, Grid2 as Grid } from '@mui/material';
import { Button } from 'components/common/Input/Button';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import CreateFolderForm from './CreateFolderForm';
import DocumentsBlock from './DocumentsBlock';
import { WidgetTitle } from '../WidgetTitle';
import { DocumentsContext } from './DocumentsContext';

const DocumentForm = () => {
    const { setWidgetDrawerOpen } = useContext(WidgetDrawerContext);
    const { widget } = useContext(DocumentsContext);

    return (
        <Grid size={12} container alignItems="flex-start" justifyContent={'flex-start'} spacing={3}>
            <Grid size={12}>
                {widget && <WidgetTitle widget={widget} />}
                <Divider sx={{ marginTop: '0.5em' }} />
            </Grid>

            <Grid size={12}>
                <CreateFolderForm />
            </Grid>

            <Grid size={12}>
                <DocumentsBlock />
            </Grid>

            <Grid size={12} container direction="row" spacing={1} justifyContent={'flex-start'} marginTop="8em">
                <Grid size={12}>
                    <Button variant="primary" onClick={() => setWidgetDrawerOpen(false)}>{`Close`}</Button>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default DocumentForm;
