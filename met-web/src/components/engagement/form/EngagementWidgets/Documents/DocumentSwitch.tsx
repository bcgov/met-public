import React from 'react';
import { DocumentItem } from 'models/document';
import { Else, If, Then } from 'react-if';
import DocumentFolder from './DocumentFolder';
import DocumentFile from './DocumentFile';

const DocumentSwitch = ({ documentItem }: { documentItem: DocumentItem }) => {
    return (
        <If condition={documentItem.folder}>
            <Then>
                <DocumentFolder documentItem={documentItem} />
            </Then>
            <Else>
                <DocumentFile documentItem={documentItem} />
            </Else>
        </If>
    );
};

export default DocumentSwitch;
