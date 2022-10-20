import React from 'react';
import { MetLabel, MetParagraph, MetWidgetPaper } from 'components/common';
import { Grid } from '@mui/material';
import { Contact } from 'models/contact';

interface ContantInfoPaperProps {
    testId?: string;
    contact: Contact;
}

const ContantInfoPaper = ({ testId, contact, ...rest }: ContantInfoPaperProps) => {
    return (
        <MetWidgetPaper elevation={3} {...rest}>
            <Grid container direction="row" alignItems={'flex-start'} justifyContent="flex-start">
                <Grid item xs={2} container direction="row" alignItems={'flex-start'} justifyContent="flex-start">
                    <Grid item xs={12}>
                        <MetLabel>{contact.name}</MetLabel>
                    </Grid>
                    <Grid item xs={12}>
                        <MetParagraph>{contact.title}</MetParagraph>
                    </Grid>
                </Grid>
                <Grid
                    item
                    xs={10}
                    container
                    direction="row"
                    alignItems={'flex-start'}
                    justifyContent="flex-start"
                    spacing={2}
                >
                    <Grid item xs={2}>
                        <MetParagraph>Phone:</MetParagraph>
                    </Grid>
                    <Grid item xs={10}>
                        <MetParagraph>{contact.phone_number}</MetParagraph>
                    </Grid>

                    <Grid item xs={2}>
                        <MetParagraph>Email:</MetParagraph>
                    </Grid>
                    <Grid item xs={10}>
                        <MetParagraph>{contact.email}</MetParagraph>
                    </Grid>

                    <Grid item xs={2}>
                        <MetParagraph>Address:</MetParagraph>
                    </Grid>
                    <Grid item xs={10}>
                        <MetParagraph>{contact.address}</MetParagraph>
                    </Grid>

                    <Grid item xs={2}>
                        <MetParagraph>Bio:</MetParagraph>
                    </Grid>
                    <Grid item xs={10}>
                        <MetParagraph width={'100%'} overflow="hidden" textOverflow={'ellipsis'} whiteSpace="nowrap">
                            {contact.bio}
                        </MetParagraph>
                    </Grid>
                </Grid>
            </Grid>
        </MetWidgetPaper>
    );
};

export default ContantInfoPaper;
