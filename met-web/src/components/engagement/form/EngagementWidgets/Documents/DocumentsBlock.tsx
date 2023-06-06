import React, { useContext } from 'react';
import { Box, Grid, Stack } from '@mui/material';
import DocumentSwitch from './DocumentSwitch';
import { DocumentsContext } from './DocumentsContext';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { MetDroppable } from 'components/common/Dragdrop';

const DocumentsBlock = () => {
    const { documents } = useContext(DocumentsContext);

    const handleDragEnd = (result: any) => {
        // dropped outside the list
        console.log('dropped');
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Grid item xs={12} container alignItems="flex-start" justifyContent={'flex-start'} spacing={2}>
                <MetDroppable droppableId="folders">
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
