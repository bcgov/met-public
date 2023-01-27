import React from 'react';
import { MetBody } from 'components/common';
import { Grid } from '@mui/material';
import { When } from 'react-if';

type RejectionEmailProps = {
    hasPersonalInfo: boolean;
    hasProfanity: boolean;
    hasThreat: boolean;
    hasOtherReason: boolean;
    otherReason: string;
};

export const RejectEmailTemplate = ({
    hasPersonalInfo,
    hasProfanity,
    hasThreat,
    hasOtherReason,
    otherReason,
}: RejectionEmailProps) => (
    <>
        <Grid item xs={12}>
            <MetBody sx={{ mb: 1 }}>
                We reviewed your comments and can't publish them on our public site for the following reason(s):
            </MetBody>
        </Grid>
        <When condition={hasPersonalInfo}>
            <Grid item xs={12}>
                <MetBody sx={{ mb: 1 }}>
                    One or many of your comments contain personal information such as name, address, or other
                    information that could identify you.
                </MetBody>
            </Grid>
        </When>
        <When condition={hasProfanity}>
            <Grid item xs={12}>
                <MetBody sx={{ mb: 1 }}>One or many of your comments contain swear words or profanities.</MetBody>
            </Grid>
        </When>
        <When condition={hasThreat}>
            <Grid item xs={12}>
                <MetBody sx={{ mb: 1 }}>One or many of your comments have threats.</MetBody>
            </Grid>
        </When>
        <When condition={otherReason}>
            <Grid item xs={12}>
                <MetBody
                    sx={{ mb: 1 }}
                >{`One or many of your comments can't be published because ${otherReason}.`}</MetBody>
            </Grid>
        </When>
        <Grid item xs={12}>
            <MetBody sx={{ mb: 1 }}>Thank you,</MetBody>
        </Grid>
        <Grid item xs={12}>
            <MetBody sx={{ mb: 1 }}>The EAO Team</MetBody>
        </Grid>
    </>
);
