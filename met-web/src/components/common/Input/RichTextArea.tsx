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

/**
 * A Rich Text Area component that uses react-draft-wysiwyg to render a rich text editor.
 * It contains custom styling for links and headers.
 * Can also be used in read-only mode to display rich text content.
 * @param {EditorProps} props - Other props to pass to the Editor component.
 * @param {Array} props.customDecorators - Optional custom decorators to extend the functionality of the editor.
 * @param {boolean} props.readOnly - Optional prop to render the editor in read-only mode.
 *                   If true, the editor will not allow any text input or modifications.
 * @see {@link https://jpuri.github.io/react-draft-wysiwyg/#/docs} for more details on the editor and its options.
 * @see {@link https://draftjs.org/docs/advanced-topics-decorators} for more information on decorators in Draft.js.
 * @see {@link https://draftjs.org/docs/advanced-topics-block-styling} for more information on block styles in Draft.js.
 * @returns
 */
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
