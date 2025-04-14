import React, { Suspense, useMemo } from 'react';
import { Grid, Skeleton, Paper, ThemeProvider } from '@mui/material';
import { Widget } from 'models/widget';
import { DocumentItem, DOCUMENT_TYPE } from 'models/document';
import { useLazyGetDocumentsQuery } from 'apiManager/apiSlices/documents';
import { BodyText, Header3 } from 'components/common/Typography';
import { BaseTheme } from 'styles/Theme';
import { Await } from 'react-router-dom';
import TreeView from '@mui/lab/TreeView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TreeItem from '@mui/lab/TreeItem';
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
    faChevronDown,
    faChevronRight,
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

const treeItemStyles = {
    color: 'text.primary',
    '& div.MuiTreeItem-label': {
        padding: '0.5em 0.5em 0.5em 1em',
    },
    '& div.MuiTreeItem-content': {
        borderRadius: '8px',
    },
    userSelect: 'none',
};

const RecursiveDocumentTree = ({ documentItem }: DocumentTreeProps) => {
    const renderEmptyFolder = () => (
        <TreeItem
            sx={{ '& div.MuiTreeItem-content.Mui-disabled': { cursor: 'not-allowed' } }}
            disabled
            nodeId={`${documentItem.id}-empty`}
            label={
                <BodyText color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    [Empty Folder]
                </BodyText>
            }
        />
    );

    return (
        <TreeItem
            sx={treeItemStyles}
            nodeId={documentItem.id.toString()}
            label={<DocumentLabel documentItem={documentItem} />}
            icon={
                documentItem.type === DOCUMENT_TYPE.FILE ? (
                    <FontAwesomeIcon
                        icon={getFileIcon(documentItem.url ?? '', documentItem.is_uploaded ?? false)}
                        style={{ fontSize: '18px' }}
                    />
                ) : undefined
            }
        >
            {documentItem.children?.map((document: DocumentItem) => (
                <RecursiveDocumentTree key={document.id} documentItem={document} />
            ))}
            {documentItem.type === DOCUMENT_TYPE.FOLDER && !documentItem.children?.length && renderEmptyFolder()}
        </TreeItem>
    );
};

const DocumentLabel = ({ documentItem }: DocumentTreeProps) =>
    documentItem.type === DOCUMENT_TYPE.FOLDER ? (
        <BodyText color="inherit" fontWeight="inherit">
            {documentItem.title}
        </BodyText>
    ) : (
        <Link to={documentItem.url ?? ''} underline="hover" color="#292929">
            <BodyText>{documentItem.title}</BodyText>
        </Link>
    );

// Skeleton component for the DocumentWidget
const DocumentWidgetSkeleton = () => (
    <Grid container spacing={0.5}>
        {[...Array(3)].map((_, index) => (
            // Simulate a folder with a title and two subitems
            <Grid item xs={12} key={`skeleton-folder-${index}`} sx={{ mb: 1 }}>
                <Skeleton variant="text" width="60%" height={20} />
                <Grid container spacing={0.5} sx={{ pl: 3, mt: 0.5 }}>
                    {[...Array(2)].map((_, subIndex) => (
                        <Grid item xs={12} key={`skeleton-subitem-${index}-${subIndex}`}>
                            <Skeleton variant="text" width="40%" height={15} />
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        ))}
    </Grid>
);

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
                xs={12}
                component={Paper}
                sx={{
                    mt: '1.5rem',
                    bgcolor: 'white',
                    padding: '2em',
                    borderRadius: '16px',
                    border: '1px solid',
                    borderColor: 'blue.90',
                    // Ensure the white box tries to fill the available space defined
                    // by its sibling content to avoid unnecessary animation of its height
                    // when expanding/collapsing items.
                    height: 'calc(100% - 9em)',
                    display: 'flex', // Use flexbox to align content
                    flexDirection: 'column',
                }}
            >
                <section aria-label="Document Tree Widget" style={{ flexGrow: 1 }}>
                    <ThemeProvider theme={BaseTheme}>
                        <Suspense fallback={<DocumentWidgetSkeleton />}>
                            <Grid container item spacing={1} rowSpacing={1} xs={12} paddingTop={2} flexGrow={1}>
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
                                        <>
                                            <FontAwesomeIcon
                                                icon={faChevronDown}
                                                style={{
                                                    fontSize: '12px',
                                                    color: BaseTheme.palette.primary.main,
                                                    marginRight: '0.5em',
                                                    marginLeft: '1em',
                                                    marginTop: '0.2em',
                                                }}
                                            />
                                            <FontAwesomeIcon
                                                icon={faFolderOpen}
                                                style={{
                                                    color: BaseTheme.palette.primary.main,
                                                }}
                                            />
                                        </>
                                    }
                                    defaultExpandIcon={
                                        <>
                                            <FontAwesomeIcon
                                                icon={faChevronRight}
                                                style={{
                                                    fontSize: '12px',
                                                    marginRight: '0.5em',
                                                    marginLeft: '1em',
                                                    marginTop: '0.2em',
                                                }}
                                            />
                                            <FontAwesomeIcon
                                                icon={faFolder}
                                                style={{
                                                    fontSize: '18px',
                                                }}
                                            />
                                        </>
                                    }
                                >
                                    <Await resolve={documents}>
                                        {(documents: DocumentItem[]) => {
                                            return documents.map((document: DocumentItem) => {
                                                return (
                                                    <RecursiveDocumentTree documentItem={document} key={document.id} />
                                                );
                                            });
                                        }}
                                    </Await>
                                </TreeView>
                            </Grid>
                        </Suspense>
                    </ThemeProvider>
                </section>
            </Grid>
        </Grid>
    );
};

export default DocumentWidget;
