import React, { useState, useEffect, useContext } from 'react';
import { Grid, IconButton, Stack, TextField, Typography } from '@mui/material';
import { MetWidgetPaper } from 'components/common';
import { DocumentItem } from 'models/document';
import FolderIcon from '@mui/icons-material/Folder';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { If, Then, Else, When } from 'react-if';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import DocumentSwitch from './DocumentSwitch';
import { useAppDispatch } from 'hooks';
import { openNotificationModal } from 'services/notificationModalService/notificationModalSlice';
import { deleteDocument, patchDocument, PatchDocumentRequest } from 'services/widgetService/DocumentService';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { WidgetType, Widget } from 'models/widget';
import Edit from '@mui/icons-material/Edit';
import { DocumentsContext } from './DocumentsContext';
import { updatedDiff } from 'deep-object-diff';
import { openNotification } from 'services/notificationService/notificationSlice';

const DocumentFolder = ({ documentItem }: { documentItem: DocumentItem }) => {
    const dispatch = useAppDispatch();
    const { documents, loadDocuments } = useContext(DocumentsContext);
    const { widgets } = useContext(WidgetDrawerContext);
    const documentWidget = widgets.find((widget: Widget) => widget.widget_type_id === WidgetType.Document);
    const [edit, setEdit] = useState<boolean>(false);
    const [document, setDocument] = useState<DocumentItem | undefined>(documentItem);

    useEffect(() => {
        const updatedDocument = documents.find((document: DocumentItem) => document.id === documentItem.id);
        setDocument(updatedDocument);
    }, [documents]);

    const updateDocument = async () => {
        setEdit(false);
        if (!documentWidget || !document) {
            return;
        }
        const documentUpdatesToPatch = updatedDiff(documentItem, {
            ...document,
        }) as PatchDocumentRequest;

        if (Object.values(documentUpdatesToPatch).length > 0)
            await patchDocument(documentWidget.id, document.id, {
                ...documentUpdatesToPatch,
            });
        await loadDocuments();
        dispatch(openNotification({ severity: 'success', text: 'Document was successfully updated' }));
    };

    const handleDeleteDocument = async () => {
        if (!documentWidget) {
            return;
        }
        deleteDocument(documentWidget.id, documentItem.id);
        await loadDocuments();
    };

    return (
        <Grid item xs={12} container justifyContent={'flex-start'} spacing={2} mb={2}>
            <MetWidgetPaper elevation={2} sx={{ width: '100%' }}>
                <Grid container direction="row" alignItems={'center'} justifyContent="flex-start">
                    <Grid item xs>
                        <Stack spacing={2} direction="row" alignItems="center">
                            <FolderIcon color="info" />
                            <If condition={!edit}>
                                <Then>
                                    <Typography onClick={() => setEdit(true)}>
                                        {document ? document.title : ''}
                                    </Typography>
                                </Then>
                                <Else>
                                    <TextField
                                        size="small"
                                        autoFocus
                                        sx={{ p: 0, m: 0 }}
                                        value={document ? document.title : ''}
                                        onChange={(event) =>
                                            setDocument(
                                                document
                                                    ? { ...document, title: event.target.value }
                                                    : { ...documentItem, title: event.target.value },
                                            )
                                        }
                                        onBlur={updateDocument}
                                    />
                                </Else>
                            </If>
                        </Stack>
                    </Grid>
                    <Grid item xs container justifyContent={'flex-end'}>
                        <IconButton
                            onClick={() => setEdit(!edit)}
                            sx={{ padding: 0, mr: 1 }}
                            color="inherit"
                            aria-label="Edit Folder"
                        >
                            <Edit />
                        </IconButton>
                        <IconButton
                            onClick={() =>
                                dispatch(
                                    openNotificationModal({
                                        open: true,
                                        data: {
                                            header: 'Remove Folder',
                                            subText: [
                                                {
                                                    text: 'You will be removing this folder from the engagement.',
                                                },
                                                {
                                                    text: 'Do you want to remove this folder?',
                                                },
                                            ],
                                            handleConfirm: () => {
                                                handleDeleteDocument();
                                            },
                                        },
                                        type: 'confirm',
                                    }),
                                )
                            }
                            sx={{ padding: 0, margin: 0 }}
                            color="inherit"
                            aria-label="Remove Folder"
                        >
                            <HighlightOffIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </MetWidgetPaper>
            <When condition={documentItem.children && documentItem.children.length > 0}>
                <Grid item xs={12} container justifyContent={'flex-end'} spacing={2}>
                    {documentItem.children?.map((item) => {
                        return (
                            <Grid key={`child-document-${item.id}`} item xs={12}>
                                <Stack direction="row" spacing={1} alignItems="flex-start">
                                    <IconButton
                                        sx={{ padding: 0, margin: 0, height: '2em' }}
                                        style={{ color: 'inherit' }}
                                        color="inherit"
                                        aria-label="drag-indicator"
                                        disabled={true}
                                    >
                                        <SubdirectoryArrowRightIcon />
                                    </IconButton>
                                    <DocumentSwitch documentItem={item} />
                                </Stack>
                            </Grid>
                        );
                    })}
                </Grid>
            </When>
        </Grid>
    );
};

export default DocumentFolder;
