import React, { useContext } from 'react';
import { Grid, IconButton, Stack, Typography } from '@mui/material';
import { MetWidgetPaper } from 'components/common';
import { DocumentItem } from 'models/document';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import LinkIcon from '@mui/icons-material/Link';
import { useAppDispatch } from 'hooks';
import { openNotificationModal } from 'services/notificationModalService/notificationModalSlice';
import { deleteDocument } from 'services/widgetService/DocumentService';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { WidgetType, Widget } from 'models/widget';
import Edit from '@mui/icons-material/Edit';
import { DocumentsContext } from './DocumentsContext';

const DocumentFile = ({ documentItem }: { documentItem: DocumentItem }) => {
    const dispatch = useAppDispatch();
    const { handleFileDrawerOpen, handleChangeDocumentToEdit, loadDocuments } = useContext(DocumentsContext);
    const { widgets } = useContext(WidgetDrawerContext);
    const documentWidget = widgets.find((widget: Widget) => widget.widget_type_id === WidgetType.Document);

    const handleEditDocument = () => {
        handleChangeDocumentToEdit(documentItem);
        handleFileDrawerOpen(true);
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
                    <Grid item xs>
                        <Stack spacing={2} direction="row" alignItems="center">
                            <LinkIcon color="info" />
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
                            <Edit />
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
                            <HighlightOffIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </MetWidgetPaper>
        </Grid>
    );
};

export default DocumentFile;
