import React, { createContext, useEffect, useState } from 'react';

export interface ImageUploadContextState {
    cropModalOpen: boolean;
    setCropModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleAddFile: (_files: File[]) => void;
    savedImageUrl: string;
    savedImageName: string;
    addedImageFileUrl: string;
    setAddedImageFileUrl: React.Dispatch<React.SetStateAction<string>>;
    addedImageFileName: string;
    setAddedImageFileName: React.Dispatch<React.SetStateAction<string>>;
    existingImageUrl: string;
    setExistingImageURL: React.Dispatch<React.SetStateAction<string>>;
    imgAfterCrop: string;
    setImgAfterCrop: React.Dispatch<React.SetStateAction<string>>;
    cropAspectRatio: number;
}

export const ImageUploadContext = createContext<ImageUploadContextState>({
    cropModalOpen: false,
    setCropModalOpen: () => {
        throw new Error('setCropModalOpen not implemented');
    },
    handleAddFile: () => {
        throw new Error('handleAddFile not implemented');
    },
    savedImageUrl: '',
    savedImageName: '',
    addedImageFileUrl: '',
    setAddedImageFileUrl: () => {
        throw new Error('setAddedImageFileUrl not implemented');
    },
    addedImageFileName: '',
    setAddedImageFileName: () => {
        throw new Error('setAddedImageFileName not implemented');
    },
    existingImageUrl: '',
    setExistingImageURL: () => {
        throw new Error('setExistingImageURL not implemented');
    },
    imgAfterCrop: '',
    setImgAfterCrop: () => {
        throw new Error('setExistingImageURL not implemented');
    },
    cropAspectRatio: 1,
});

interface ImageUploadContextProviderProps {
    handleAddFile: (_files: File[]) => void;
    children: React.ReactNode;
    savedImageUrl: string;
    savedImageName: string;
    cropAspectRatio: number;
}
export const ImageUploadContextProvider = ({
    children,
    handleAddFile,
    savedImageUrl,
    savedImageName,
    cropAspectRatio,
}: ImageUploadContextProviderProps) => {
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [addedImageFileUrl, setAddedImageFileUrl] = useState('');
    const [addedImageFileName, setAddedImageFileName] = useState('');

    const [existingImageUrl, setExistingImageURL] = useState(savedImageUrl);
    const [imgAfterCrop, setImgAfterCrop] = useState('');

    useEffect(() => {
        setExistingImageURL(savedImageUrl);
    }, [savedImageUrl]);

    return (
        <ImageUploadContext.Provider
            value={{
                cropModalOpen,
                setCropModalOpen,
                handleAddFile,
                savedImageUrl,
                savedImageName,
                addedImageFileUrl,
                setAddedImageFileUrl,
                addedImageFileName,
                setAddedImageFileName,
                existingImageUrl,
                setExistingImageURL,
                imgAfterCrop,
                setImgAfterCrop,
                cropAspectRatio,
            }}
        >
            {children}
        </ImageUploadContext.Provider>
    );
};
