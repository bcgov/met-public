import React, { useEffect, useState } from 'react';
import { MetPaper, MetHeader2 } from 'components/common';
import { Grid, Skeleton } from '@mui/material';
import { Widget } from 'models/widget';
import { DocumentItem } from 'models/document';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import DocumentTree from 'components/engagement/form/EngagementWidgets/Documents/TreeView';
import { If, Then, Else } from 'react-if';
import { useLazyGetDocumentsQuery } from 'apiManager/apiSlices/documents';

interface DocumentWidgetProps {
    widget: Widget;
}
const DocumentWidget = ({ widget }: DocumentWidgetProps) => {
    const dispatch = useAppDispatch();
    const [getDocumentsTrigger] = useLazyGetDocumentsQuery();

    const [isLoading, setIsLoading] = useState(true);
    const [documents, setDocuments] = useState<DocumentItem[]>([]);

    const getDocuments = async () => {
        try {
            const fetchedDocuments = await getDocumentsTrigger(widget.id, true).unwrap();
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
                            <DocumentTree nodeId={`${document.id}`} documentItem={document} />
                        </Grid>
                    );
                })}
            </MetPaper>
        </>
    );
};

export default DocumentWidget;
