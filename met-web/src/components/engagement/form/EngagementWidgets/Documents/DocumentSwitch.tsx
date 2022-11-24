import React from 'react';
import { DocumentItem, DOCUMENT_TYPE } from 'models/document';
import { Case, Default, Switch } from 'react-if';
import DocumentFolder from './DocumentFolder';
import DocumentFile from './DocumentFile';
const DocumentSwitch = ({ documentItem }: { documentItem: DocumentItem }) => {
    return (
        <Switch>
            <Case condition={documentItem.type === DOCUMENT_TYPE.FOLDER}>
                <DocumentFolder documentItem={documentItem} />
            </Case>
            <Case condition={documentItem.type === DOCUMENT_TYPE.FILE}>
                <DocumentFile documentItem={documentItem} />
            </Case>
            <Default>{null}</Default>
        </Switch>
    );
};

export default DocumentSwitch;
