import React from 'react';
import { CropModal } from './cropModal';
import { ImageUploadContextProvider } from './imageUploadContext';
import Uploader from './Uploader';
import { Accept } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUpload } from '@fortawesome/pro-regular-svg-icons';
import { colors } from 'components/common';
import { BodyText } from 'components/common/Typography';
import { Button } from 'components/common/Input';

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
    helpText = 'Drag and drop your image here.',
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
            <Uploader height={height} accept={accept}>
                <FontAwesomeIcon icon={faCloudUpload} size="2x" color={colors.surface.blue[90]} />
                <BodyText bold size="small" sx={{ color: colors.surface.blue[90], textAlign: 'center' }}>
                    {helpText}
                </BodyText>
                <BodyText size="small" sx={{ color: colors.surface.gray[80] }}>
                    Supported formats: JPG, PNG, WEBP
                </BodyText>
                <Button id="select-file-button" variant="secondary" size="small" sx={{ mt: '1.5em' }}>
                    Select File
                </Button>
            </Uploader>
            <CropModal />
        </ImageUploadContextProvider>
    );
};

export default ImageUpload;
