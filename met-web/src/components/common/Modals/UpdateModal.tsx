import React from 'react';
import { Grid2 as Grid } from '@mui/material';
import { modalStyle, colors } from 'components/common';
import { NotificationModalProps } from './types';
import { BodyText, Header1 } from '../Typography';
import { Button } from '../Input/Button';

const UpdateModal = ({ header, style = 'default', subText, handleClose }: NotificationModalProps) => {
    const palette = colors.button[style];
    return (
        <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="space-between"
            sx={{ ...modalStyle, borderColor: palette.shade }}
            rowSpacing={2}
        >
            <Grid container direction="row" size={{ xs: 12 }}>
                <Grid size={12}>
                    <Header1 weight="bold" sx={{ mb: 2 }}>
                        {header}
                    </Header1>
                </Grid>
            </Grid>
            <Grid container direction="row" size={{ xs: 12 }}>
                {subText.map((subtext) => (
                    <Grid size={12}>
                        <BodyText bold={subtext.bold} sx={{ mb: 1 }}>
                            {subtext.text}
                        </BodyText>
                    </Grid>
                ))}
                <Grid
                    container
                    direction={{ xs: 'column', sm: 'row' }}
                    size={{ xs: 12 }}
                    justifyContent="flex-end"
                    spacing={1}
                    sx={{ mt: '1em' }}
                >
                    <Button variant="primary" onClick={handleClose} sx={{ m: 1 }}>
                        Close
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default UpdateModal;
