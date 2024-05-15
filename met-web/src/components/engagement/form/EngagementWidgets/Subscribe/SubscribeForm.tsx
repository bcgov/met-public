import React, { useContext } from 'react';
import { Grid, Divider } from '@mui/material';
import { PrimaryButtonOld, WidgetButton, MetParagraphOld } from 'components/common';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { SubscribeContext } from './SubscribeContext';
import { SUBSCRIBE_TYPE } from 'models/subscription';
import { WidgetTitle } from '../WidgetTitle';
import { When } from 'react-if';
import SubscribeInfoBlock from './SubscribeInfoBlock';

const Form = () => {
    const { handleWidgetDrawerOpen } = useContext(WidgetDrawerContext);
    const { handleSubscribeDrawerOpen, subscribeOptions, widget, setSubscribeOptionToEdit } =
        useContext(SubscribeContext);
    const subscribeFormExists = subscribeOptions.length > 0;

    const emailListOption = subscribeOptions.find(
        (subscribeOption) => subscribeOption.type === SUBSCRIBE_TYPE.EMAIL_LIST,
    );
    const signUpOption = subscribeOptions.find((subscribeOption) => subscribeOption.type === SUBSCRIBE_TYPE.SIGN_UP);

    if (!widget) {
        return null;
    }

    return (
        <Grid item xs={12} container alignItems="flex-start" justifyContent={'flex-start'} spacing={3}>
            <Grid item xs={12}>
                <WidgetTitle widget={widget} />
                <Divider sx={{ marginTop: '0.5em' }} />
            </Grid>
            <When condition={!subscribeFormExists}>
                <Grid item xs={12} container direction="row" spacing={1} justifyContent={'flex-start'}>
                    <Grid item xs={12}>
                        <MetParagraphOld>
                            The email list will collect email addresses for a mailing list. A "double-opt-in" email will
                            be sent to confirm the subscription. Only the email addresses that have been double-opted-in
                            will be on the list.
                        </MetParagraphOld>
                    </Grid>
                    <Grid item xs={12} marginBottom="1em">
                        <MetParagraphOld>
                            The form sign-up will open the pre-defined form. The text and CTA for both are customizable.
                        </MetParagraphOld>
                    </Grid>
                </Grid>
            </When>
            <Grid item>
                <WidgetButton
                    onClick={() => {
                        handleSubscribeDrawerOpen(SUBSCRIBE_TYPE.EMAIL_LIST, true);
                        setSubscribeOptionToEdit(emailListOption || null);
                    }}
                >
                    Email List
                </WidgetButton>
            </Grid>
            <Grid item>
                <WidgetButton
                    onClick={() => {
                        handleSubscribeDrawerOpen(SUBSCRIBE_TYPE.SIGN_UP, true);
                        setSubscribeOptionToEdit(signUpOption || null);
                    }}
                >
                    Form Sign-up
                </WidgetButton>
            </Grid>

            <When condition={subscribeFormExists}>
                <Grid item xs={12}>
                    <SubscribeInfoBlock />
                </Grid>
            </When>

            <Grid item xs={12} container direction="row" spacing={1} justifyContent={'flex-start'} marginTop="2em">
                <Grid item>
                    <PrimaryButtonOld
                        onClick={() => {
                            handleWidgetDrawerOpen(false);
                        }}
                    >
                        Close
                    </PrimaryButtonOld>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Form;
