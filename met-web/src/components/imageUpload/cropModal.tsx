import React, { useContext, useState } from 'react';
import Modal from '@mui/material/Modal';
import { Container, FormControl, FormControlLabel, FormLabel, Grid, Paper, Radio, RadioGroup } from '@mui/material';
import { modalStyle, PrimaryButton } from 'components/common';
import Cropper, { Area } from 'react-easy-crop';
import { ImageUploadContext } from './imageUploadContext';
import { Box } from '@mui/system';
import getCroppedImg from './cropImage';
import { blobToFile } from 'utils';

export const CropModal = () => {
    const {
        existingImageUrl,
        addedImageFileUrl,
        setImgAfterCrop,
        cropModalOpen,
        setCropModalOpen,
        handleAddFile,
        savedImageName,
        addedImageFileName,
    } = useContext(ImageUploadContext);

    const currentImageUrl = addedImageFileUrl || existingImageUrl;

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState<Area | null>(null);
    const [aspectRatio, setAspectRatio] = useState(4 / 3);

    const handleCropDone = async (imgCroppedArea: Area | null) => {
        if (!imgCroppedArea) {
            return;
        }
        const croppedImage = await getCroppedImg(currentImageUrl, imgCroppedArea);
        if (!croppedImage) {
            return;
        }
        setImgAfterCrop(URL.createObjectURL(croppedImage));
        const imageFile = blobToFile(croppedImage, addedImageFileName || savedImageName);
        handleAddFile([imageFile]);
        setCropModalOpen(false);
    };

    const handleAspectRatioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAspectRatio(Number((event.target as HTMLInputElement).value));
    };

    return (
        <Modal
            open={cropModalOpen}
            onClose={() => {
                setCropModalOpen(false);
            }}
            keepMounted={false}
        >
            <Paper sx={{ ...modalStyle, padding: '19em' }}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: '10em',
                        }}
                    >
                        <Cropper
                            image={addedImageFileUrl || existingImageUrl}
                            aspect={aspectRatio}
                            crop={crop}
                            zoom={zoom}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={(_croppedAreaPercentage, croppedAreaPixels) => {
                                setCroppedArea(croppedAreaPixels);
                            }}
                            style={{
                                containerStyle: {
                                    backgroundColor: '#fff',
                                },
                            }}
                        />
                    </Box>
                    <Container
                        sx={{
                            marginTop: '29em',
                        }}
                    >
                        <Grid container direction="row" alignItems="flex-start" justifyContent="flex-start" spacing={2}>
                            <Grid item xs={12}>
                                <FormControl>
                                    <FormLabel>Gender</FormLabel>
                                    <RadioGroup
                                        name="radio-buttons-group"
                                        value={aspectRatio}
                                        onChange={handleAspectRatioChange}
                                        row
                                    >
                                        <FormControlLabel value={1} control={<Radio />} label="1:1" />
                                        <FormControlLabel value={5 / 4} control={<Radio />} label="5:4" />
                                        <FormControlLabel value={4 / 3} control={<Radio />} label="4:3" />
                                        <FormControlLabel value={3 / 2} control={<Radio />} label="3:2" />
                                        <FormControlLabel value={5 / 3} control={<Radio />} label="5:3" />
                                        <FormControlLabel value={16 / 9} control={<Radio />} label="16:9" />
                                        <FormControlLabel value={3 / 1} control={<Radio />} label="3:1" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} container justifyContent="flex-end">
                                <PrimaryButton
                                    onClick={() => {
                                        handleCropDone(croppedArea);
                                    }}
                                >
                                    Save
                                </PrimaryButton>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Paper>
        </Modal>
    );
};
