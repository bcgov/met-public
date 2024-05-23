import React from 'react';
import { Grid, Stack } from '@mui/material';
import { colors, modalStyle } from 'components/common';
import { Button } from '../Input';
import { Header2, BodyText } from '../Typography';
import { NotificationModalProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheckCircle,
    faExclamationCircle,
    faExclamationTriangle,
    faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';

const ConfirmModal = ({
    style = 'default',
    header,
    subHeader,
    subText,
    handleConfirm,
    handleClose,
    confirmButtonText = 'Confirm',
    cancelButtonText = 'Cancel',
}: NotificationModalProps) => {
    const palette = colors.notification[style];
    const iconMap = {
        default: faInfoCircle,
        danger: faExclamationCircle,
        warning: faExclamationTriangle,
        success: faCheckCircle,
    };
    return (
        <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            sx={{ ...modalStyle, borderColor: palette.shade }}
        >
            <Grid item xs={1} sx={{ pt: 1.25, fontSize: '16px' }}>
                <FontAwesomeIcon icon={iconMap[style]} color={palette.icon} size="2x" />
            </Grid>
            <Grid
                item
                xs={11}
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="space-between"
                rowSpacing={1}
            >
                <Grid container direction="row" item xs={12}>
                    <Grid xs={12}>
                        <Header2 sx={{ mb: 0 }}>{header}</Header2>
                    </Grid>
                </Grid>
                {subHeader && (
                    <Grid container direction="row" item xs={12}>
                        <BodyText bold>{subHeader}</BodyText>
                    </Grid>
                )}
                <Grid container direction="row" item xs={12} sx={{ mt: '1em' }}>
                    {subText.map((subtext, index) => (
                        <Grid key={index} item xs={12}>
                            <BodyText bold={subtext.bold} sx={{ mb: 1 }}>
                                {subtext.text}
                            </BodyText>
                        </Grid>
                    ))}
                    <Grid
                        item
                        container
                        direction={{ xs: 'column', sm: 'row' }}
                        xs={12}
                        justifyContent="flex-end"
                        spacing={1}
                        sx={{ mt: '1em' }}
                    >
                        <Stack direction="row" spacing={1} width="100%" justifyContent="flex-end">
                            <Button variant="secondary" onClick={handleClose}>
                                {cancelButtonText}
                            </Button>
                            <Button variant="primary" color={style} onClick={handleConfirm} type="submit">
                                {confirmButtonText}
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ConfirmModal;
