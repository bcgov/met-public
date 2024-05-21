import React, { useEffect, useState, useContext } from 'react';
import { MetHeader2Old, MetPaper } from 'components/common';
import { ActionContext } from '../../ActionContext';
import { Divider, Grid, Skeleton } from '@mui/material';
import { useAppDispatch } from 'hooks';
import { Widget } from 'models/widget';
import { getSubscriptionsForms } from 'services/subscriptionService';
import { openNotification } from 'services/notificationService/notificationSlice';
import { SUBSCRIBE_TYPE, SubscribeForm } from 'models/subscription';
import { Case, Switch, Unless } from 'react-if';
import EmailListSection from './EmailListSection';
import EmailListModal from './EmailListModal';
import FormSignUpSection from './FormSignUpSection';

const SubscribeWidget = ({ widget }: { widget: Widget }) => {
    const dispatch = useAppDispatch();
    const { widgets } = useContext(ActionContext);
    const [open, setOpen] = useState(false);
    const [subscribeItems, setSubscribeItems] = useState<SubscribeForm[]>([]);
    const [isLoadingSubscribeItems, setIsLoadingSubscribeItems] = useState(true);

    const loadSubscribeItems = async () => {
        try {
            setIsLoadingSubscribeItems(true);
            const loadedSubscribe = await getSubscriptionsForms(widget.id);
            setSubscribeItems(loadedSubscribe);
            setIsLoadingSubscribeItems(false);
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'An error occurred while trying to load the Subscribe Items',
                }),
            );
        }
    };

    useEffect(() => {
        loadSubscribeItems();
    }, [widgets]);

    if (isLoadingSubscribeItems) {
        return (
            <MetPaper elevation={1} sx={{ padding: '1em', minHeight: '12em' }}>
                <Skeleton />
            </MetPaper>
        );
    }

    return (
        <>
            <MetPaper elevation={1} sx={{ padding: '1em', minHeight: '12em' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <MetHeader2Old bold>{widget.title}</MetHeader2Old>
                        <Divider sx={{ borderWidth: 1, marginTop: 0.5 }} />
                    </Grid>
                    {subscribeItems?.map((item, index) => {
                        return (
                            <>
                                <Switch>
                                    <Case condition={item.type == SUBSCRIBE_TYPE.EMAIL_LIST}>
                                        <EmailListSection subscribeOption={item} setOpen={setOpen} />
                                    </Case>
                                    <Case condition={item.type == SUBSCRIBE_TYPE.SIGN_UP}>
                                        <FormSignUpSection subscribeOption={item} widget={widget} />
                                    </Case>
                                </Switch>
                                <Unless condition={index == subscribeItems.length - 1}>
                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>
                                </Unless>
                            </>
                        );
                    })}
                </Grid>
            </MetPaper>
            <EmailListModal open={open} setOpen={setOpen} />
        </>
    );
};

export default SubscribeWidget;
