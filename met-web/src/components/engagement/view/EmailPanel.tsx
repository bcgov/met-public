import React, { FormEvent, useState } from 'react';
import { Grid, Checkbox, TextField, FormControl, FormControlLabel, FormHelperText, Stack, Link } from '@mui/material';
import { EmailPanelProps } from './types';
import {
    MetLabel,
    modalStyle,
    PrimaryButton,
    SecondaryButton,
    MetHeader1,
    MetBody,
    MetDescription,
    MetDisclaimer,
} from 'components/common';
import { When } from 'react-if';
import { INTERNAL_EMAIL_DOMAIN } from 'constants/emailVerification';

const EmailPanel = ({ email, checkEmail, handleClose, updateEmail, isSaving, isInternal }: EmailPanelProps) => {
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

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isSaving) {
            return;
        }
        const hasErrors = validateForm();

        if (!hasErrors) {
            checkEmail();
        }
    };

    return (
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
                    <MetHeader1 bold sx={{ mb: 2 }}>
                        Verify your email address
                    </MetHeader1>
                </Grid>

                <Grid item xs={12}>
                    <MetBody>
                        To provide you with the best experience possible, we require you to validate your email address.
                    </MetBody>
                </Grid>

                <Grid item xs={12}>
                    <MetBody>
                        You will receive a link to provide your feedback at the email address you provide.
                    </MetBody>
                </Grid>

                <Grid item xs={12}>
                    <MetBody>
                        <strong>Why are we collecting your email?</strong> Email verification helps us to know you are
                        not a robot, and ensures we have your consent to collect your feedback. Your email address will
                        remain confidential, and will only be used to authenticate your participation in this public
                        comment period and (TBD).
                    </MetBody>
                </Grid>
                <Grid item xs={12}>
                    <MetDisclaimer>
                        {`
                            Personal information (your email address) is collected under Section 26(c) and 26(e) of the Freedom of Information\
                            and Protection of Privacy Act, for the purpose of providing content updates and future opportunities to participate.\
                            Your email is never shared with third parties.
                        `}
                        <br />
                        <br />
                        {
                            'If you have any questions about the collection, use and disclosure of your personal information,\
                            please contact the Director of Digital Services at '
                        }
                        <Link href="mailto:Sid.Tobias@gov.bc.ca">Sid.Tobias@gov.bc.ca</Link>
                    </MetDisclaimer>
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
                <When condition={isInternal}>
                    <Grid item xs={12}>
                        <MetDescription>
                            <strong>This is an Internal Engagement!</strong> You can only use a {INTERNAL_EMAIL_DOMAIN}{' '}
                            email address to answer this survey.
                        </MetDescription>
                    </Grid>
                </When>
                <Grid item container xs={12} direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: '1em' }}>
                    <Stack
                        direction={{ md: 'column-reverse', lg: 'row' }}
                        spacing={1}
                        width="100%"
                        justifyContent="flex-end"
                    >
                        <SecondaryButton onClick={handleClose} disabled={isSaving}>
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton type="submit" variant={'contained'} loading={isSaving}>
                            Submit
                        </PrimaryButton>
                    </Stack>
                </Grid>
            </Grid>
        </form>
    );
};

export default EmailPanel;
