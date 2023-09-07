import React, { useContext } from 'react';
import { Grid, Divider } from '@mui/material';
import { PrimaryButton, WidgetButton, MetParagraph } from 'components/common';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { SubscribeContext } from './SubscribeContext';
import { SUBSCRIBE_TYPE } from 'models/subscription';
import { WidgetTitle } from '../WidgetTitle';
import { When } from 'react-if';
import SubscribeInfoBlock from './SubscribeInfoBlock';

const Form = () => {
    const { handleWidgetDrawerOpen } = useContext(WidgetDrawerContext);
    const { handleSubscribeDrawerOpen, subscribe, widget } = useContext(SubscribeContext);
    const subscribeFormExists = subscribe.length > 0;

    if (!widget) {
        return null;
    }

    return (
        <Grid item xs={12} container alignItems="flex-start" justifyContent={'flex-start'} spacing={3}>
            <Grid item xs={12}>
                <WidgetTitle widget={widget} />
                <Divider sx={{ marginTop: '1em' }} />
            </Grid>
            <When condition={!subscribeFormExists}>
                <Grid item xs={12} container direction="row" spacing={1} justifyContent={'flex-start'}>
                    <Grid item xs={12}>
                        <MetParagraph>
                            The email list will collect email addresses for a mailing list. A "double-opt-in" email will
                            be sent to confirm the subscription. Only the email addresses that have been double-opted-in
                            will be on the list.
                        </MetParagraph>
                    </Grid>
                    <Grid item xs={12} marginBottom="1em">
                        <MetParagraph>
                            The form sign-up will open the pre-defined form. The text and CTA for both are customizable.
                        </MetParagraph>
                    </Grid>
                </Grid>
            </When>
            <Grid item>
                <WidgetButton onClick={() => handleSubscribeDrawerOpen(SUBSCRIBE_TYPE.EMAIL_LIST, true)}>
                    Email List
                </WidgetButton>
            </Grid>
            <Grid item>
                <WidgetButton onClick={() => handleSubscribeDrawerOpen(SUBSCRIBE_TYPE.FORM, true)}>
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
