import React, { useState, useEffect, useContext } from 'react';
import { Grid, Stack, Typography } from '@mui/material';
import Dropzone from 'react-dropzone';
import { PrimaryButton, SecondaryButton } from 'components/common';
import Cropper, { Area } from 'react-easy-crop';
import { ImageUploadContext } from './imageUploadContext';

interface UploaderProps {
    margin?: number;
    helpText?: string;
}
const Uploader = ({
    margin = 2,
    helpText = 'Drag and drop some files here, or click to select files',
}: UploaderProps) => {
    const {
        handleAddFile,
        objectUrl,
        setObjectUrl,
        existingImageUrl,
        setExistingImageURL,
        setCropModalOpen,
        imgAfterCrop,
    } = useContext(ImageUploadContext);

    useEffect(() => {
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, []);

    useEffect(() => {
        console.log('imgAfterCrop', imgAfterCrop);
    }, [imgAfterCrop]);
    const existingImage = imgAfterCrop || objectUrl || existingImageUrl;

    if (existingImage) {
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
                        src={existingImage}
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
                    <Stack
                        direction={{ md: 'column-reverse', lg: 'row' }}
                        spacing={1}
                        width="100%"
                        justifyContent="flex-end"
                    >
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
                        <PrimaryButton
                            onClick={() => {
                                setCropModalOpen(true);
                            }}
                        >
                            Crop
                        </PrimaryButton>
                    </Stack>
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
                        <Typography m={margin}>{helpText}</Typography>
                    </Grid>
                </section>
            )}
        </Dropzone>
    );
};

export default Uploader;
