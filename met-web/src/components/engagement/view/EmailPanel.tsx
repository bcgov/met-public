import React, { useState, useEffect } from 'react';
import {
    Grid,
    Typography,
    Checkbox,
    Button,
    TextField,
    FormControl,
    FormControlLabel,
    FormHelperText,
} from '@mui/material';
import { EmailPanelProps } from './types';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    boxShadow: 10,
    pt: 2,
    px: 4,
    pb: 3,
    height: 700,
};

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export default function EmailPanel(props: EmailPanelProps) {
    const [checked, setChecked] = useState(false);
    const [termsError, setTermsError] = useState(false);
    const [emailError, setEmailError] = useState(false);

    useEffect(() => {
        setTermsError(!checked);
    }, [checked]);

    useEffect(() => {
        if (props.email === '') {
            setEmailError(true);
        } else {
            setEmailError(false);
        }
    }, [props.email]);

    return (
        <Grid container direction="row" sx={{ ...style }} rowSpacing={1}>
            <Grid item xs={12}>
                <Typography id="modal-modal-title" variant="h4" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Verify your email address
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography id="modal-modal-header">
                    To provide you with the best experience possible. We require you to validate your email address.
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography>You will receive a link to access the survey at the email address you provide.</Typography>
            </Grid>

            <Grid item xs={12}>
                <Typography sx={{ mb: 2, fontWeight: 'bold' }}>Email address</Typography>
                <TextField
                    onChange={(e) => props.updateEmail(e.target.value)}
                    id="outlined-basic"
                    label="Outlined"
                    variant="outlined"
                    error={emailError}
                    helperText={'Please Enter an Email'}
                />
            </Grid>
            <Grid
                item
                container
                direction="row"
                width="100%"
                xs={12}
                alignItems="center"
                justifyContent="flex-start"
                rowSpacing={1}
            >
                <FormControl required error={termsError} component="fieldset" sx={{ m: 1 }} variant="standard">
                    <FormControlLabel
                        control={
                            <Checkbox
                                onChange={(event) => {
                                    setChecked(event.target.checked);
                                }}
                                {...label}
                                name="gilad"
                            />
                        }
                        label={<Typography>I agree to the Terms and Conditions below.</Typography>}
                    />
                    {termsError ? <FormHelperText>Please Accept the Terms and Conditions</FormHelperText> : <></>}
                </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ pt: 1, pb: 1, borderLeft: 8, borderColor: '#003366' }}>
                <Typography paragraph={true} id="modal-modal-description" sx={{ pl: 1 }}>
                    "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and
                    demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee
                    the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their
                    duty through weakness of will, which is the same as saying through shrinking from toil and pain.
                </Typography>
            </Grid>
            <Grid item container direction="row" justifyContent="flex-end" alignItems="flex-end" xs={12} rowSpacing={1}>
                <Button variant="outlined" onClick={props.handleClose} sx={{ m: 1 }}>
                    Cancel
                </Button>
                <Button
                    onClick={
                        !termsError && !emailError
                            ? () => props.checkEmail()
                            : () => {
                                  console.log('error');
                              }
                    }
                    variant={'contained'}
                    sx={{ m: 1 }}
                >
                    Submit
                </Button>
            </Grid>
        </Grid>
    );
}
