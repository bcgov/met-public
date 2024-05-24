import React from 'react';
import { Grid } from '@mui/material';
import { BodyText } from 'components/common/Typography';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/pro-regular-svg-icons';

const checkIcon = <FontAwesomeIcon icon={faCheck} style={{ marginRight: '8px', fontSize: '18px' }} />;
const xIcon = <FontAwesomeIcon icon={faXmark} style={{ marginRight: '8px', fontSize: '18px' }} />;

export const UploadGuidelines = () => (
    <Grid container spacing={2} direction="row" mb="0.5em">
        <Grid item container spacing={1} xs={12} md={6} justifyContent="center" direction="column">
            <Grid item xs component={BodyText} size="small">
                {checkIcon} Wide images (Landscape)
            </Grid>
            <Grid item xs component={BodyText} size="small">
                {checkIcon} Decorative subject matter
            </Grid>
            <Grid item xs component={BodyText} size="small">
                {checkIcon} Any subject of focus is on the right
            </Grid>
            <Grid item xs component={BodyText} size="small">
                {checkIcon} 2500px or more (width)
            </Grid>
        </Grid>
        <Grid item container spacing={1} xs={12} md={6} justifyContent="center" direction="column">
            <Grid item xs component={BodyText} size="small">
                {xIcon} Tall images (Portrait)
            </Grid>
            <Grid item xs component={BodyText} size="small">
                {xIcon} Informative imagery, text or logos
            </Grid>
            <Grid item xs component={BodyText} size="small">
                {xIcon} Images with key elements on the left
            </Grid>
            <Grid item xs component={BodyText} size="small">
                {xIcon} Less than 1500px (width)
            </Grid>
        </Grid>
    </Grid>
);
