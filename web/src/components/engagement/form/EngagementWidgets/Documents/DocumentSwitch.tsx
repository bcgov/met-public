import React from 'react';
import { DocumentItem, DOCUMENT_TYPE } from 'models/document';
import { Case, Default, Switch } from 'react-if';
import DocumentFolder from './DocumentFolder';
import DocumentFile from './DocumentFile';
import { DraggableProvided } from '@hello-pangea/dnd';
const DocumentSwitch = ({
    documentItem,
    draggableProvided,
}: {
    documentItem: DocumentItem;
    draggableProvided: DraggableProvided;
}) => {
    return (
        <Switch>
            <Case condition={documentItem.type === DOCUMENT_TYPE.FOLDER}>
                <DocumentFolder documentItem={documentItem} draggableProvided={draggableProvided} />
            </Case>
            <Case condition={documentItem.type === DOCUMENT_TYPE.FILE}>
                <DocumentFile documentItem={documentItem} draggableProvided={draggableProvided} />
            </Case>
            <Default>{null}</Default>
        </Switch>
    );
};

export default DocumentSwitch;
