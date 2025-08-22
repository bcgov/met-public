import React from 'react';
import { FileUploadContextProvider } from './FileUploadContext';
import Uploader from './Uploader';
import { Accept } from 'react-dropzone';

interface UploaderProps {
    margin?: number;
    handleAddFile: (_files: File[]) => void;
    savedFile?: File;
    helpText?: string;
    height?: string;
    acceptedFormat?: Accept;
}

/**
 * FileUpload component allows users to upload files with drag-and-drop functionality.
 * It provides a user-friendly interface for selecting files and displaying upload instructions.
 * @param {number} [margin=2] - Margin around the uploader.
 * @param {function} handleAddFile - Callback function to handle file addition.
 * @param {File} [savedFile] - A previously saved file to display? (NOT USED)
 * @param {string} [helpText='Drag and drop some files here, or click to select files'] - Instruction text for users.
 * @param {string} [height='10em'] - Height of the uploader component.
 * @param {Accept} [acceptedFormat] - Accepted file types for upload.
 * @returns {JSX.Element} The rendered FileUpload component.
 */
export const FileUpload = ({
    margin = 2,
    handleAddFile,
    helpText = 'Drag and drop some files here, or click to select files',
    height = '10em',
    acceptedFormat,
}: UploaderProps) => {
    return (
        <FileUploadContextProvider handleAddFile={handleAddFile}>
            <Uploader acceptedFormat={acceptedFormat} margin={margin} helpText={helpText} height={height} />
        </FileUploadContextProvider>
    );
};

export default FileUpload;
