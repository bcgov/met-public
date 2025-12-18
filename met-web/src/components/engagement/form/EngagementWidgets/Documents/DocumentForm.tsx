import React, { useContext } from 'react';
import { Divider, Grid } from '@mui/material';
import { PrimaryButtonOld } from 'components/common';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import CreateFolderForm from './CreateFolderForm';
import DocumentsBlock from './DocumentsBlock';
import { WidgetTitle } from '../WidgetTitle';
import { DocumentsContext } from './DocumentsContext';

const DocumentForm = () => {
    const { handleWidgetDrawerOpen } = useContext(WidgetDrawerContext);
    const { widget } = useContext(DocumentsContext);

    return (
        <Grid item xs={12} container alignItems="flex-start" justifyContent={'flex-start'} spacing={3}>
            <Grid item xs={12}>
                {widget && <WidgetTitle widget={widget} />}
                <Divider sx={{ marginTop: '0.5em' }} />
            </Grid>

            <Grid item xs={12}>
                <CreateFolderForm />
            </Grid>

            <Grid item xs={12}>
                <DocumentsBlock />
            </Grid>

            <Grid item xs={12} container direction="row" spacing={1} justifyContent={'flex-start'} marginTop="8em">
                <Grid item>
                    <PrimaryButtonOld onClick={() => handleWidgetDrawerOpen(false)}>{`Close`}</PrimaryButtonOld>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default DocumentForm;
