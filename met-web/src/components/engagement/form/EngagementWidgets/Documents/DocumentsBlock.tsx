import React, { useContext } from 'react';
import { Box, Grid, Stack } from '@mui/material';
import DocumentSwitch from './DocumentSwitch';
import { DocumentsContext } from './DocumentsContext';
import { DragDropContext, Draggable, DropResult } from '@hello-pangea/dnd';
import { MetDroppable } from 'components/common/Dragdrop';
import { sortDocuments } from 'services/widgetService/DocumentService';

const DocumentsBlock = () => {
    const { documents, widget, setDocuments } = useContext(DocumentsContext);

    const handleDragEnd = (dropResult: DropResult) => {
        const { source, destination, type } = dropResult;

        // Check if the item was dropped outside a droppable area or into a different droppable area
        if (!destination || source.droppableId !== destination.droppableId || !widget) {
            return;
        }

        // Check if the item was dropped back into its original position
        if (source.index === destination.index) {
            return;
        }

        const updatedDocuments = Array.from(documents);

        if (type === 'FOLDER') {
            // Reorder documents at the same level
            const draggedDocument = updatedDocuments.splice(source.index, 1)[0];
            updatedDocuments.splice(destination.index, 0, draggedDocument);

            sortDocuments(widget.id, {
                documents: updatedDocuments,
            });
        } else if (type === 'FILE') {
            // Reorder files within a folder
            const folderId = source.droppableId;
            const folderIndex = updatedDocuments.findIndex((doc) => String(doc.id) === folderId);
            const folder = updatedDocuments[folderIndex];

            if (!folder || !folder.children) {
                throw new Error(`Folder with id ${folderId} not found`);
            }

            const draggedFile = folder.children.splice(source.index, 1)[0];
            folder.children.splice(destination.index, 0, draggedFile);

            sortDocuments(widget.id, {
                documents: folder.children,
            });

            // Replace folder in the updatedDocuments array
            updatedDocuments[folderIndex] = folder;
        } else {
            throw new Error('Unknown document type');
        }

        setDocuments(updatedDocuments);
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Grid item xs={12} container alignItems="flex-start" justifyContent={'flex-start'} spacing={2}>
                <MetDroppable droppableId="folders" type="FOLDER">
                    {documents.map((document, index) => {
                        return (
                            <Draggable key={document.id} draggableId={String(document.id)} index={index}>
                                {(provided) => (
                                    <Box
                                        sx={{
                                            margin: '1em 0',
                                        }}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                    >
                                        <Stack direction="row" spacing={1} alignItems="flex-start">
                                            <DocumentSwitch
                                                key={`document-${document.id}`}
                                                documentItem={document}
                                                draggableProvided={provided}
                                            />
                                        </Stack>
                                    </Box>
                                )}
                            </Draggable>
                        );
                    })}
                </MetDroppable>
            </Grid>
        </DragDropContext>
    );
};

export default DocumentsBlock;
