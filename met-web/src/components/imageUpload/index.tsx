import React from 'react';
import { CropModal } from './cropModal';
import { ImageUploadContextProvider } from './imageUploadContext';
import Uploader from './Uploader';
import { Accept } from 'react-dropzone';

interface UploaderProps {
    margin?: number;
    handleAddFile: (_files: File[]) => void;
    savedImageUrl?: string;
    savedImageName?: string;
    helpText?: string;
    height?: string;
    cropAspectRatio?: number;
    accept?: Accept;
}
export const ImageUpload = ({
    margin = 2,
    handleAddFile,
    savedImageUrl = '',
    savedImageName = '',
    helpText = 'Drag and drop an image here, or click to select an image from your device. Formats accepted are: jpg, png, webp.',
    height = '10em',
    cropAspectRatio = 1,
    accept = {
        'image/jpeg': [],
        'image/png': [],
        'image/webp': [],
    },
}: UploaderProps) => {
    return (
        <ImageUploadContextProvider
            handleAddFile={handleAddFile}
            savedImageUrl={savedImageUrl}
            savedImageName={savedImageName}
            cropAspectRatio={cropAspectRatio}
        >
            <Uploader margin={margin} helpText={helpText} height={height} accept={accept} />
            <CropModal />
        </ImageUploadContextProvider>
    );
};

export default ImageUpload;
