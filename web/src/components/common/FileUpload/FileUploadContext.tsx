import React, { createContext } from 'react';

export interface FileUploadContextState {
    handleAddFile: (_files: File[]) => void;
}

export const FileUploadContext = createContext<FileUploadContextState>({
    handleAddFile: () => {
        throw new Error('handleAddFile not implemented');
    },
});

interface FileUploadContextProviderProps {
    handleAddFile: (_files: File[]) => void;
    children: React.ReactNode;
}
export const FileUploadContextProvider = ({ children, handleAddFile }: FileUploadContextProviderProps) => {
    return (
        <FileUploadContext.Provider
            value={{
                handleAddFile,
            }}
        >
            {children}
        </FileUploadContext.Provider>
    );
};
