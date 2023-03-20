import React from 'react';
import { FileUploadContextProvider } from './FileUploadContext';
import Uploader from './Uploader';

interface UploaderProps {
    margin?: number;
    handleAddFile: (_files: File[]) => void;
    savedFile?: File;
    savedFileUrl?: string;
    savedFileName?: string;
    helpText?: string;
    height?: string;
}

export const ShapeFileUpload = ({
    margin = 2,
    handleAddFile,
    savedFileUrl = '',
    savedFileName = '',
    helpText = 'Drag and drop some files here, or click to select files',
    height = '10em',
}: UploaderProps) => {
    return (
        <FileUploadContextProvider
            savedFileUrl={savedFileUrl}
            handleAddFile={handleAddFile}
            savedFileName={savedFileName}
        >
            <Uploader margin={margin} helpText={helpText} height={height} />
        </FileUploadContextProvider>
    );
};

export default ShapeFileUpload;
