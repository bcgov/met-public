import React, { useContext, useState } from 'react';
import { Grid, TextField } from '@mui/material';
import { MetLabel, PrimaryButton, SecondaryButton } from 'components/common';
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
                    <SecondaryButton
                        sx={{
                            borderColor: '#707070',
                            color: '#494949',
                            '&:hover': {
                                background: '#f2f2f2',
                            },
                        }}
                        onClick={() => setCreateFolderMode(true)}
                    >
                        Create Folder
                    </SecondaryButton>
                </Grid>
                <Grid item>
                    <SecondaryButton
                        sx={{
                            borderColor: '#707070',
                            color: '#494949',
                            '&:hover': {
                                background: '#f2f2f2',
                            },
                        }}
                        onClick={() => handleFileDrawerOpen(true)}
                    >
                        Add Document
                    </SecondaryButton>
                </Grid>
            </Grid>

            <When condition={createFolderMode}>
                <Grid item xs={12} container direction="row" justifyContent={'flex-start'} mb={5}>
                    <Grid item xs={12}>
                        <MetLabel>Folder name</MetLabel>
                    </Grid>
                    <Grid container item justifyContent={'flex-start'} alignItems="space-between" spacing={3} xs={12}>
                        <Grid item xs={5}>
                            <TextField
                                label=" "
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                sx={{ width: '100%' }}
                                onChange={(e) => handleFolderNameChange(e.target.value)}
                                error={formError.name || folderName.length > 50}
                                helperText={getErrorMessage()}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <PrimaryButton loading={creatingFolder} onClick={handleCreateFolder}>
                                Save
                            </PrimaryButton>
                        </Grid>
                        <Grid item xs={1}>
                            <SecondaryButton onClick={() => setCreateFolderMode(false)}>Cancel</SecondaryButton>
                        </Grid>
                    </Grid>
                </Grid>
            </When>
        </>
    );
};

export default CreateFolderForm;
