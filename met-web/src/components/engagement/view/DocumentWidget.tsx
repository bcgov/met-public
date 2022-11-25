import React, { useEffect, useState } from 'react';
import { MetPaper, MetHeader2, MetHeader4 } from 'components/common';
import { Grid, Skeleton, Icon, Link } from '@mui/material';
import { Widget } from 'models/widget';
import { DocumentItem, DOCUMENT_TYPE } from 'models/document';
import { useAppDispatch } from 'hooks';
import { fetchDocuments } from 'services/widgetService/DocumentService.tsx';
import { openNotification } from 'services/notificationService/notificationSlice';
import FolderIcon from '@mui/icons-material/Folder';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { If, Else, Then } from 'react-if';

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
                        <If condition={document.type === DOCUMENT_TYPE.FOLDER}>
                            <Then>
                                <Grid item container justifyContent="flex-start" alignItems="center" xs={12}>
                                    <Grid item xs={1}>
                                        <Icon sx={{ p: 0, m: 0 }}>
                                            <FolderIcon />
                                        </Icon>
                                    </Grid>
                                    <Grid item xs={11}>
                                        <MetHeader4 bold={true} sx={{ p: 0, m: 0 }}>
                                            {document.title}
                                        </MetHeader4>
                                    </Grid>
                                </Grid>

                                {document.children ? (
                                    document.children.map((folderItem: DocumentItem) => {
                                        return (
                                            <Grid item justifyContent="flex-start" container xs={12}>
                                                <Grid item xs={1}></Grid>
                                                <Grid display="flex" item xs={11}>
                                                    <Icon sx={{ mr: 1 }}>
                                                        <InsertDriveFileIcon />
                                                    </Icon>

                                                    <Link target="_blank" href={`${folderItem.url}`}>
                                                        {folderItem.title}
                                                        <Icon sx={{ ml: 0.5 }}>
                                                            <OpenInNewIcon />
                                                        </Icon>
                                                    </Link>
                                                </Grid>
                                            </Grid>
                                        );
                                    })
                                ) : (
                                    <></>
                                )}
                            </Then>
                            <Else>
                                <Grid item justifyContent="flex-start" container xs={12}>
                                    <InsertDriveFileIcon sx={{ mr: 1 }} />
                                    <Link target="_blank" href={`${document.url}`}>
                                        {document.title}
                                        <Icon sx={{ ml: 0.5 }}>
                                            <OpenInNewIcon />
                                        </Icon>
                                    </Link>
                                </Grid>
                            </Else>
                        </If>
                    </Grid>
                );
            })}
        </MetPaper>
    );
};

export default DocumentWidget;
