import React, { useEffect, useState } from 'react';
import { MetPaper, MetHeader2, MetLabel } from 'components/common';
import { Grid, Skeleton, Icon, Link } from '@mui/material';
import { Widget } from 'models/widget';
import { DocumentItem } from 'models/document';
import { useAppDispatch } from 'hooks';
import { fetchDocuments } from 'services/widgetService/DocumentService.tsx';
import { openNotification } from 'services/notificationService/notificationSlice';
import FolderIcon from '@mui/icons-material/Folder';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { DOCUMENT_TYPE } from 'models/document';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

interface DocumentWidgetProps {
    widget: Widget;
}
const DocumentWidget = ({ widget }: DocumentWidgetProps) => {
    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState(true);
    const [documents, setDocuments] = useState<DocumentItem[]>([]);

    const getDocuments = async () => {
        try {
            const fetchedDocuments = await fetchDocuments(widget.id);
            console.log(fetchedDocuments);
            setDocuments(fetchedDocuments);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while fetching Documents widget information',
                }),
            );
        }
    };

    useEffect(() => {
        getDocuments();
    }, [widget]);

    if (isLoading) {
        return <Skeleton height="5em" width="100%" />;
    }

    if (documents.length === 0) {
        return null;
    }

    return (
        <MetPaper elevation={1} sx={{ padding: '1em', minHeight: '12em' }}>
            <Grid item justifyContent="flex-start" alignItems="center" xs={12}>
                <MetHeader2 bold={true}>Documents</MetHeader2>
            </Grid>
            {documents.map((document) => {
                return (
                    <Grid key={document.id} container item spacing={1} rowSpacing={1} xs={12} paddingTop={2}>
                        {document.type === DOCUMENT_TYPE.FOLDER ? (
                            <>
                                <Grid
                                    sx={{ border: '2px solid red' }}
                                    item
                                    container
                                    justifyContent="flex-start"
                                    alignItems="center"
                                    xs={12}
                                >
                                    <Grid item xs={1}>
                                        <Icon sx={{ pb: 0, m: 0 }}>
                                            <FolderIcon />
                                        </Icon>
                                    </Grid>
                                    <Grid item xs={11}>
                                        <MetLabel sx={{ p: 0, m: 0 }}>{document.title}</MetLabel>
                                    </Grid>
                                </Grid>
                                {document.children ? (
                                    document.children.map((folderItem: DocumentItem) => {
                                        return (
                                            <Grid item justifyContent="flex-start" container xs={12}>
                                                <Grid item xs={11}>
                                                    <Icon>
                                                        <InsertDriveFileIcon />
                                                    </Icon>
                                                    <MetLabel sx={{ ml: 2 }}>
                                                        <Link href={folderItem.document_url}>
                                                            {folderItem.title}
                                                            <Icon>
                                                                <OpenInNewIcon />
                                                            </Icon>
                                                        </Link>
                                                    </MetLabel>
                                                </Grid>
                                            </Grid>
                                        );
                                    })
                                ) : (
                                    <></>
                                )}
                            </>
                        ) : (
                            <MetLabel>
                                <Link href={document.document_url}>
                                    {document.title}
                                    <Icon>
                                        <OpenInNewIcon />
                                    </Icon>
                                </Link>
                            </MetLabel>
                        )}
                    </Grid>
                );
            })}
        </MetPaper>
    );
};

export default DocumentWidget;
