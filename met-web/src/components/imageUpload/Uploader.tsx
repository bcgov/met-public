import React, { useEffect, useContext } from 'react';
import { Grid, Stack, Typography } from '@mui/material';
import Dropzone, { Accept } from 'react-dropzone';
import { PrimaryButtonOld, SecondaryButtonOld } from 'components/common';
import { ImageUploadContext } from './imageUploadContext';

interface UploaderProps {
    margin?: number;
    helpText?: string;
    height?: string;
    accept?: Accept;
}
const Uploader = ({
    margin = 2,
    helpText = 'Drag and drop some files here, or click to select files',
    height = '10em',
    accept = {},
}: UploaderProps) => {
    const {
        handleAddFile,
        addedImageFileUrl,
        setAddedImageFileUrl,
        setAddedImageFileName,
        existingImageUrl,
        setExistingImageURL,
        setCropModalOpen,
        imgAfterCrop,
        setImgAfterCrop,
    } = useContext(ImageUploadContext);

    useEffect(() => {
        return () => {
            if (addedImageFileUrl) {
                URL.revokeObjectURL(addedImageFileUrl);
            }
        };
    }, []);

    const existingImage = imgAfterCrop || addedImageFileUrl || existingImageUrl;

    if (existingImage) {
        return (
            <Grid container direction="row" alignItems="flex-start" justifyContent={'flex-end'} spacing={1} padding={1}>
                <Grid
                    item
                    xs={12}
                    style={{
                        border: '1px dashed #606060',
                        height: height,
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
                            URL.revokeObjectURL(addedImageFileUrl);
                            setExistingImageURL('');
                            setAddedImageFileUrl('');
                            setAddedImageFileName('');
                            setImgAfterCrop('');
                        }}
                    />
                </Grid>
                <Grid item xs={12} container justifyContent="flex-end" direction="row">
                    <Stack
                        direction={{ sm: 'column-reverse', lg: 'row' }}
                        spacing={1}
                        width="100%"
                        justifyContent="flex-end"
                    >
                        <SecondaryButtonOld
                            onClick={() => {
                                setAddedImageFileUrl('');
                                setAddedImageFileName('');
                                setExistingImageURL('');
                                setImgAfterCrop('');
                                handleAddFile([]);
                                URL.revokeObjectURL(addedImageFileUrl);
                            }}
                            size="small"
                        >
                            Remove
                        </SecondaryButtonOld>
                        <PrimaryButtonOld
                            onClick={() => {
                                setCropModalOpen(true);
                            }}
                            size="small"
                        >
                            Crop
                        </PrimaryButtonOld>
                    </Stack>
                </Grid>
            </Grid>
        );
    }
    return (
        <Dropzone
            onDrop={(acceptedFiles) => {
                if (acceptedFiles.length === 0) return;
                const createdObjectURL = URL.createObjectURL(acceptedFiles[0]);
                handleAddFile(acceptedFiles);
                setAddedImageFileUrl(createdObjectURL);
                setAddedImageFileName(acceptedFiles[0].name);
            }}
            accept={accept}
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
                            height: height,
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
