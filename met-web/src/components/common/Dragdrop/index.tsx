import { Draggable, Droppable, DraggableProvided, DroppableProvided } from '@hello-pangea/dnd';
import { Box } from '@mui/material';
import React from 'react';

interface MetDroppableProps {
    children: React.ReactNode;
    droppableId: string;
    type?: string;
    [prop: string]: unknown;
}
/**
 * A wrapper around the Droppable component from @hello-pangea/dnd.
 * It provides a consistent interface for creating droppable areas in drag-and-drop interfaces.
 * @param {MetDroppableProps} props - The properties for the droppable area.
 * @param {string} props.droppableId - The unique identifier for the droppable area.
 * @param {string} [props.type] - The type of the droppable area, used for grouping draggable items.
 * @param {React.ReactNode} props.children - The content to be rendered inside the droppable area.
 * @param {object} [props.rest] - Additional properties to be passed to the Box component.
 * @returns {JSX.Element} A Box component that serves as a droppable area.
 * @example
 * <MetDroppable droppableId="droppable-1" type="TYPE_1">
 *     <MetDraggable draggableId="draggable-1" index={0}>
 *         <div>Draggable Item 1</div>
 *     </MetDraggable>
 *     <MetDraggable draggableId="draggable-2" index={1}>
 *         <div>Draggable Item 2</div>
 *     </MetDraggable>
 * </MetDroppable>
 */
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
    sx?: object;
}
/**
 * A wrapper around the Draggable component from @hello-pangea/dnd.
 * It provides a consistent interface for creating draggable items in drag-and-drop interfaces.
 * @param {MetDraggableProps} props - The properties for the draggable item.
 * @param {number} props.index - The index of the draggable item within its droppable area.
 * @param {React.ReactNode} props.children - The content to be rendered as the draggable item.
 * @param {string} props.draggableId - The unique identifier for the draggable item.
 * @param {object} [props.sx] - Additional styles to be applied to the draggable item.
 * @returns {JSX.Element} A Box component that serves as a draggable item.
 * @example
 * <MetDroppable droppableId="droppable-1">
 *     <MetDraggable draggableId="draggable-1" index={0}>
 *         <div>Draggable Item 1</div>
 *     </MetDraggable>
 *     <MetDraggable draggableId="draggable-2" index={1}>
 *         <div>Draggable Item 2</div>
 *     </MetDraggable>
 * </MetDroppable>
 */
export const MetDraggable = ({ children, draggableId, index, sx }: MetDraggableProps) => {
    return (
        <Draggable key={draggableId} draggableId={draggableId} index={index}>
            {(provided: DraggableProvided) => (
                <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    sx={{
                        marginBottom: '1em',
                        ...provided.draggableProps.style,
                        ...sx,
                    }}
                >
                    {children}
                </Box>
            )}
        </Draggable>
    );
};
