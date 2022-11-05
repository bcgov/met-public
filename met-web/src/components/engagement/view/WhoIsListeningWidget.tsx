import React, { useContext } from 'react';
import { MetPaper, MetHeader2, MetHeader3, MetBody, MetSmallText } from 'components/common';
import { Grid, Avatar, Link, useMediaQuery, Theme } from '@mui/material';
import { ActionContext } from './ActionContext';

const WhoIsListeningWidget = () => {
    const { whoIsListeningWidget } = useContext(ActionContext);
    if (!whoIsListeningWidget || whoIsListeningWidget.contacts.length === 0) return <></>;

    return (
        <MetPaper elevation={1} sx={{ padding: '1em', minHeight: '12em' }}>
            <Grid item justifyContent="flex-start" alignItems="center" xs={12}>
                <MetHeader2 bold={true}>Who is Listening</MetHeader2>
            </Grid>
            {whoIsListeningWidget.contacts.map((contact) => {
                return (
                    <Grid key={contact.id} container item spacing={1} rowSpacing={1} xs={12} paddingTop={2}>
                        <Grid item justifyContent="center" display="flex" xs={12} sm={3} md={3} lg={12} xl={4}>
                            <Avatar alt={contact.name} sizes="lg" variant="square" sx={{ height: 100, width: 100 }} />
                        </Grid>
                        <Grid
                            container
                            item
                            alignItems="flex-start"
                            justifyContent="flex-start"
                            direction="row"
                            rowSpacing={1}
                            xs={12}
                            md={9}
                            sm={9}
                            lg={12}
                            xl={8}
                        >
                            <Grid item xs={12}>
                                <MetHeader3>
                                    <strong>{contact.name}</strong>
                                </MetHeader3>
                            </Grid>
                            <Grid item xs={12}>
                                <MetBody>{contact.title}</MetBody>
                            </Grid>
                            <Grid item xs={12} sx={{ whiteSpace: 'pre-line' }}>
                                <MetSmallText>{contact.bio}</MetSmallText>
                            </Grid>
                            <Grid item xs={12}>
                                <Link href={`mailto:${contact.email}`}>{contact.email}</Link>
                            </Grid>
                            <Grid item xs={12}>
                                Phone: <Link href={`tel:${contact.phone_number}`}>{contact.phone_number}</Link>
                            </Grid>
                        </Grid>
                    </Grid>
                );
            })}
        </MetPaper>
    );
};

export default WhoIsListeningWidget;
