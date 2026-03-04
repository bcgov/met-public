import React, { createContext, useContext } from 'react';
import { SubmissionStatusTypes } from 'constants/engagementStatus';

interface PreviewContextType {
    isPreviewMode: boolean;
    showPlaceholders: boolean;
    previewStateType: SubmissionStatusTypes | null;
}

const PreviewContext = createContext<PreviewContextType>({
    isPreviewMode: false,
    showPlaceholders: false,
    previewStateType: null,
});

interface PreviewProviderProps {
    children: React.ReactNode;
    isPreviewMode?: boolean;
    showPlaceholders?: boolean;
    previewStateType?: SubmissionStatusTypes | null;
}

/**
 * Provider for preview mode context.
 * Wraps engagement view components to enable preview-specific behavior and placeholders.
 */
export const PreviewProvider: React.FC<PreviewProviderProps> = ({
    children,
    isPreviewMode = false,
    showPlaceholders = false,
    previewStateType = null,
}) => {
    const value = React.useMemo(
        () => ({ isPreviewMode, showPlaceholders, previewStateType }),
        [isPreviewMode, showPlaceholders, previewStateType],
    );
    return <PreviewContext.Provider value={value}>{children}</PreviewContext.Provider>;
};

/**
 * Hook to access preview context.
 * @returns {PreviewContextType} The current preview context values.
 */
export const usePreview = (): PreviewContextType => {
    return useContext(PreviewContext);
};

export default PreviewContext;
