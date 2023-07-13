import React from 'react';
import { FileUploadContextProvider } from './FileUploadContext';
import Uploader from './Uploader';
import { Accept } from 'react-dropzone';

interface UploaderProps {
    margin?: number;
    handleAddFile: (_files: File[]) => void;
    savedFile?: File;
    savedFileName?: string;
    helpText?: string;
    height?: string;
    acceptedFormat?: Accept;
}

export const FileUpload = ({
    margin = 2,
    handleAddFile,
    savedFileName = '',
    helpText = 'Drag and drop some files here, or click to select files',
    height = '10em',
    acceptedFormat,
}: UploaderProps) => {
    return (
        <FileUploadContextProvider handleAddFile={handleAddFile} savedFileName={savedFileName}>
            <Uploader acceptedFormat={acceptedFormat} margin={margin} helpText={helpText} height={height} />
        </FileUploadContextProvider>
    );
};

export default FileUpload;
