import React, { useEffect, useState } from 'react';
import { colors, MetHeader3 } from 'components/common';
import { Grid, Avatar, Skeleton, useTheme, useMediaQuery, Theme } from '@mui/material';
import { Widget } from 'models/widget';
import { Contact } from 'models/contact';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { When } from 'react-if';
import { useLazyGetContactQuery } from 'apiManager/apiSlices/contacts';
import { Link } from 'components/common/Navigation';
import { BodyText } from 'components/common/Typography';
import { Palette } from 'styles/Theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone } from '@fortawesome/pro-regular-svg-icons';
import { fetchListeningWidget } from 'services/widgetService/ListeningService';
import { ListeningWidget } from 'models/listeningWidget';

interface WhoIsListeningWidgetProps {
    widget: Widget;
}
const WhoIsListeningWidget = ({ widget }: WhoIsListeningWidgetProps) => {
    const dispatch = useAppDispatch();
    const [getContactTrigger] = useLazyGetContactQuery();
    const theme = useTheme();
    const isDarkMode = 'dark' === theme.palette.mode;
    const isMediumViewportOrLarger = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    const isXLViewportOrLarger = useMediaQuery((theme: Theme) => theme.breakpoints.up('xl'));

    const [isLoading, setIsLoading] = useState(true);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [listeningWidget, setListeningWidget] = useState<ListeningWidget>();

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
                    text: 'Error occurred while fetching engagement widget information',
                }),
            );
        }
    };

    const getListeningWidget = async () => {
        try {
            const listeningWidget = await fetchListeningWidget(widget.id);
            setListeningWidget(listeningWidget);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while fetching Who Is Listening widget information',
                }),
            );
        }
    };

    useEffect(() => {
        fetchContacts();
        getListeningWidget();
    }, [widget]);

    // Define the styles
    const textColor = isDarkMode ? colors.surface.white : Palette.text.primary;

    const titleStyles = {
        fontWeight: 'lighter',
        fontSize: '1.5rem',
        color: textColor,
    };

    const descriptionTextStyles = {
        color: textColor,
        fontSize: '1rem',
    };

    const avatarStyles = {
        height: 100,
        width: 100,
        borderRadius: '50%',
        pl: '0',
        mb: isXLViewportOrLarger ? '0' : '1rem',
    };

    const contactNameStyles = {
        fontSize: '1rem',
        lineHeight: '1.75rem',
        fontWeight: 700,
        letterSpacing: '0.16px',
        textAlign: isMediumViewportOrLarger ? 'left' : 'center',
        color: textColor,
    };

    const contactTitleStyles = {
        fontSize: '0.875rem',
        lineHeight: '1rem',
        fontWeight: 400,
        letterSpacing: '0.14px',
        textAlign: isMediumViewportOrLarger ? 'left' : 'center',
        color: textColor,
    };

    const contactBioStyles = {
        textAlign: isMediumViewportOrLarger ? 'left' : 'center',
        color: textColor,
    };

    const contactEmailStyles = {
        color: textColor,
        fontSize: '0.875rem',
    };

    const contactPhoneNumberStyles = {
        color: textColor,
        fontSize: '0.875rem',
    };

    if (isLoading) {
        return (
            <Grid container justifyContent="flex-start" spacing={3} width="100%">
                <Grid item xs={12}>
                    <Skeleton>
                        <MetHeader3 style={{ color: isDarkMode ? colors.surface.white : Palette.text.primary }}>
                            Who is Listening
                        </MetHeader3>
                    </Skeleton>
                </Grid>
                <Grid item xs={12}>
                    <Skeleton variant="rectangular" height="10em" width="100%" />
                </Grid>
                <Grid item xs={12}>
                    <Skeleton variant="rectangular" height="10em" width="100%" />
                </Grid>
            </Grid>
        );
    }

    if (contacts.length === 0) {
        return null;
    }

    return (
        <Grid container direction="row" sx={{ mt: '4rem' }}>
            <Grid item justifyContent={{ xs: 'center', md: 'flex-start' }} sx={{ pb: '1rem !important' }} xs={12}>
                <MetHeader3 style={titleStyles}>{widget.title}</MetHeader3>
            </Grid>
            <When condition={Boolean(listeningWidget?.description)}>
                <Grid item xs={12} sx={{ whiteSpace: 'pre-line', pb: '1rem' }}>
                    <BodyText style={descriptionTextStyles}>{listeningWidget?.description}</BodyText>
                </Grid>
            </When>
            {contacts.map((contact) => {
                return (
                    <Grid key={contact.id} container item sx={{ margin: '2rem 0 1rem' }} columnSpacing={3} xs={12}>
                        <Grid
                            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pl: '0' }}
                            xs={12}
                            md="auto"
                        >
                            <Avatar
                                src={contact.avatar_url}
                                alt={contact.name}
                                sizes="lg"
                                variant="square"
                                sx={avatarStyles}
                            />
                        </Grid>
                        <Grid
                            item
                            container
                            justifyContent={{ xs: 'center', md: 'flex-start' }}
                            paddingLeft={{
                                xs: '0 !important',
                                md: '2rem !important',
                                lg: '0 !important',
                                xl: '2rem !important',
                            }}
                            alignItems="flex-start"
                            direction="row"
                            rowSpacing={1}
                            sm={12}
                            md={9}
                            lg={12}
                            xl={9}
                        >
                            <Grid justifyContent={{ xs: 'center', md: 'flex-start' }} item xs={12}>
                                <BodyText sx={contactNameStyles}>{contact.name}</BodyText>
                            </Grid>
                            <When condition={Boolean(contact.title)}>
                                <Grid justifyContent={{ xs: 'center', md: 'flex-start' }} xs={12}>
                                    <BodyText sx={contactTitleStyles}>{contact.title}</BodyText>
                                </Grid>
                            </When>
                            <When condition={Boolean(contact.bio)}>
                                <Grid
                                    item
                                    container
                                    justifyContent={{ xs: 'center', md: 'flex-start' }}
                                    xs={12}
                                    sx={{ whiteSpace: 'pre-line' }}
                                >
                                    <BodyText
                                        size="small"
                                        sx={contactBioStyles}
                                        maxWidth={{ xs: '34.375rem', md: '100%' }}
                                        aria-label="Contact biography:"
                                    >
                                        {contact.bio}
                                    </BodyText>
                                </Grid>
                            </When>
                            <Grid
                                item
                                container
                                justifyContent={{ xs: 'center', md: 'flex-start' }}
                                alignItems="center"
                                xs={12}
                            >
                                <FontAwesomeIcon
                                    style={{ fontSize: '1rem', marginRight: '0.5rem' }}
                                    icon={faEnvelope}
                                    aria-label="Email address:"
                                />{' '}
                                <Link style={contactEmailStyles} href={`mailto:${contact.email}`}>
                                    {' ' + contact.email}
                                </Link>
                            </Grid>
                            <When condition={Boolean(contact.phone_number)}>
                                <Grid
                                    item
                                    container
                                    justifyContent={{ xs: 'center', md: 'flex-start' }}
                                    alignItems="center"
                                    xs={12}
                                >
                                    <FontAwesomeIcon
                                        style={{ fontSize: '1rem', marginRight: '0.5rem' }}
                                        icon={faPhone}
                                        aria-label="Phone number:"
                                    />{' '}
                                    <Link style={contactPhoneNumberStyles} href={`tel:${contact.phone_number}`}>
                                        {' ' + contact.phone_number}
                                    </Link>
                                </Grid>
                            </When>
                        </Grid>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default WhoIsListeningWidget;
