import React from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { Box } from '@mui/material';

interface MetDroppableProps {
    children: React.ReactNode;
    droppableId: string;
}
const MetDroppable = ({ droppableId, children }: MetDroppableProps) => {
    return (
        <Droppable droppableId={droppableId}>
            {(provided: any) => (
                <Box {...provided.droppableProps} ref={provided.innerRef}>
                    {children}
                    {provided.placeholder}
                </Box>
            )}
        </Droppable>
    );
};

interface MetDraggableProps {
    index: number;
    children: React.ReactNode;
    draggableId: string;
    marginBottom?: string | number;
}
const MetDraggable = ({ children, draggableId, index, marginBottom }: MetDraggableProps) => {
    return (
        <Draggable key={draggableId} draggableId={draggableId} index={index}>
            {(provided: any) => (
                <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    sx={{
                        ...provided.draggableProps.style,
                        marginBottom: marginBottom || '1em',
                    }}
                >
                    {children}
                </Box>
            )}
        </Draggable>
    );
};

export { MetDraggable, MetDroppable };
