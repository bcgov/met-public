import React, { useState } from 'react';
import {
    Grid,
    Typography,
    Checkbox,
    Button,
    TextField,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Stack,
} from '@mui/material';
import { EmailPanelProps } from './types';
import { MetLabel, modalStyle } from 'components/common';

const EmailPanel = ({ email, checkEmail, handleClose, updateEmail }: EmailPanelProps) => {
    const [checked, setChecked] = useState(false);
    const [emailFormError, setEmailFormError] = useState({
        terms: false,
        email: false,
    });

    const validateForm = () => {
        const errors = {
            terms: !checked,
            email: !email,
        };

        setEmailFormError(errors);

        return Object.values(errors).some((isError: unknown) => isError);
    };

    const handleSubmit = () => {
        const hasErrors = validateForm();

        if (!hasErrors) {
            checkEmail();
        }
    };

    return (
        <Grid
            container
            direction="row"
            sx={{ ...modalStyle }}
            alignItems="flex-start"
            justifyContent="flex-start"
            rowSpacing={2}
        >
            <Grid item xs={12}>
                <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Verify your email address
                </Typography>
            </Grid>

            <Grid item xs={12}>
                <Typography>
                    To provide you with the best experience possible. We require you to validate your email address.
                </Typography>
            </Grid>

            <Grid item xs={12}>
                <Typography>You will receive a link to access the survey at the email address you provide.</Typography>
            </Grid>

            <Grid item xs={12}>
                <Typography
                    variant="subtitle2"
                    sx={{ p: '1em', borderLeft: 8, borderColor: '#003366', backgroundColor: '#F2F2F2' }}
                >
                    "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and
                    demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee
                    the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their
                    duty through weakness of will, which is the same as saying through shrinking from toil and pain.
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
                            label="I agree to the terms and conditions below."
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

            <Grid item container xs={12} justifyContent="flex-end" spacing={1} sx={{ mt: '1em' }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} width="100%" justifyContent="flex-end">
                    <Button variant="outlined" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={() => handleSubmit()} variant={'contained'}>
                        Submit
                    </Button>
                </Stack>
            </Grid>
        </Grid>
    );
};

export default EmailPanel;
