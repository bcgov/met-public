import React, { useContext, useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import { Grid, MenuItem } from '@mui/material';
import { MetHeader3, MetLabel, MetParagraph, MetWidgetPaper, PrimaryButton, SecondaryButton } from 'components/common';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ControlledTextField from 'components/common/ControlledInputComponents/ControlledTextField';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { DocumentsContext } from './DocumentsContext';
import ControlledSelect from 'components/common/ControlledInputComponents/ControlledSelect';
import { postDocument } from 'services/widgetService/DocumentService';
import { DOCUMENT_TYPE, DocumentItem } from 'models/document';
import { saveDocument } from 'services/objectStorageService';
import FileUpload from 'components/common/FileUpload';
import { If, Then, Else } from 'react-if';

const schema = yup
    .object({
        name: yup.string().max(50, 'Document name should not exceed 50 characters').required(),
        folderId: yup.number(),
    })
    .required();

type UploadFileForm = yup.TypeOf<typeof schema>;

const OneMegaByte = 1000000;

const UploadFileDrawer = () => {
    const dispatch = useAppDispatch();
    const { documentToEdit, documents, loadDocuments, widget, uploadFileDrawerOpen, setUploadFileDrawerOpen } =
        useContext(DocumentsContext);
    const [isUploadingFile, setIsUploadingFile] = useState(false);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);

    const parentDocument = documents.find(
        (document: DocumentItem) => document.id === documentToEdit?.parent_document_id,
    );
    const methods = useForm<UploadFileForm>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            folderId: 0,
        },
    });

    const { handleSubmit, reset } = methods;

    const resetState = () => {
        reset();
        setFileToUpload(null);
    };

    const handleClose = () => {
        resetState();
        setUploadFileDrawerOpen(false);
    };

    const handleUploadFile = async (fileName: string) => {
        if (!fileToUpload) {
            return Promise.reject('No file to upload');
        }
        const fileExtension = fileToUpload.name.split('.').pop();
        const savedDocumentDetails = await saveDocument(fileToUpload, {
            filename: `${fileName}.${fileExtension}`,
        });
        return savedDocumentDetails;
    };

    interface CreateDocumentParams {
        name: string;
        folderId: number | null;
        link: string;
    }
    const createDocument = async (data: CreateDocumentParams) => {
        if (!widget) {
            return;
        }
        const { folderId, name, link } = data;
        await postDocument(widget.id, {
            title: name,
            parent_document_id: folderId,
            url: link,
            widget_id: widget.id,
            type: 'file',
        });
        dispatch(
            openNotification({
                severity: 'success',
                text: 'Document was successfully created',
            }),
        );
    };

    const onSubmit: SubmitHandler<UploadFileForm> = async (data: UploadFileForm) => {
        if (!widget) {
            return;
        }
        try {
            setIsUploadingFile(true);
            const { folderId, name } = await schema.validate(data);

            const uploadDetails = await handleUploadFile(name);
            await createDocument({
                folderId: folderId || null,
                name: name,
                link: uploadDetails.filepath,
            });

            await loadDocuments();
            setFileToUpload(null);
            setIsUploadingFile(false);
            handleClose();
        } catch (err) {
            console.log(err);
            dispatch(openNotification({ severity: 'error', text: 'An error occured while trying to upload File' }));
            setIsUploadingFile(false);
        }
    };

    return (
        <Drawer
            anchor="right"
            open={uploadFileDrawerOpen}
            onClose={() => {
                handleClose();
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
                            <If condition={Boolean(fileToUpload)}>
                                <Then>
                                    <Grid
                                        item
                                        xs={12}
                                        container
                                        direction="row"
                                        alignItems="flex-start"
                                        justifyContent="flex-start"
                                    >
                                        <Grid item xs={12}>
                                            <MetLabel sx={{ marginBottom: '2px' }}>
                                                You have successfully added this document
                                            </MetLabel>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <MetWidgetPaper elevation={1} sx={{ width: '100%' }}>
                                                <Grid
                                                    container
                                                    direction="row"
                                                    alignItems={'center'}
                                                    justifyContent="flex-start"
                                                    spacing={1}
                                                >
                                                    <Grid item xs={12}>
                                                        <MetLabel>{fileToUpload?.name}</MetLabel>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <MetParagraph>{fileToUpload?.type}</MetParagraph>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        {fileToUpload && (
                                                            <MetParagraph>
                                                                {`${fileToUpload.size / OneMegaByte} MB`}
                                                            </MetParagraph>
                                                        )}
                                                    </Grid>
                                                </Grid>
                                            </MetWidgetPaper>
                                        </Grid>
                                    </Grid>
                                </Then>
                                <Else>
                                    <Grid item xs={12}>
                                        <FileUpload
                                            handleAddFile={(file: File[]) => {
                                                setFileToUpload(file[0]);
                                            }}
                                        />
                                    </Grid>
                                </Else>
                            </If>
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
                                <PrimaryButton loading={isUploadingFile} onClick={handleSubmit(onSubmit)}>
                                    {`Save & Close`}
                                </PrimaryButton>
                            </Grid>
                            <Grid item>
                                <SecondaryButton
                                    disabled={isUploadingFile}
                                    onClick={() => handleClose()}
                                >{`Cancel`}</SecondaryButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </FormProvider>
            </Box>
        </Drawer>
    );
};

export default UploadFileDrawer;
