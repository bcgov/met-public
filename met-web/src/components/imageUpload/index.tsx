import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import Dropzone from 'react-dropzone';
import { SecondaryButton } from 'components/common';

interface ImageUploadProps {
    handleAddFile: (_files: File[]) => void;
    savedImageUrl?: string;
    helpText?: string;
}
const ImageUpload = ({
    handleAddFile,
    savedImageUrl = '',
    helpText = 'Drag and drop some files here, or click to select files',
}: ImageUploadProps) => {
    const [objectUrl, setObjectUrl] = useState('');
    const [existingImageUrl, setExistingImageURL] = useState(savedImageUrl);

    useEffect(() => {
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, []);

    if (objectUrl || existingImageUrl) {
        return (
            <Grid container direction="row" alignItems="flex-start" justifyContent={'flex-end'} spacing={1} padding={1}>
                <Grid
                    item
                    xs={12}
                    style={{
                        border: '1px dashed #606060',
                        height: '10em',
                        padding: '0',
                    }}
                >
                    <img
                        src={objectUrl || existingImageUrl}
                        style={{
                            objectFit: 'cover',
                            width: '100%',
                            height: '100%',
                        }}
                        onError={() => {
                            URL.revokeObjectURL(objectUrl);
                            setExistingImageURL('');
                            setObjectUrl('');
                        }}
                    />
                </Grid>
                <Grid item xs={12} container justifyContent="flex-end" direction="row">
                    <SecondaryButton
                        onClick={() => {
                            setObjectUrl('');
                            setExistingImageURL('');
                            handleAddFile([]);
                            URL.revokeObjectURL(objectUrl);
                        }}
                        size="small"
                    >
                        Remove
                    </SecondaryButton>
                </Grid>
            </Grid>
        );
    }
    return (
        <Dropzone
            onDrop={(acceptedFiles) => {
                const createdObjectURL = URL.createObjectURL(acceptedFiles[0]);
                handleAddFile(acceptedFiles);
                setObjectUrl(createdObjectURL);
            }}
        >
            {({ getRootProps, getInputProps }) => (
                <section>
                    <Grid
                        {...getRootProps()}
                        container
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                        style={{
                            border: '1px dashed #606060',
                            background: '#F2F2F2 0% 0% no-repeat padding-box',
                            height: '10em',
                            cursor: 'pointer',
                        }}
                    >
                        <input {...getInputProps()} multiple={false} accept={'image/*'} />
                        <Typography m={4}>{helpText}</Typography>
                    </Grid>
                </section>
            )}
        </Dropzone>
    );
};

export default ImageUpload;
