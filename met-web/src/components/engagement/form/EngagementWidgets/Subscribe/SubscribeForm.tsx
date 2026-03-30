import React, { useContext } from 'react';
import { Grid2 as Grid, Divider } from '@mui/material';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { SubscribeContext } from './SubscribeContext';
import { SUBSCRIBE_TYPE } from 'models/subscription';
import { WidgetTitle } from '../WidgetTitle';
import { When } from 'react-if';
import SubscribeInfoBlock from './SubscribeInfoBlock';
import { BodyText } from 'components/common/Typography/Body';
import { Button } from 'components/common/Input/Button';

const Form = () => {
    const { setWidgetDrawerOpen } = useContext(WidgetDrawerContext);
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
        <Grid size={12} container alignItems="flex-start" justifyContent={'flex-start'} spacing={3}>
            <Grid size={12}>
                <WidgetTitle widget={widget} />
                <Divider sx={{ marginTop: '0.5em' }} />
            </Grid>
            <When condition={!subscribeFormExists}>
                <Grid size={12} container direction="row" spacing={1} justifyContent={'flex-start'}>
                    <Grid size={12}>
                        <BodyText>
                            The email list will collect email addresses for a mailing list. A "double-opt-in" email will
                            be sent to confirm the subscription. Only the email addresses that have been double-opted-in
                            will be on the list.
                        </BodyText>
                    </Grid>
                    <Grid size={12} marginBottom="1em">
                        <BodyText>
                            The form sign-up will open the pre-defined form. The text and CTA for both are customizable.
                        </BodyText>
                    </Grid>
                </Grid>
            </When>
            <Grid>
                <Button
                    size="small"
                    onClick={() => {
                        handleSubscribeDrawerOpen(SUBSCRIBE_TYPE.EMAIL_LIST, true);
                        setSubscribeOptionToEdit(emailListOption || null);
                    }}
                >
                    Email List
                </Button>
            </Grid>
            <Grid>
                <Button
                    size="small"
                    onClick={() => {
                        handleSubscribeDrawerOpen(SUBSCRIBE_TYPE.SIGN_UP, true);
                        setSubscribeOptionToEdit(signUpOption || null);
                    }}
                >
                    Form Sign-up
                </Button>
            </Grid>

            <When condition={subscribeFormExists}>
                <Grid size={12}>
                    <SubscribeInfoBlock />
                </Grid>
            </When>

            <Grid size={12} container direction="row" spacing={1} justifyContent={'flex-start'} marginTop="2em">
                <Grid>
                    <Button
                        variant="primary"
                        onClick={() => {
                            setWidgetDrawerOpen(false);
                        }}
                    >
                        Close
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Form;
