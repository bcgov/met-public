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
                        {document.folder ? (
                            <>
                                <Grid item justifyContent="flex-start" display="flex" xs={12}>
                                    <Icon>
                                        <FolderIcon />
                                    </Icon>
                                    <MetLabel>{document.name}</MetLabel>
                                </Grid>
                                {document.items ? (
                                    document.items.map((folderItem) => {
                                        <Grid item justifyContent="center" display="flex" xs={12}>
                                            <MetLabel>
                                                <Link href={folderItem.document_url}>
                                                    <OpenInNewIcon />
                                                    {folderItem.name}
                                                </Link>
                                            </MetLabel>
                                        </Grid>
                                    })
                                ) : (
                                    <></>
                                )}
                            </>
                        ) : (
                            <MetLabel>
                                <Link href={document.document_url}>{document.name}</Link>
                            </MetLabel>
                        )}
                    </Grid>
                );
            })}
        </MetPaper>
    );
};

export default DocumentWidget;
