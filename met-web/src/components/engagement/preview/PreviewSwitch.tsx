import React from 'react';
import { usePreview } from './PreviewContext';

interface PreviewResolutionProps<T> {
    isPreviewMode?: boolean;
    hasValue: boolean;
    value: T;
    previewFallback?: T;
    fallback?: T;
}

type PreviewSwitchProps = PreviewResolutionProps<React.ReactNode>;

interface PreviewRenderProps<T> extends PreviewResolutionProps<T> {
    children: (resolvedValue: T) => React.ReactNode;
}

/**
 * Resolves a value based on preview mode and value availability.
 */
export const previewValue = <T,>({
    isPreviewMode,
    hasValue,
    value,
    previewFallback,
    fallback,
}: PreviewResolutionProps<T>): T | undefined => {
    if (hasValue) return value;
    return isPreviewMode ? (previewFallback ?? fallback) : fallback;
};

/**
 * Renders via render-prop after resolving preview/live/fallback value.
 */
export const PreviewRender = <T,>({
    isPreviewMode,
    hasValue,
    value,
    previewFallback,
    fallback,
    children,
}: PreviewRenderProps<T>) => {
    const { isPreviewMode: contextPreviewMode } = usePreview();
    const resolvedValue = previewValue({
        isPreviewMode: isPreviewMode ?? contextPreviewMode,
        hasValue,
        value,
        previewFallback,
        fallback,
    });

    if (resolvedValue === undefined || resolvedValue === null) {
        return null;
    }

    return <>{children(resolvedValue)}</>;
};

/**
 * Renders regular content when available, and supports preview/non-preview fallbacks when unavailable.
 */
export const PreviewSwitch: React.FC<PreviewSwitchProps> = ({
    isPreviewMode,
    hasValue,
    value,
    previewFallback = null,
    fallback = null,
}) => {
    const { isPreviewMode: contextPreviewMode } = usePreview();
    const resolvedValue = previewValue({
        isPreviewMode: isPreviewMode ?? contextPreviewMode,
        hasValue,
        value,
        previewFallback,
        fallback,
    });

    return <>{resolvedValue ?? null}</>;
};

export default PreviewSwitch;
