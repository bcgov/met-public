import React, { useContext } from 'react';
import { Grid, Stack, Typography } from '@mui/material';
import Dropzone, { Accept } from 'react-dropzone';
import { MetWidgetPaper, SecondaryButton } from 'components/common';
import { FileUploadContext } from './FileUploadContext';
import LinkIcon from '@mui/icons-material/Link';

interface UploaderProps {
    margin?: number;
    helpText?: string;
    height?: string;
    acceptedFormat?: Accept;
}
const Uploader = ({
    margin = 2,
    helpText = 'Drag and drop some files here, or click to select files',
    height = '10em',
    acceptedFormat = { 'application/shapefile': ['.shp'] },
}: UploaderProps) => {
    const { handleAddFile, savedFileName, addedFileName, setAddedFileName } = useContext(FileUploadContext);

    const existingFile = addedFileName;

    if (existingFile) {
        return (
            <Grid container direction="row" alignItems="flex-start" justifyContent={'flex-end'} spacing={1} padding={1}>
                <Grid item xs={12}>
                    <MetWidgetPaper elevation={1} sx={{ width: '100%' }}>
                        <Grid container direction="row" alignItems={'center'} justifyContent="flex-start">
                            <Grid item xs>
                                <Stack spacing={2} direction="row" alignItems="center">
                                    <LinkIcon color="info" />
                                    <Typography>{addedFileName ? addedFileName : savedFileName}</Typography>
                                </Stack>
                            </Grid>
                        </Grid>
                    </MetWidgetPaper>
                </Grid>
                <Grid item xs={12} container justifyContent="flex-end" direction="row">
                    <Stack
                        direction={{ sm: 'column-reverse', lg: 'row' }}
                        spacing={1}
                        width="100%"
                        justifyContent="flex-end"
                    >
                        <SecondaryButton
                            onClick={() => {
                                setAddedFileName('');
                                handleAddFile([]);
                            }}
                            size="small"
                        >
                            Remove
                        </SecondaryButton>
                    </Stack>
                </Grid>
            </Grid>
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
