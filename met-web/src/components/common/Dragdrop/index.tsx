import { Draggable, Droppable, DraggableProvided, DroppableProvided } from '@hello-pangea/dnd';
import { Box } from '@mui/material';
import React from 'react';

interface MetDroppableProps {
    children: React.ReactNode;
    droppableId: string;
    type?: string;
    [prop: string]: unknown;
}
export const MetDroppable = ({ droppableId, type, children, ...rest }: MetDroppableProps) => {
    return (
        <Droppable droppableId={droppableId} type={type}>
            {(provided: DroppableProvided) => (
                <Box {...provided.droppableProps} ref={provided.innerRef} {...rest}>
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
export const MetDraggable = ({ children, draggableId, index, marginBottom }: MetDraggableProps) => {
    return (
        <Draggable key={draggableId} draggableId={draggableId} index={index}>
            {(provided: DraggableProvided) => (
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
