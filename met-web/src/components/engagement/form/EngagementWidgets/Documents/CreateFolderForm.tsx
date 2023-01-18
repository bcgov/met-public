import React, { useContext, useState } from 'react';
import { Grid, TextField, Stack } from '@mui/material';
import { MetLabel, PrimaryButton, SecondaryButton, WidgetButton } from 'components/common';
import { When } from 'react-if';
import { DocumentsContext } from './DocumentsContext';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { postDocument } from 'services/widgetService/DocumentService.tsx';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { WidgetType } from 'models/widget';
import { DOCUMENT_TYPE } from 'models/document';

const CreateFolderForm = () => {
    const { loadDocuments, handleFileDrawerOpen } = useContext(DocumentsContext);
    const { widgets } = useContext(WidgetDrawerContext);
    const dispatch = useAppDispatch();
    const [createFolderMode, setCreateFolderMode] = useState(false);
    const [creatingFolder, setCreatingFolder] = useState(false);
    const [folderName, setFolderName] = useState('');
    const initialFormError = {
        name: false,
    };
    const [formError, setFormError] = useState(initialFormError);
    const widget = widgets.find((widget) => widget.widget_type_id === WidgetType.Document);

    const validate = () => {
        setFormError({
            name: !folderName || folderName.length > 50,
        });
        return Object.values(formError).some((errorExists) => errorExists);
    };

    const getErrorMessage = () => {
        if (folderName.length > 50) {
            return 'Folder name must not exceed 50 characters';
        } else if (!folderName && formError.name) {
            return 'Folder name must be specified';
        }
        return '';
    };

    const handleCreateFolder = async () => {
        if (!widget || validate()) {
            return;
        }

        try {
            setCreatingFolder(true);
            await postDocument(widget.id, {
                title: folderName,
                widget_id: widget.id,
                type: DOCUMENT_TYPE.FOLDER,
            });
            await loadDocuments();
            setCreatingFolder(false);
            setCreateFolderMode(false);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'An error occured while creating the folder' }));
            setCreatingFolder(false);
        }
    };

    const handleFolderNameChange = (name: string) => {
        validate();
        setFolderName(name);
    };

    return (
        <>
            <Grid item xs={12} container direction="row" justifyContent={'flex-start'} spacing={1} sx={{ mb: 5 }}>
                <Grid item>
                    <WidgetButton onClick={() => setCreateFolderMode(true)}>Create Folder</WidgetButton>
                </Grid>
                <Grid item>
                    <WidgetButton onClick={() => handleFileDrawerOpen(true)}>Add Document</WidgetButton>
                </Grid>
            </Grid>

            <When condition={createFolderMode}>
                <Grid item xs={12} container direction="row" justifyContent={'center'} mb={5}>
                    <Grid item xs={12}>
                        <MetLabel>Folder name</MetLabel>
                    </Grid>
                    <Grid
                        container
                        item
                        justifyContent={'flex-start'}
                        alignItems={formError.name || folderName.length > 50 ? 'center' : 'flex-start'}
                        spacing={2}
                        xs={12}
                        sx={{ p: 0 }}
                    >
                        <Grid item xs={8} sx={{ p: 0 }}>
                            <TextField
                                label=" "
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                sx={{ width: '100%', p: 0, m: 0 }}
                                onChange={(e) => handleFolderNameChange(e.target.value)}
                                error={formError.name || folderName.length > 50}
                                helperText={getErrorMessage()}
                            />
                        </Grid>
                        <Grid item lg={2.5} md={5}>
                            <Stack
                                direction={{ md: 'column', lg: 'row' }}
                                spacing={1.5}
                                width="100%"
                                justifyContent="flex-end"
                            >
                                <PrimaryButton sx={{ mb: 1 }} loading={creatingFolder} onClick={handleCreateFolder}>
                                    Save
                                </PrimaryButton>
                                <SecondaryButton sx={{ mb: 1 }} onClick={() => setCreateFolderMode(false)}>
                                    Cancel
                                </SecondaryButton>
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
            </When>
        </>
    );
};

export default CreateFolderForm;
