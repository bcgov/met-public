import React, { useEffect, useContext } from 'react';
import { Grid, Stack, Typography } from '@mui/material';
import Dropzone, { Accept } from 'react-dropzone';
import { PrimaryButtonOld, SecondaryButtonOld } from 'components/common';
import { ImageUploadContext } from './imageUploadContext';
import { colors } from 'components/common';
import { Button } from 'components/common/Input';

interface UploaderProps {
    height?: string;
    accept?: Accept;
    children: React.ReactNode;
}
const Uploader = ({ height = '10em', accept = {}, children }: UploaderProps) => {
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
                        borderRadius: '8px',
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
                    <Stack direction="row" spacing={1} width="100%" justifyContent="flex-end">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setAddedImageFileUrl('');
                                setAddedImageFileName('');
                                setExistingImageURL('');
                                setImgAfterCrop('');
                                handleAddFile([]);
                                URL.revokeObjectURL(addedImageFileUrl);
                            }}
                            size="small"
                            sx={{ width: '88px' }}
                        >
                            Remove
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setCropModalOpen(true);
                            }}
                            size="small"
                            sx={{ width: '88px' }}
                        >
                            Crop
                        </Button>
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
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                        style={{
                            paddingTop: '1em',
                            borderRadius: '8px',
                            border: `2px dashed ${colors.surface.gray[80]}`,
                            background: colors.surface.blue[10],
                            height: height,
                            cursor: 'pointer',
                        }}
                    >
                        <input {...getInputProps()} multiple={false} accept={'image/*'} />
                        {children}
                    </Grid>
                </section>
            )}
        </Dropzone>
    );
};

export default Uploader;
