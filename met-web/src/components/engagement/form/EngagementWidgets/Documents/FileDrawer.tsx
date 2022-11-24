import React, { useContext, useState } from 'react';
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
import { postDocument } from 'services/widgetService/DocumentService.tsx';
import { DOCUMENT_TYPE } from 'models/document';

const schema = yup
    .object({
        name: yup.string().required(),
        link: yup.string().required(),
        folderId: yup.number(),
    })
    .required();

type FileForm = yup.TypeOf<typeof schema>;

const FileDrawer = () => {
    const dispatch = useAppDispatch();
    const { documents, handleFileDrawerOpen, fileDrawerOpen, widget, loadDocuments } = useContext(DocumentsContext);

    const [isCreatingFile, setIsCreatingDocument] = useState(false);

    const methods = useForm<FileForm>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            link: '',
            folderId: 0,
        },
    });

    const { handleSubmit } = methods;

    const onSubmit: SubmitHandler<FileForm> = async (data: FileForm) => {
        if (!widget) {
            return;
        }

        try {
            setIsCreatingDocument(true);
            await postDocument(widget.id, {
                title: data.name,
                parent_document_id: data.folderId === 0 ? null : data.folderId,
                url: data.link,
                widget_id: widget.id,
                type: 'file',
            });
            await loadDocuments();
            setIsCreatingDocument(false);
            handleFileDrawerOpen(false);
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
                            <MetHeader3 bold>Add File</MetHeader3>
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
                                    name="folderId"
                                    id="document-folder"
                                    data-testid="document-form/folderId"
                                    variant="outlined"
                                    label=" "
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    fullWidth
                                    size="small"
                                >
                                    <MenuItem value={0} sx={{ height: '2em' }}></MenuItem>
                                    {documents
                                        .filter((document) => document.type === DOCUMENT_TYPE.FOLDER)
                                        .map((document) => {
                                            return <MenuItem value={document.id}>{document.title}</MenuItem>;
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
                                <SecondaryButton
                                    onClick={() => handleFileDrawerOpen(false)}
                                >{`Cancel`}</SecondaryButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </FormProvider>
            </Box>
        </Drawer>
    );
};

export default FileDrawer;
