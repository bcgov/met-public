import React from 'react';
import { CropModal } from './cropModal';
import { ImageUploadContextProvider } from './imageUploadContext';
import Uploader from './Uploader';

interface UploaderProps {
    margin?: number;
    handleAddFile: (_files: File[]) => void;
    savedImageUrl?: string;
    helpText?: string;
}
export const ImageUpload = ({
    margin = 2,
    handleAddFile,
    savedImageUrl = '',
    helpText = 'Drag and drop some files here, or click to select files',
}: UploaderProps) => {
    return (
        <ImageUploadContextProvider handleAddFile={handleAddFile} savedImageUrl={savedImageUrl}>
            <Uploader margin={margin} helpText={helpText} />
            <CropModal />
        </ImageUploadContextProvider>
    );
};

export default ImageUpload;
