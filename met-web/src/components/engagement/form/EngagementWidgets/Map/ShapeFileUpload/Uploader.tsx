import React, { useContext } from 'react';
import { Grid, Stack, Typography, IconButton } from '@mui/material';
import Dropzone, { Accept } from 'react-dropzone';
import { MetWidgetPaper, WidgetButton } from 'components/common';
import { FileUploadContext } from './FileUploadContext';
import LinkIcon from '@mui/icons-material/Link';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

interface UploaderProps {
    acceptedFormat?: Accept;
}
const Uploader = ({ acceptedFormat = { 'application/zip': ['.zip'] } }: UploaderProps) => {
    const { handleAddFile, savedFileName, addedFileName, setAddedFileName } = useContext(FileUploadContext);

    const existingFile = addedFileName;

    if (existingFile) {
        return (
            <>
                <Dropzone
                    accept={acceptedFormat}
                    onDrop={(acceptedFiles) => {
                        handleAddFile(acceptedFiles);
                        setAddedFileName(acceptedFiles[0].name);
                    }}
                >
                    {({ getInputProps, open }) => (
                        <section>
                            <input {...getInputProps()} />
                            <WidgetButton onClick={open} sx={{ mb: 1 }}>
                                Upload Shapefile
                            </WidgetButton>
                        </section>
                    )}
                </Dropzone>
                <Grid container direction="row" alignItems="flex-start" justifyContent={'flex-start'} item xs={12}>
                    <MetWidgetPaper elevation={1} sx={{ width: '100%' }}>
                        <Grid container direction="row" alignItems={'center'} justifyContent="flex-start">
                            <Grid item xs>
                                <Stack spacing={2} direction="row" alignItems="center">
                                    <LinkIcon color="info" />
                                    <Typography>{addedFileName ? addedFileName : savedFileName}</Typography>
                                </Stack>
                            </Grid>
                            <IconButton
                                onClick={() => {
                                    setAddedFileName('');
                                    handleAddFile([]);
                                }}
                                sx={{ padding: 0, margin: 0 }}
                                color="inherit"
                                aria-label="Remove Shapefile"
                            >
                                <HighlightOffIcon />
                            </IconButton>
                        </Grid>
                    </MetWidgetPaper>
                </Grid>
            </>
        );
    }
    return (
        <Dropzone
            accept={acceptedFormat}
            onDrop={(acceptedFiles) => {
                handleAddFile(acceptedFiles);
                setAddedFileName(acceptedFiles[0].name);
            }}
        >
            {({ getInputProps, open }) => (
                <section>
                    <input {...getInputProps()} />
                    <WidgetButton onClick={open}>Upload Shapefile </WidgetButton>
                </section>
            )}
        </Dropzone>
    );
};

export default Uploader;
