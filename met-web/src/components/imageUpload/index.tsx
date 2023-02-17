import React from 'react';
import { CropModal } from './cropModal';
import { ImageUploadContextProvider } from './imageUploadContext';
import Uploader from './Uploader';

interface UploaderProps {
    margin?: number;
    handleAddFile: (_files: File[]) => void;
    savedImageUrl?: string;
    savedImageName?: string;
    helpText?: string;
}
export const ImageUpload = ({
    margin = 2,
    handleAddFile,
    savedImageUrl = '',
    savedImageName = '',
    helpText = 'Drag and drop some files here, or click to select files',
}: UploaderProps) => {
    return (
        <ImageUploadContextProvider
            handleAddFile={handleAddFile}
            savedImageUrl={savedImageUrl}
            savedImageName={savedImageName}
        >
            <Uploader margin={margin} helpText={helpText} />
            <CropModal />
        </ImageUploadContextProvider>
    );
};

export default ImageUpload;
