import React, { useContext } from 'react';
import { Grid, IconButton, Stack, Typography } from '@mui/material';
import { MetWidgetPaper } from 'components/common';
import { DocumentItem } from 'models/document';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/pro-regular-svg-icons/faPen';
import { faGripDotsVertical } from '@fortawesome/pro-solid-svg-icons/faGripDotsVertical';
import { faCircleXmark } from '@fortawesome/pro-regular-svg-icons/faCircleXmark';
import { faLinkSimple } from '@fortawesome/pro-regular-svg-icons/faLinkSimple';
import { faFileLines } from '@fortawesome/pro-regular-svg-icons/faFileLines';
import { useAppDispatch } from 'hooks';
import { openNotificationModal } from 'services/notificationModalService/notificationModalSlice';
import { deleteDocument } from 'services/widgetService/DocumentService';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { WidgetType, Widget } from 'models/widget';
import { DocumentsContext } from './DocumentsContext';
import { DraggableProvided } from '@hello-pangea/dnd';

const DocumentFile = ({
    documentItem,
    draggableProvided,
}: {
    documentItem: DocumentItem;
    draggableProvided: DraggableProvided;
}) => {
    const dispatch = useAppDispatch();
    const { handleAddFileDrawerOpen, handleChangeDocumentToEdit, loadDocuments } = useContext(DocumentsContext);
    const { widgets } = useContext(WidgetDrawerContext);
    const documentWidget = widgets.find((widget: Widget) => widget.widget_type_id === WidgetType.Document);

    const handleEditDocument = () => {
        handleChangeDocumentToEdit(documentItem);
        handleAddFileDrawerOpen(true);
    };

    const handleDeleteDocument = async () => {
        if (!documentWidget) {
            return;
        }
        await deleteDocument(documentWidget.id, documentItem.id);
        await loadDocuments();
    };

    return (
        <Grid item xs={12} container alignItems="flex-start" justifyContent={'flex-start'} spacing={2} mb={2}>
            <MetWidgetPaper elevation={1} sx={{ width: '100%' }}>
                <Grid container direction="row" alignItems={'center'} justifyContent="flex-start">
                    <Grid item sx={{ alignItems: 'center', justifyContent: 'center' }}>
                        <IconButton
                            sx={{ margin: '0 0.5em 0 0', padding: 0 }}
                            color="inherit"
                            aria-label="drag-indicator"
                            {...draggableProvided.dragHandleProps}
                        >
                            <FontAwesomeIcon
                                icon={faGripDotsVertical}
                                style={{ fontSize: '24px', margin: '0px 4px' }}
                            />
                        </IconButton>
                    </Grid>
                    <Grid item xs>
                        <Stack spacing={2} direction="row" alignItems="center">
                            {documentItem.is_uploaded ? (
                                <FontAwesomeIcon icon={faFileLines} style={{ fontSize: '22px' }} />
                            ) : (
                                <FontAwesomeIcon icon={faLinkSimple} style={{ fontSize: '22px' }} />
                            )}
                            <Typography>{documentItem.title}</Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs container justifyContent={'flex-end'}>
                        <IconButton
                            onClick={() => handleEditDocument()}
                            sx={{ padding: 0, mr: 1 }}
                            color="inherit"
                            aria-label="Edit Folder"
                        >
                            <FontAwesomeIcon icon={faPen} style={{ fontSize: '22px' }} />
                        </IconButton>
                        <IconButton
                            onClick={() =>
                                dispatch(
                                    openNotificationModal({
                                        open: true,
                                        data: {
                                            header: 'Remove File',
                                            subText: [
                                                {
                                                    text: 'You will be removing this file from the engagement.',
                                                },
                                                { text: 'Do you want to remove this file?' },
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
                            aria-label="Remove File"
                        >
                            <FontAwesomeIcon icon={faCircleXmark} style={{ fontSize: '22px' }} />
                        </IconButton>
                    </Grid>
                </Grid>
            </MetWidgetPaper>
        </Grid>
    );
};

export default DocumentFile;
