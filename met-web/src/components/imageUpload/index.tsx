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
    height?: string;
    cropAspectRatio?: number;
}
export const ImageUpload = ({
    margin = 2,
    handleAddFile,
    savedImageUrl = '',
    savedImageName = '',
    helpText = 'Drag and drop some files here, or click to select files',
    height = '10em',
    cropAspectRatio = 1,
}: UploaderProps) => {
    return (
        <ImageUploadContextProvider
            handleAddFile={handleAddFile}
            savedImageUrl={savedImageUrl}
            savedImageName={savedImageName}
            cropAspectRatio={cropAspectRatio}
        >
            <Uploader margin={margin} helpText={helpText} height={height} />
            <CropModal />
        </ImageUploadContextProvider>
    );
};

export default ImageUpload;
