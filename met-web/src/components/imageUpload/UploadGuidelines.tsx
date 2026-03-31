import React from 'react';
import { Grid2 as Grid } from '@mui/material';
import { BodyText } from 'components/common/Typography/Body';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/pro-regular-svg-icons';

const checkIcon = <FontAwesomeIcon icon={faCheck} style={{ marginRight: '8px', fontSize: '18px' }} />;
const xIcon = <FontAwesomeIcon icon={faXmark} style={{ marginRight: '8px', fontSize: '18px' }} />;

export const UploadGuidelines = () => (
    <Grid container spacing={2} direction="row" mb="0.5em">
        <Grid container spacing={1} size={{ xs: 12, md: 6 }} justifyContent="center" direction="column">
            <Grid size="auto">
                <BodyText size="small">{checkIcon} Wide images (Landscape)</BodyText>
            </Grid>
            <Grid size="auto">
                <BodyText size="small">{checkIcon} Decorative subject matter</BodyText>
            </Grid>
            <Grid size="auto">
                <BodyText size="small">{checkIcon} Any subject of focus is on the right</BodyText>
            </Grid>
            <Grid size="auto">
                <BodyText size="small">{checkIcon} 2500px or more (width)</BodyText>
            </Grid>
        </Grid>
        <Grid container spacing={1} size={{ xs: 12, md: 6 }} justifyContent="center" direction="column">
            <Grid size="auto">
                <BodyText size="small">{xIcon} Tall images (Portrait)</BodyText>
            </Grid>
            <Grid size="auto">
                <BodyText size="small">{xIcon} Informative imagery, text or logos</BodyText>
            </Grid>
            <Grid size="auto">
                <BodyText size="small">{xIcon} Images with key elements on the left</BodyText>
            </Grid>
            <Grid size="auto">
                <BodyText size="small">{xIcon} Less than 1500px (width)</BodyText>
            </Grid>
        </Grid>
    </Grid>
);
