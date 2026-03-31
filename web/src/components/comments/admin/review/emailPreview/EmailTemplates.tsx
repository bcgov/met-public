import React from 'react';
import { BodyText } from 'components/common/Typography/Body';
import { Grid2 as Grid } from '@mui/material';
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
        <Grid size={12}>
            <BodyText sx={{ mb: 1 }}>
                We have reviewed your feedback and can’t accept it for the following reason(s):
            </BodyText>
        </Grid>
        <ul>
            <When condition={hasPersonalInfo}>
                <li>
                    <Grid size={12}>
                        <BodyText sx={{ mb: 1 }}>Your feedback contains personal information</BodyText>
                    </Grid>
                </li>
            </When>
            <When condition={hasProfanity}>
                <li>
                    <Grid size={12}>
                        <BodyText sx={{ mb: 1 }}>Your feedback contains profanity or inappropriate language</BodyText>
                    </Grid>
                </li>
            </When>
            <When condition={otherReason}>
                <li>
                    <Grid size={12}>
                        <BodyText sx={{ mb: 1 }}>{` Your feedback contains ${otherReason}.`}</BodyText>
                    </Grid>
                </li>
            </When>
        </ul>

        <When condition={!!reviewNotes}>
            <Grid size={12}>
                <BodyText sx={{ mb: 1 }}>{reviewNotes ? reviewNotes[0]?.note : ''}</BodyText>
            </Grid>
        </When>
    </>
);
