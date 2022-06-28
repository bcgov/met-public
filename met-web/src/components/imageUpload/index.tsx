import React, { useState, useEffect } from 'react';
import { Grid, Button } from '@mui/material';
import Dropzone from 'react-dropzone';

interface ImageUploadProps {
    handleAddFile: (_files: File[]) => void;
}
const ImageUpload = ({ handleAddFile }: ImageUploadProps) => {
    const [objectUrl, setObjectUrl] = useState('');

    useEffect(() => {
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, []);

    if (objectUrl) {
        return (
            <Grid container alignItems="flex-start" justifyContent={'flex-end'} direction="row" spacing={1}>
                <Grid
                    item
                    xs={12}
                    style={{
                        border: '1px dashed #606060',
                        height: '10em',
                    }}
                >
                    <img
                        src={objectUrl}
                        style={{
                            objectFit: 'cover',
                            width: '100%',
                            height: '100%',
                        }}
                    />
                </Grid>
                <Grid>
                    <Button
                        onClick={() => {
                            URL.revokeObjectURL(objectUrl);
                            handleAddFile([]);
                        }}
                    >
                        Remove Image
                    </Button>
                </Grid>
            </Grid>
        );
    }
    return (
        <Dropzone
            onDrop={(acceptedFiles) => {
                handleAddFile(acceptedFiles);
                setObjectUrl(URL.createObjectURL(acceptedFiles[0]));
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
                        <p>Drag 'n' drop some files here, or click to select files</p>
                    </Grid>
                </section>
            )}
        </Dropzone>
    );
};

export default ImageUpload;
