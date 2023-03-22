import React, { createContext, useState } from 'react';

export interface FileUploadContextState {
    handleAddFile: (_files: File[]) => void;
    savedFileUrl: string;
    savedFileName: string;
    addedFileUrl: string;
    setAddedFileUrl: React.Dispatch<React.SetStateAction<string>>;
    addedFileName: string;
    setAddedFileName: React.Dispatch<React.SetStateAction<string>>;
    existingFileUrl: string;
    setExistingFileUrl: React.Dispatch<React.SetStateAction<string>>;
}

export const FileUploadContext = createContext<FileUploadContextState>({
    handleAddFile: () => {
        throw new Error('handleAddFile not implemented');
    },
    savedFileUrl: '',
    savedFileName: '',
    addedFileUrl: '',
    setAddedFileUrl: () => {
        throw new Error('setAddedFileUrl not implemented');
    },
    addedFileName: '',
    setAddedFileName: () => {
        throw new Error('setAddedFileName not implemented');
    },
    existingFileUrl: '',
    setExistingFileUrl: () => {
        throw new Error('setExistingFileUrl not implemented');
    },
});

interface FileUploadContextProviderProps {
    handleAddFile: (_files: File[]) => void;
    children: React.ReactNode;
    savedFileUrl: string;
    savedFileName: string;
}
export const FileUploadContextProvider = ({
    children,
    handleAddFile,
    savedFileUrl,
    savedFileName,
}: FileUploadContextProviderProps) => {
    const [addedFileUrl, setAddedFileUrl] = useState('');
    const [addedFileName, setAddedFileName] = useState('');

    const [existingFileUrl, setExistingFileUrl] = useState(savedFileUrl);

    return (
        <FileUploadContext.Provider
            value={{
                handleAddFile,
                savedFileUrl,
                savedFileName,
                addedFileUrl,
                setAddedFileUrl,
                addedFileName,
                setAddedFileName,
                existingFileUrl,
                setExistingFileUrl,
            }}
        >
            {children}
        </FileUploadContext.Provider>
    );
};
