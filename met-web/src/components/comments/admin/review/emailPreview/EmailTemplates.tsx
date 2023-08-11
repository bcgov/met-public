import React from 'react';
import { MetBody } from 'components/common';
import { Grid } from '@mui/material';
import { When } from 'react-if';
import { StaffNote } from 'models/staffNote';

type RejectionEmailProps = {
    hasPersonalInfo?: boolean;
    hasProfanity?: boolean;
    hasThreat?: boolean;
    otherReason?: string;
    reviewNotes?: StaffNote[];
};

export const RejectEmailTemplate = ({
    hasPersonalInfo,
    hasProfanity,
    otherReason,
    reviewNotes,
}: RejectionEmailProps) => (
    <>
        <Grid item xs={12}>
            <MetBody sx={{ mb: 1 }}>
                We have reviewed your feedback and can’t accept it for the following reason(s):
            </MetBody>
        </Grid>
        <ul>
            <When condition={hasPersonalInfo}>
                <li>
                    <Grid item xs={12}>
                        <MetBody sx={{ mb: 1 }}>Your feedback contains personal information</MetBody>
                    </Grid>
                </li>
            </When>
            <When condition={hasProfanity}>
                <li>
                    <Grid item xs={12}>
                        <MetBody sx={{ mb: 1 }}>Your feedback contains profanity or inappropriate language</MetBody>
                    </Grid>
                </li>
            </When>
            <When condition={otherReason}>
                <li>
                    <Grid item xs={12}>
                        <MetBody sx={{ mb: 1 }}>{` Your feedback contains ${otherReason}.`}</MetBody>
                    </Grid>
                </li>
            </When>
        </ul>

        <When condition={!!reviewNotes}>
            <Grid item xs={12}>
                <MetBody sx={{ mb: 1 }}>{reviewNotes ? reviewNotes[0]?.note : ''}</MetBody>
            </Grid>
        </When>
    </>
);
