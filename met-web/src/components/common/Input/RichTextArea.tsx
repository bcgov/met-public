import React from 'react';
import { ContentBlock, ContentState, Editor, EditorProps } from 'react-draft-wysiwyg';
import { Link } from '../Navigation';
import { Header2 } from '../Typography';

const LinkRenderer = ({
    children,
    contentState,
    entityKey,
}: {
    children: React.ReactNode;
    contentState: ContentState;
    entityKey: string;
}) => {
    const { url } = contentState.getEntity(entityKey).getData();
    return <Link to={url}>{children}</Link>;
};

const Header2Renderer = ({ children }: { children: React.ReactNode }) => {
    return (
        <Header2 decorated weight="thin">
            {children}
        </Header2>
    );
};

export const RichTextArea = ({ customDecorators, ...props }: EditorProps) => {
    return (
        <Editor
            customDecorators={[
                {
                    // Find all entities of type 'LINK' and render them using the Link component
                    strategy: (
                        contentBlock: ContentBlock,
                        callback: (start: number, end: number) => void,
                        contentState: ContentState,
                    ) => {
                        contentBlock.findEntityRanges((character) => {
                            const entityKey = character.getEntity();
                            return entityKey !== null && contentState.getEntity(entityKey).getType() === 'LINK';
                        }, callback);
                    },
                    component: LinkRenderer,
                },
                {
                    // Find all blocks with h2 style and render them using the Header2 component
                    strategy: (contentBlock: ContentBlock, callback: (start: number, end: number) => void) => {
                        console.log(contentBlock);
                        if (!contentBlock) return;
                        if (contentBlock.getType() === 'header-two') {
                            callback(contentBlock.getDepth(), contentBlock.getDepth() + contentBlock.getLength());
                        }
                    },
                    component: Header2Renderer,
                },
                ...(customDecorators || []),
            ]}
            {...props}
        />
    );
};
