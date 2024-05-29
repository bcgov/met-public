import React, { useEffect, useState } from 'react';
import { MetPaper, MetHeader2Old, MetHeader3, MetBodyOld, MetSmallTextOld } from 'components/common';
import { Grid, Avatar, Skeleton, useTheme, Divider } from '@mui/material';
import { Widget } from 'models/widget';
import { Contact } from 'models/contact';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { When } from 'react-if';
import { useLazyGetContactQuery } from 'apiManager/apiSlices/contacts';
import { Link } from 'components/common/Input/Link';

interface WhoIsListeningWidgetProps {
    widget: Widget;
}
const WhoIsListeningWidget = ({ widget }: WhoIsListeningWidgetProps) => {
    const dispatch = useAppDispatch();
    const [getContactTrigger] = useLazyGetContactQuery();
    const theme = useTheme();

    const [isLoading, setIsLoading] = useState(true);
    const [contacts, setContacts] = useState<Contact[]>([]);

    const fetchContacts = async () => {
        try {
            const contacts = await Promise.all(
                widget.items.map((widgetItem) => {
                    const contact = getContactTrigger(widgetItem.widget_data_id, true).unwrap();
                    return contact;
                }),
            );

            setContacts(contacts);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while fetching Engagement wdigets information',
                }),
            );
        }
    };

    useEffect(() => {
        fetchContacts();
    }, [widget]);

    if (isLoading) {
        return (
            <MetPaper elevation={1} sx={{ padding: '1em' }}>
                <Grid container justifyContent="flex-start" spacing={3}>
                    <Grid item xs={12}>
                        <MetHeader2Old>
                            <Skeleton variant="rectangular" />
                        </MetHeader2Old>
                    </Grid>
                    <Grid item xs={12}>
                        <Skeleton variant="rectangular" height="10em" />
                    </Grid>
                    <Grid item xs={12}>
                        <Skeleton variant="rectangular" height="10em" />
                    </Grid>
                </Grid>
            </MetPaper>
        );
    }

    if (contacts.length === 0) {
        return null;
    }

    return (
        <MetPaper elevation={1} sx={{ padding: '1em', minHeight: '12em' }}>
            <Grid item justifyContent={{ xs: 'center', md: 'flex-start' }} xs={12}>
                <MetHeader2Old bold>{widget.title}</MetHeader2Old>
                <Divider sx={{ borderWidth: 1, marginTop: 0.5 }} />
            </Grid>
            {contacts.map((contact) => {
                return (
                    <Grid key={contact.id} container item columnSpacing={3} rowSpacing={1} xs={12} paddingTop={2}>
                        <Grid item container justifyContent={{ xs: 'center', md: 'flex-start' }} xs={12} md="auto">
                            <Avatar
                                src={contact.avatar_url}
                                alt={contact.name}
                                sizes="lg"
                                variant="square"
                                sx={{ height: 100, width: 100 }}
                            />
                        </Grid>
                        <Grid
                            item
                            container
                            justifyContent={{ xs: 'center', md: 'flex-start' }}
                            alignItems="flex-start"
                            direction="row"
                            rowSpacing={1}
                            sm={12}
                            md={9}
                            lg={12}
                            xl={9}
                        >
                            <Grid item container justifyContent={{ xs: 'center', md: 'flex-start' }} xs={12}>
                                <MetHeader3 bold>{contact.name}</MetHeader3>
                            </Grid>
                            <When condition={Boolean(contact.title)}>
                                <Grid container justifyContent={{ xs: 'center', md: 'flex-start' }} item xs={12}>
                                    <MetBodyOld>{contact.title}</MetBodyOld>
                                </Grid>
                            </When>
                            <When condition={Boolean(contact.bio)}>
                                <Grid
                                    container
                                    justifyContent={{ xs: 'center', md: 'flex-start' }}
                                    item
                                    xs={12}
                                    sx={{ whiteSpace: 'pre-line' }}
                                >
                                    <MetSmallTextOld
                                        sx={{
                                            textAlign: 'left',
                                            [theme.breakpoints.down('md')]: {
                                                textAlign: 'center',
                                            },
                                        }}
                                    >
                                        {contact.bio}
                                    </MetSmallTextOld>
                                </Grid>
                            </When>
                            <Grid container justifyContent={{ xs: 'center', md: 'flex-start' }} item xs={12}>
                                <MetBodyOld bold sx={{ mr: 1 }}>
                                    Email:{' '}
                                </MetBodyOld>
                                <Link href={`mailto:${contact.email}`}>{' ' + contact.email}</Link>
                            </Grid>
                            <When condition={Boolean(contact.phone_number)}>
                                <Grid container justifyContent={{ xs: 'center', md: 'flex-start' }} item xs={12}>
                                    <MetBodyOld bold sx={{ mr: 1 }}>
                                        Phone:{' '}
                                    </MetBodyOld>
                                    <Link href={`tel:${contact.phone_number}`}>{' ' + contact.phone_number}</Link>
                                </Grid>
                            </When>
                        </Grid>
                    </Grid>
                );
            })}
        </MetPaper>
    );
};

export default WhoIsListeningWidget;
