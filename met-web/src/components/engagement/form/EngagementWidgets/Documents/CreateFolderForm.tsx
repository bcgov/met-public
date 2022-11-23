import React, { useContext, useState } from 'react';
import { Grid, Stack, TextField } from '@mui/material';
import { MetLabel, PrimaryButton, SecondaryButton } from 'components/common';
import { When } from 'react-if';
import { DocumentsContext } from './DocumentsContext';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { postDocument } from 'services/widgetService/DocumentService.tsx';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { WidgetType } from 'models/widget';

const CreateFolderForm = () => {
    const { loadDocuments, handleFileDrawerOpen } = useContext(DocumentsContext);
    const { widgets } = useContext(WidgetDrawerContext);
    const dispatch = useAppDispatch();
    const [createFolderMode, setCreateFolderMode] = useState(false);
    const [creatingFolder, setCreatingFolder] = useState(false);

    const [folderName, setFolderName] = useState('');

    const widget = widgets.find((widget) => widget.widget_type_id === WidgetType.Document);

    const handleCreateFolder = async () => {
        if (!folderName || !widget) {
            return;
        }

        try {
            setCreatingFolder(true);
            await postDocument(widget.id, {
                name: folderName,
                widget_id: widget.id,
            });
            await loadDocuments();
            setCreatingFolder(false);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'An error occured while creating the folder' }));
        }
    };

    return (
        <>
            <Grid
                item
                xs={12}
                container
                direction="row"
                justifyContent={'flex-start'}
                spacing={1}
                sx={{ marginBottom: '3em' }}
            >
                <Grid item>
                    <SecondaryButton onClick={() => setCreateFolderMode(true)}>Create Folder</SecondaryButton>
                </Grid>
                <Grid item>
                    <SecondaryButton onClick={() => handleFileDrawerOpen(true)}>Add Document</SecondaryButton>
                </Grid>
            </Grid>

            <When condition={createFolderMode}>
                <Grid item xs={12} container direction="row" justifyContent={'flex-start'}>
                    <Grid item xs={12}>
                        <MetLabel>Folder name</MetLabel>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack direction="row" justifyContent={'flex-start'} alignItems="stretch" spacing={2}>
                            <TextField
                                label=" "
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                onChange={(e) => setFolderName(e.target.value)}
                            />

                            <SecondaryButton onClick={() => setCreateFolderMode(false)}>Cancel</SecondaryButton>

                            <PrimaryButton loading={creatingFolder} onClick={handleCreateFolder}>
                                Submit
                            </PrimaryButton>
                        </Stack>
                    </Grid>
                </Grid>
            </When>
        </>
    );
};

export default CreateFolderForm;
