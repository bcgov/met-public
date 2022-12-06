import React, { useEffect, useState } from 'react';
import { MetPaper, MetHeader2 } from 'components/common';
import { Grid, Skeleton, Link, Stack, Box } from '@mui/material';
import { Widget } from 'models/widget';
import { DocumentItem, DOCUMENT_TYPE } from 'models/document';
import { useAppDispatch } from 'hooks';
import { fetchDocuments } from 'services/widgetService/DocumentService.tsx';
import { openNotification } from 'services/notificationService/notificationSlice';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import DocumentTree from 'components/engagement/form/EngagementWidgets/Documents/TreeView';
import { If, Then, Else } from 'react-if';

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
        <>
            <MetPaper elevation={1} sx={{ padding: '1em', minHeight: '12em' }}>
                <Grid item justifyContent="flex-start" alignItems="center" xs={12}>
                    <MetHeader2 bold={true}>Documents</MetHeader2>
                </Grid>
                {documents.map((document: DocumentItem) => {
                    return (
                        <Grid key={document.id} container item spacing={1} rowSpacing={1} xs={12} paddingTop={2}>
<<<<<<< HEAD
                            <DocumentTree nodeId={`${document.id}`} documentItem={document} />
=======
                            <If condition={document.type === DOCUMENT_TYPE.FOLDER}>
                                <Then>
                                    <DocumentTree nodeId={`${document.id}`} documentItem={document} />
                                </Then>
                                <Else>
                                    <Grid item justifyContent="flex-start" container xs={12}>
                                        <Stack
                                            direction="row"
                                            sx={{
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Box
                                                component={DescriptionOutlinedIcon}
                                                color="inherit"
                                                sx={{ p: 0.3, mr: 1 }}
                                            />
                                            <Link
                                                sx={{
                                                    alignItems: 'center',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                }}
                                                target="_blank"
                                                href={`${document.url}`}
                                            >
                                                {document.title}
                                            </Link>
                                            <Link
                                                sx={{
                                                    alignItems: 'center',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    p: 0,
                                                    m: 0,
                                                }}
                                                target="_blank"
                                                href={`${document.url}`}
                                            >
                                                <Box sx={{ p: 0.5, m: 0 }} component={OpenInNewIcon} color="inherit" />
                                            </Link>
                                        </Stack>
                                    </Grid>
                                </Else>
                            </If>
>>>>>>> main
                        </Grid>
                    );
                })}
            </MetPaper>
        </>
    );
};

export default DocumentWidget;
