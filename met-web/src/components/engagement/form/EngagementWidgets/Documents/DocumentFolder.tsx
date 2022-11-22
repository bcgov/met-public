import React from 'react';
import { Grid, IconButton, Stack, Typography } from '@mui/material';
import { MetWidgetPaper } from 'components/common';
import { DocumentItem } from 'models/document';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import { When } from 'react-if';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import DocumentSwitch from './DocumentSwitch';

const DocumentFolder = ({ documentItem }: { documentItem: DocumentItem }) => {
    return (
        <Grid item xs={12} container justifyContent={'flex-start'} spacing={2}>
            <MetWidgetPaper elevation={2} sx={{ width: '100%' }}>
                <Grid container direction="row" alignItems={'center'} justifyContent="flex-start">
                    <Grid item xs>
                        <Stack spacing={2} direction="row" alignItems="center">
                            <IconButton sx={{ padding: 0, margin: 0 }} color="info" aria-label="drag-indicator">
                                <DragIndicatorIcon />
                            </IconButton>
                            <IconButton sx={{ padding: 0, margin: 0 }} color="info" aria-label="drag-indicator">
                                <FolderIcon />
                            </IconButton>
                            <Typography>{documentItem.name}</Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs container justifyContent={'flex-end'}>
                        <IconButton sx={{ padding: 0, margin: 0 }} color="info" aria-label="drag-indicator">
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </MetWidgetPaper>
            <When condition={documentItem.items && documentItem.items.length > 0}>
                <Grid item xs={12} container justifyContent={'flex-end'} spacing={2}>
                    {documentItem.items?.map((item) => {
                        return (
                            <>
                                <Grid item xs={12}>
                                    <Stack direction="row" spacing={1} alignItems="flex-start">
                                        <IconButton
                                            sx={{ padding: 0, margin: 0, height: '2em' }}
                                            style={{ color: 'inherit' }}
                                            color="info"
                                            aria-label="drag-indicator"
                                            disabled={true}
                                        >
                                            <SubdirectoryArrowRightIcon />
                                        </IconButton>
                                        <DocumentSwitch documentItem={item} />
                                    </Stack>
                                </Grid>
                            </>
                        );
                    })}
                </Grid>
            </When>
        </Grid>
    );
};

export default DocumentFolder;
