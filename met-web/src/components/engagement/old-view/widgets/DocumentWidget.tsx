import React, { Suspense, useMemo } from 'react';
import { Grid, Skeleton, Paper, ThemeProvider } from '@mui/material';
import { Widget } from 'models/widget';
import { DocumentItem, DOCUMENT_TYPE } from 'models/document';
import DocumentTree from 'components/engagement/form/EngagementWidgets/Documents/TreeView';
import { useLazyGetDocumentsQuery } from 'apiManager/apiSlices/documents';
import { BodyText, Header3 } from 'components/common/Typography';
import { BaseTheme } from 'styles/Theme';
import { Await, useNavigate } from 'react-router-dom';
import TreeView from '@mui/lab/TreeView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TreeItem, { TreeItemProps } from '@mui/lab/TreeItem';
import {
    faFolder,
    faFileAudio,
    faFilePdf,
    faFolderOpen,
    faFileVideo,
    faFileMusic,
    faFileZip,
    faFile,
    faFileDoc,
    faFileSpreadsheet,
    faFilePowerpoint,
    faFileImage,
    faLink,
    faChainBroken,
} from '@fortawesome/pro-regular-svg-icons';
import { Link } from 'components/common/Navigation';

interface DocumentTreeProps {
    documentItem: DocumentItem;
}

const getFileIcon = (url: string, isFile: boolean) => {
    if (!isFile) {
        return url ? faLink : faChainBroken;
    }
    // If there is no extension, it is a link rather than a file
    if (url.indexOf('.') === -1) {
        return faLink;
    }
    switch (url.split('.').pop()) {
        case 'pdf':
            return faFilePdf;
        case 'zip':
            return faFileZip;
        case 'mid':
        case 'midi':
            return faFileMusic;
        case 'doc':
        case 'docx':
            return faFileDoc;
        case 'xls':
        case 'xlsx':
            return faFileSpreadsheet;
        case 'ppt':
        case 'pptx':
            return faFilePowerpoint;
        case 'mp3':
        case 'wav':
        case 'flac':
        case 'ogg':
        case 'm4a':
        case 'wma':
            return faFileAudio;
        case 'mp4':
        case 'avi':
        case 'mov':
        case 'wmv':
        case 'flv':
        case 'mkv':
            return faFileVideo;
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'gif':
        case 'bmp':
        case 'tiff':
        case 'webp':
            return faFileImage;
        default:
            return faFile;
    }
};

const RecursiveDocumentTree = ({ documentItem }: DocumentTreeProps) => {
    return (
        <TreeItem
            sx={{
                color: 'text.primary',
                '& div.MuiTreeItem-label': {
                    padding: '0.5em',
                },
            }}
            nodeId={documentItem.id.toString()}
            label={<DocumentLabel documentItem={documentItem} />}
            icon={
                documentItem.type === DOCUMENT_TYPE.FILE ? (
                    <FontAwesomeIcon
                        icon={getFileIcon(documentItem.url || '', documentItem.is_uploaded ?? false)}
                        style={{ fontSize: '18px' }}
                    />
                ) : undefined
            }
        >
            {documentItem.children?.map((document: DocumentItem) => {
                return <RecursiveDocumentTree documentItem={document} />;
            })}
            {documentItem.type === DOCUMENT_TYPE.FOLDER && !documentItem.children?.length && (
                <TreeItem
                    disabled
                    nodeId={`${documentItem.id}-empty`}
                    label={
                        <BodyText color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            [Empty Folder]
                        </BodyText>
                    }
                />
            )}
        </TreeItem>
    );
};

const DocumentLabel = ({ documentItem }: DocumentTreeProps) => {
    if (documentItem.type === DOCUMENT_TYPE.FOLDER) {
        return (
            <BodyText color="inherit" fontWeight="inherit">
                {documentItem.title}
            </BodyText>
        );
    }
    return (
        <Link to={documentItem.url || ''} underline="hover" color="#292929">
            <BodyText>{documentItem.title}</BodyText>
        </Link>
    );
};

interface DocumentWidgetProps {
    widget: Widget;
}
const DocumentWidget = ({ widget }: DocumentWidgetProps) => {
    const [getDocuments] = useLazyGetDocumentsQuery();
    const documents = useMemo(() => getDocuments(widget.id, false).unwrap(), [widget.id]);

    return (
        <Grid container gap="1rem">
            <Grid item xs={12} mt="4rem">
                <Header3 sx={{ fontSize: '1.375rem' }} weight="thin">
                    {widget.title}
                </Header3>
            </Grid>
            <Grid
                item
                container
                xs={12}
                component={Paper}
                sx={{
                    mt: '1.5rem',
                    bgcolor: 'white',
                    padding: '2em',
                    borderRadius: '16px',
                    border: '1px solid',
                    borderColor: 'blue.90',
                    height: 'fit-content',
                }}
            >
                <ThemeProvider theme={BaseTheme}>
                    <Suspense fallback={<Skeleton variant="rectangular" height={150} />}>
                        <Grid container item spacing={1} rowSpacing={1} xs={12} paddingTop={2}>
                            <TreeView
                                sx={{
                                    width: '100%',
                                    '& .Mui-expanded .MuiTreeItem-label': {
                                        color: BaseTheme.palette.primary.main,
                                        fontWeight: 700,
                                    },
                                }}
                                defaultParentIcon
                                defaultCollapseIcon={
                                    <FontAwesomeIcon
                                        icon={faFolderOpen}
                                        style={{ fontSize: '18px', color: BaseTheme.palette.primary.main }}
                                    />
                                }
                                defaultExpandIcon={<FontAwesomeIcon icon={faFolder} style={{ fontSize: '18px' }} />}
                            >
                                <Await resolve={documents}>
                                    {(documents: DocumentItem[]) => {
                                        return documents.map((document: DocumentItem) => {
                                            return <RecursiveDocumentTree documentItem={document} />;
                                        });
                                    }}
                                </Await>
                            </TreeView>
                        </Grid>
                    </Suspense>
                </ThemeProvider>
            </Grid>
        </Grid>
    );
};

export default DocumentWidget;
