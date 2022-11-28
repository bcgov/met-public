import React, { useContext } from 'react';
import { Divider, Grid } from '@mui/material';
import { MetHeader3, PrimaryButton, SecondaryButton } from 'components/common';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import CreateFolderForm from './CreateFolderForm';
import DocumentsBlock from './DocumentsBlock';

const DocumentForm = () => {
    const { handleWidgetDrawerOpen } = useContext(WidgetDrawerContext);

    return (
        <>
            <Grid item xs={12} container alignItems="flex-start" justifyContent={'flex-start'} spacing={3}>
                <Grid item xs={12}>
                    <MetHeader3>Documents</MetHeader3>
                    <Divider sx={{ marginTop: '1em' }} />
                </Grid>

                <Grid item xs={12}>
                    <CreateFolderForm />
                </Grid>

                <Grid item xs={12}>
                    <DocumentsBlock />
                </Grid>

                <Grid item xs={12} container direction="row" spacing={1} justifyContent={'flex-start'} marginTop="8em">
                    <Grid item>
                        <PrimaryButton onClick={() => handleWidgetDrawerOpen(false)}>{`Save & Close`}</PrimaryButton>
                    </Grid>
                    <Grid item>
                        <SecondaryButton onClick={() => handleWidgetDrawerOpen(false)}>{`Cancel`}</SecondaryButton>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default DocumentForm;
