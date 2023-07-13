import React, { useContext, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import { Grid, MenuItem } from '@mui/material';
import { MetHeader3, MetLabel, PrimaryButton, SecondaryButton } from 'components/common';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ControlledTextField from 'components/common/ControlledInputComponents/ControlledTextField';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { DocumentsContext } from './DocumentsContext';
import ControlledSelect from 'components/common/ControlledInputComponents/ControlledSelect';
import { postDocument, patchDocument, PatchDocumentRequest } from 'services/widgetService/DocumentService';
import { DOCUMENT_TYPE, DocumentItem } from 'models/document';
import { updatedDiff } from 'deep-object-diff';

const schema = yup
    .object({
        name: yup.string().max(50, 'Document name should not exceed 50 characters').required(),
        link: yup.string().max(2000, 'URL should not exceed 2000 characters').required(),
        folderId: yup.number(),
    })
    .required();

type AddFileForm = yup.TypeOf<typeof schema>;

const AddFileDrawer = () => {
    const dispatch = useAppDispatch();
    const { documentToEdit, documents, loadDocuments, handleFileDrawerOpen, fileDrawerOpen, widget } =
        useContext(DocumentsContext);
    const [isCreatingFile, setIsCreatingDocument] = useState(false);
    const parentDocument = documents.find(
        (document: DocumentItem) => document.id === documentToEdit?.parent_document_id,
    );
    const methods = useForm<AddFileForm>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            link: '',
            folderId: 0,
        },
    });

    const { handleSubmit, reset } = methods;

    useEffect(() => {
        methods.setValue('name', documentToEdit?.title || '');
        methods.setValue('link', documentToEdit?.url || '');
        methods.setValue('folderId', documentToEdit?.parent_document_id || 0);
    }, [documentToEdit]);

    const handleClose = () => {
        reset();
        handleFileDrawerOpen(false);
    };

    const updateDocument = async (data: AddFileForm) => {
        if (!(documentToEdit && widget)) {
            return;
        }
        setIsCreatingDocument(true);
        const documentEditsToPatch = updatedDiff(documentToEdit, {
            title: data.name,
            parent_document_id: data.folderId === 0 ? null : data.folderId,
            url: data.link,
        }) as PatchDocumentRequest;
        await patchDocument(widget.id, documentToEdit.id, {
            ...documentEditsToPatch,
        });
        dispatch(
            openNotification({
                severity: 'success',
                text: 'Document was successfully updated',
            }),
        );
        await loadDocuments();
        setIsCreatingDocument(false);
        handleClose();
    };

    const createDocument = async (data: AddFileForm) => {
        if (!widget) {
            return;
        }
        setIsCreatingDocument(true);
        await postDocument(widget.id, {
            title: data.name,
            parent_document_id: data.folderId === 0 ? null : data.folderId,
            url: data.link,
            widget_id: widget.id,
            type: 'file',
        });
        dispatch(
            openNotification({
                severity: 'success',
                text: 'Document was successfully created',
            }),
        );
        await loadDocuments();
        setIsCreatingDocument(false);
        handleClose();
    };

    const saveDocument = async (data: AddFileForm) => {
        if (documentToEdit) {
            return await updateDocument(data);
        }
        return await createDocument(data);
    };

    const onSubmit: SubmitHandler<AddFileForm> = async (data: AddFileForm) => {
        if (!widget) {
            return;
        }
        try {
            return await saveDocument(data);
        } catch (err) {
            console.log(err);
            dispatch(openNotification({ severity: 'error', text: 'An error occured while trying to save File' }));
        }
    };

    return (
        <Drawer
            anchor="right"
            open={fileDrawerOpen}
            onClose={() => {
                handleFileDrawerOpen(false);
            }}
        >
            <Box sx={{ width: '40vw', paddingTop: '7em' }} role="presentation">
                <FormProvider {...methods}>
                    <Grid
                        container
                        direction="row"
                        alignItems="baseline"
                        justifyContent="flex-start"
                        spacing={2}
                        padding="2em"
                    >
                        <Grid item xs={12}>
                            <MetHeader3 bold>{documentToEdit ? 'Edit File' : 'Add File'}</MetHeader3>
                            <Divider sx={{ marginTop: '1em' }} />
                        </Grid>

                        <Grid item xs={12} container direction="row" spacing={2}>
                            <Grid item xs={12}>
                                <MetLabel sx={{ marginBottom: '2px' }}>Link</MetLabel>
                                <ControlledTextField
                                    name="link"
                                    id="document-link"
                                    data-testid="document-form/link"
                                    variant="outlined"
                                    label=" "
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                        </Grid>

                        <Grid item xs={12} container direction="row" spacing={2}>
                            <Grid item xs={12}>
                                <MetLabel sx={{ marginBottom: '2px' }}>Name</MetLabel>
                                <ControlledTextField
                                    name="name"
                                    id="document-name"
                                    data-testid="document-form/name"
                                    variant="outlined"
                                    label=" "
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                        </Grid>

                        <Grid item xs={12} container direction="row" spacing={2}>
                            <Grid item xs={12}>
                                <MetLabel sx={{ marginBottom: '2px' }}>Folder</MetLabel>
                                <ControlledSelect
                                    id="document-folder"
                                    name="folderId"
                                    data-testid="document-form/folderId"
                                    variant="outlined"
                                    label=" "
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    defaultValue={parentDocument?.title}
                                    fullWidth
                                    size="small"
                                >
                                    <MenuItem
                                        key={`folder-option-0`}
                                        value={0}
                                        sx={{ fontStyle: 'italic', height: '2em' }}
                                    >
                                        none
                                    </MenuItem>
                                    {documents
                                        .filter((document) => document.type === DOCUMENT_TYPE.FOLDER)
                                        .map((document) => {
                                            return (
                                                <MenuItem key={`folder-option-${document.id}`} value={document.id}>
                                                    {document.title}
                                                </MenuItem>
                                            );
                                        })}
                                </ControlledSelect>
                            </Grid>
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            container
                            direction="row"
                            spacing={1}
                            justifyContent={'flex-start'}
                            marginTop="8em"
                        >
                            <Grid item>
                                <PrimaryButton loading={isCreatingFile} onClick={handleSubmit(onSubmit)}>
                                    {`Save & Close`}
                                </PrimaryButton>
                            </Grid>
                            <Grid item>
                                <SecondaryButton onClick={() => handleClose()}>{`Cancel`}</SecondaryButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </FormProvider>
            </Box>
        </Drawer>
    );
};

export default AddFileDrawer;
