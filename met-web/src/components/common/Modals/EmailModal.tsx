import React, { FormEvent, useState } from 'react';
import {
    Grid,
    Typography,
    Checkbox,
    TextField,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Stack,
    useMediaQuery,
    Theme,
} from '@mui/material';
import { MetLabel, modalStyle, PrimaryButton, SecondaryButton, MetHeader1, MetBody } from 'components/common';
import Modal from '@mui/material/Modal';
import { ModalProps } from 'components/engagement/view/types';

const EmailModal = ({ open, email, updateEmail, updateModal, header, subText, tos, handleConfirm }: ModalProps) => {
    const [checked, setChecked] = useState(false);
    const [emailFormError, setEmailFormError] = useState({
        terms: false,
        email: false,
    });
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const validateForm = () => {
        const errors = {
            terms: !checked,
            email: !email,
        };
        setEmailFormError(errors);
        return Object.values(errors).some((isError: unknown) => isError);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const hasErrors = validateForm();
        if (!hasErrors && handleConfirm) {
            handleConfirm();
        }
    };

    return (
        <Modal aria-labelledby="modal-title" open={open} onClose={() => updateModal(false)}>
            <form onSubmit={(e) => handleSubmit(e)}>
                <Grid
                    container
                    direction="row"
                    sx={{ ...modalStyle }}
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    rowSpacing={2}
                >
                    <Grid item xs={12}>
                        <MetHeader1 bold={true} sx={{ mb: 2 }}>
                            {header}
                        </MetHeader1>
                    </Grid>

                    {subText.map((text: string) => (
                        <Grid item xs={12}>
                            <MetBody>{text}</MetBody>
                        </Grid>
                    ))}

                    <Grid item xs={12}>
                        <Typography
                            sx={{
                                p: '1em',
                                borderLeft: 8,
                                borderColor: '#003366',
                                backgroundColor: '#F2F2F2',
                                mt: '2em',
                                fontSize: '0.8rem',
                            }}
                        >
                            {tos.map((text: string) => (
                                <Typography sx={{ mb: 1 }}>{text}</Typography>
                            ))}
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        container
                        direction="row"
                        width="100%"
                        xs={12}
                        alignItems="flex-start"
                        justifyContent="flex-start"
                        rowSpacing={1}
                    >
                        <Grid item xs={12}>
                            <FormControl required error={emailFormError.terms} component="fieldset" variant="standard">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            onChange={(event) => {
                                                setChecked(event.target.checked);
                                                setEmailFormError({ ...emailFormError, terms: false });
                                            }}
                                        />
                                    }
                                    label="I agree to the terms and conditions above."
                                />
                                <FormHelperText>
                                    {emailFormError.terms ? 'Please accept the terms and conditions' : ''}
                                </FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <MetLabel>Email Address</MetLabel>
                            <TextField
                                onChange={(e) => {
                                    updateEmail(e.target.value);
                                    setEmailFormError({ ...emailFormError, email: false });
                                }}
                                label=" "
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                variant="outlined"
                                error={emailFormError.email}
                                helperText={emailFormError.email ? 'Please enter an email' : ''}
                                fullWidth
                            />
                        </Grid>
                    </Grid>

                    <Grid
                        item
                        container
                        xs={12}
                        direction="row"
                        justifyContent="flex-end"
                        spacing={1}
                        sx={{ mt: '1em' }}
                    >
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={1}
                            width="100%"
                            justifyContent="flex-end"
                        >
                            {isSmallScreen ? (
                                <>
                                    <PrimaryButton type="submit" variant={'contained'}>
                                        Submit
                                    </PrimaryButton>
                                    <SecondaryButton onClick={() => updateModal(false)}>Cancel</SecondaryButton>
                                </>
                            ) : (
                                <>
                                    <SecondaryButton onClick={() => updateModal(false)}>Cancel</SecondaryButton>
                                    <PrimaryButton type="submit" variant={'contained'}>
                                        Submit
                                    </PrimaryButton>
                                </>
                            )}
                        </Stack>
                    </Grid>
                </Grid>
            </form>
        </Modal>
    );
};

export default EmailModal;
