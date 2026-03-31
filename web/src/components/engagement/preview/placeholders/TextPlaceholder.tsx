import { BodyText } from 'components/common/Typography';
import React from 'react';

interface TextPlaceholderProps {
    type?: 'short' | 'paragraph' | 'long';
    text?: string;
}

/**
 * Text placeholder for missing content in preview mode.
 * Shows example text or lorem ipsum depending on the text type.
 * Returns just the text content so parent typography components can apply their own styling.
 */
export const TextPlaceholder: React.FC<TextPlaceholderProps> = ({ type = 'paragraph', text }) => {
    const getPlaceholderText = () => {
        if (text) return text;
        switch (type) {
            case 'short':
                return 'Lorem ipsum dolor sit amet.';
            case 'paragraph':
                return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.';
            case 'long':
                return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
            default:
                return 'Example text';
        }
    };

    return (
        <BodyText
            component="span"
            color="currentColor"
            fontSize="inherit"
            fontStyle="inherit"
            fontWeight="inherit"
            lineHeight="inherit"
            sx={{
                textDecoration: 'underline',
                textDecorationStyle: 'wavy',
                textDecorationColor: 'color-mix(in srgb, currentColor, transparent 70%)',
                '&:hover': {
                    opacity: 0.5,
                },
            }}
        >
            {getPlaceholderText()}
        </BodyText>
    );
};

export default TextPlaceholder;
