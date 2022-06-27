import React, { useState, useEffect } from 'react';
import { Grid, Button } from '@mui/material';
import Dropzone from 'react-dropzone';

const ImageUpload = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [objectUrl, setObjectUrl] = useState('');

    useEffect(() => {
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, []);

    if (files.length > 0) {
        return (
            <Grid container alignItems="flex-start" justifyContent={'flex-end'} direction="row" spacing={1}>
                <Grid
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
                            setFiles([]);
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
                setFiles(acceptedFiles);
                setObjectUrl(URL.createObjectURL(acceptedFiles[0]));
                console.log(acceptedFiles);
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
