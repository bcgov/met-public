import React, { FormEvent, useState } from 'react';
import {
    Grid,
    Checkbox,
    TextField,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Stack,
    useMediaQuery,
    Theme,
} from '@mui/material';
import {
    MetLabel,
    modalStyle,
    PrimaryButtonOld,
    SecondaryButtonOld,
    MetHeader1Old,
    MetBodyOld,
} from 'components/common';
import Modal from '@mui/material/Modal';
import { ModalProps } from './types';

/**
 * A modal component for collecting user email and agreement to terms.
 * It includes fields for email input, terms and conditions checkbox, and submit button.
 * @param {Object} props - The properties for the EmailModal component.
 * @param {boolean} props.open - Controls the visibility of the modal.
 * @param {string} props.email - The email address input by the user.
 * @param {Function} props.updateEmail - Function to update the email state.
 * @param {Function} props.updateModal - Function to update the modal visibility state.
 * @param {string} props.header - The main title of the modal.
 * @param {Array} props.subText - An array of objects containing text to display in the modal, with optional bold styling.
 * @param {JSX.Element} props.signupoptions - JSX element containing additional signup options.
 * @param {JSX.Element} props.termsOfService - JSX element containing the terms of service text.
 * @param {Function} props.handleConfirm - Function to call when the user confirms the action.
 * @param {boolean} props.isSaving - Indicates if the form is currently being submitted.
 * @returns {JSX.Element} A modal component with email input and terms agreement.
 * @example
 * <EmailModal
 *     open={true}
 *     email={email}
 *     updateEmail={setEmail}
 *     updateModal={setOpen}
 *     header="Sign Up"
 *     subText={[{ text: 'Please enter your email to sign up.', bold: false }]}
 *     signupoptions={<div>Additional signup options here</div>}
 *     termsOfService={<div>Terms of Service text here</div>}
 *     handleConfirm={() => console.log('Confirmed')}
 *     isSaving={false}
 * />
 */
const EmailModal = ({
    open,
    email,
    updateEmail,
    updateModal,
    header,
    subText,
    signupoptions,
    termsOfService,
    handleConfirm,
    isSaving,
}: ModalProps) => {
    const [checked, setChecked] = useState(false);
    const isSmallScreen: boolean = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
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
                    sx={{
                        ...modalStyle,
                        overflowY: 'scroll',
                    }}
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    rowSpacing={2}
                >
                    <Grid item xs={12}>
                        <MetHeader1Old bold sx={{ mb: 2 }}>
                            {header}
                        </MetHeader1Old>
                    </Grid>

                    {subText.map((subtext) => (
                        <Grid item xs={12}>
                            <MetBodyOld bold={subtext.bold}>{subtext.text}</MetBodyOld>
                        </Grid>
                    ))}

                    {signupoptions}

                    <Grid item xs={12}>
                        {termsOfService}
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
                            direction={{ md: 'column-reverse', lg: 'row' }}
                            spacing={1}
                            width="100%"
                            justifyContent="flex-end"
                        >
                            <SecondaryButtonOld sx={{ mb: isSmallScreen ? 2 : 0 }} onClick={() => updateModal(false)}>
                                Cancel
                            </SecondaryButtonOld>
                            <PrimaryButtonOld loading={isSaving} type="submit" variant={'contained'}>
                                Submit
                            </PrimaryButtonOld>
                        </Stack>
                    </Grid>
                </Grid>
            </form>
        </Modal>
    );
};

export default EmailModal;
