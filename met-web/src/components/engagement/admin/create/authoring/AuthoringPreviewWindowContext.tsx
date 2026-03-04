import React, { createContext, useContext, useRef } from 'react';

interface AuthoringPreviewWindowContextType {
    getActivePreviewWindow: () => Window | null;
    setPreviewWindow: (previewWindow: Window | null) => void;
    cancelScheduledPreviewClose: () => void;
    schedulePreviewClose: (delayMs: number) => void;
    closePreviewWindow: () => void;
}

const AuthoringPreviewWindowContext = createContext<AuthoringPreviewWindowContextType | null>(null);

interface AuthoringPreviewWindowProviderProps {
    children: React.ReactNode;
}

export const AuthoringPreviewWindowProvider: React.FC<AuthoringPreviewWindowProviderProps> = ({ children }) => {
    const previewWindowRef = useRef<Window | null>(null);
    const scheduledCloseRef = useRef<ReturnType<typeof globalThis.setTimeout> | null>(null);

    const getActivePreviewWindow = () => {
        if (previewWindowRef.current && !previewWindowRef.current.closed) {
            return previewWindowRef.current;
        }
        previewWindowRef.current = null;
        return null;
    };

    const setPreviewWindow = (previewWindow: Window | null) => {
        previewWindowRef.current = previewWindow;
    };

    const cancelScheduledPreviewClose = () => {
        if (scheduledCloseRef.current) {
            globalThis.clearTimeout(scheduledCloseRef.current);
            scheduledCloseRef.current = null;
        }
    };

    const closePreviewWindow = () => {
        const previewWindow = getActivePreviewWindow();
        if (previewWindow) {
            previewWindow.close();
        }
        previewWindowRef.current = null;
    };

    const schedulePreviewClose = (delayMs: number) => {
        cancelScheduledPreviewClose();
        scheduledCloseRef.current = globalThis.setTimeout(() => {
            closePreviewWindow();
            scheduledCloseRef.current = null;
        }, delayMs);
    };

    return (
        <AuthoringPreviewWindowContext.Provider
            value={{
                getActivePreviewWindow,
                setPreviewWindow,
                cancelScheduledPreviewClose,
                schedulePreviewClose,
                closePreviewWindow,
            }}
        >
            {children}
        </AuthoringPreviewWindowContext.Provider>
    );
};

export const useAuthoringPreviewWindow = (): AuthoringPreviewWindowContextType => {
    const context = useContext(AuthoringPreviewWindowContext);
    if (!context) {
        throw new Error('useAuthoringPreviewWindow must be used within an AuthoringPreviewWindowProvider');
    }
    return context;
};

export default AuthoringPreviewWindowContext;
