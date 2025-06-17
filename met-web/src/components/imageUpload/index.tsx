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
/**
 * ImageUpload component allows users to upload images with drag-and-drop functionality.
 * It provides a user-friendly interface for selecting images, displaying upload instructions,
 * and supports image cropping.
 * @param {Object} props - The properties for the ImageUpload component.
 * @param {number} [props.margin=2] - Margin around the uploader.
 * @param {function} props.handleAddFile - Callback function to handle file addition.
 * @param {string} [props.savedImageUrl=''] - URL of a previously saved image.
 * @param {string} [props.savedImageName=''] - Name of a previously saved image.
 * @param {string} [props.helpText='Drag and drop your image here.'] - Instruction text for users.
 * @param {string} [props.height='10em'] - Height of the uploader component.
 * @param {number} [props.cropAspectRatio=1] - Aspect ratio for image cropping.
 * @param {Accept} [props.accept] - Accepted file types for upload.
 * @returns {JSX.Element} The rendered ImageUpload component.
 */
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
                <BodyText
                    bold
                    size="small"
                    sx={{ color: colors.surface.blue[90], textAlign: 'center', pl: '1rem', pr: '1rem' }}
                >
                    {helpText}
                </BodyText>
                <BodyText
                    size="small"
                    sx={{ color: colors.surface.gray[80], textAlign: 'center', pl: '1rem', pr: '1rem' }}
                >
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
