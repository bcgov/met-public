import React from 'react';
import { MetBodyOld } from 'components/common';
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
            <MetBodyOld sx={{ mb: 1 }}>
                We have reviewed your feedback and can’t accept it for the following reason(s):
            </MetBodyOld>
        </Grid>
        <ul>
            <When condition={hasPersonalInfo}>
                <li>
                    <Grid item xs={12}>
                        <MetBodyOld sx={{ mb: 1 }}>Your feedback contains personal information</MetBodyOld>
                    </Grid>
                </li>
            </When>
            <When condition={hasProfanity}>
                <li>
                    <Grid item xs={12}>
                        <MetBodyOld sx={{ mb: 1 }}>
                            Your feedback contains profanity or inappropriate language
                        </MetBodyOld>
                    </Grid>
                </li>
            </When>
            <When condition={otherReason}>
                <li>
                    <Grid item xs={12}>
                        <MetBodyOld sx={{ mb: 1 }}>{` Your feedback contains ${otherReason}.`}</MetBodyOld>
                    </Grid>
                </li>
            </When>
        </ul>

        <When condition={!!reviewNotes}>
            <Grid item xs={12}>
                <MetBodyOld sx={{ mb: 1 }}>{reviewNotes ? reviewNotes[0]?.note : ''}</MetBodyOld>
            </Grid>
        </When>
    </>
);
