import React, { useContext } from 'react';
import { Grid, Divider, FormControlLabel, Checkbox } from '@mui/material';
import { PrimaryButton, MetHeader3, WidgetButton, MetParagraph, MetLabel } from 'components/common';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { SubscribeContext } from './SubscribeContext';
import { Subscribe_TYPE } from 'models/subscription';

const Form = () => {
    const { handleWidgetDrawerOpen } = useContext(WidgetDrawerContext);
    const { handleSubscribeDrawerOpen } = useContext(SubscribeContext);

    return (
        <Grid item xs={12} container alignItems="flex-start" justifyContent={'flex-start'} spacing={3}>
            <Grid item xs={12}>
                <Grid container item>
                    <MetHeader3 bold sx={{ paddingRight: 1 }}>
                        Sign-up for updates
                    </MetHeader3>
                    <BorderColorIcon />
                </Grid>
                <Divider sx={{ marginTop: '1em' }} />
                <FormControlLabel control={<Checkbox />} label={<MetLabel>Hide title</MetLabel>} />
            </Grid>
            <Grid item xs={12} container direction="row" spacing={1} justifyContent={'flex-start'}>
                <Grid item xs={12}>
                    <MetParagraph>
                        The email list will collect email addresses for a mailing list. A "double-opt-in" email will be
                        sent to confirm the subscription.Only the email addresses that have been double-opted-in will be
                        on the list. Please include the unsubscribe link provided on the Email List screen in every
                        future communication. Unsubscribed email addresses will be removed from the list. Please
                        downloaded the list before each communication.
                    </MetParagraph>
                </Grid>
                <Grid item xs={12} marginBottom="1em">
                    <MetParagraph>
                        The form sign-up will open the pre-defined form. The text and CTA for both are customizable.
                    </MetParagraph>
                </Grid>
                <Grid item>
                    <WidgetButton onClick={() => handleSubscribeDrawerOpen(Subscribe_TYPE.EMAIL_LIST, true)}>
                        Email List
                    </WidgetButton>
                </Grid>
                <Grid item>
                    <WidgetButton onClick={() => handleSubscribeDrawerOpen(Subscribe_TYPE.FORM, true)}>
                        Form Sign-up
                    </WidgetButton>
                </Grid>
            </Grid>
            <Grid item xs={12} container direction="row" spacing={1} justifyContent={'flex-start'} marginTop="2em">
                <Grid item>
                    <PrimaryButton
                        onClick={() => {
                            handleWidgetDrawerOpen(false);
                        }}
                    >
                        Close
                    </PrimaryButton>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Form;
