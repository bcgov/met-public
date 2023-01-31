import React from 'react';
import { MetBody } from 'components/common';
import { Grid, Link } from '@mui/material';
import { When } from 'react-if';
import { StaffNote } from 'models/staffNote';

type RejectionEmailProps = {
    hasPersonalInfo?: boolean;
    hasProfanity?: boolean;
    hasThreat?: boolean;
    hasOtherReason?: boolean;
    otherReason?: string;
    reviewNotes?: StaffNote[];
};

export const RejectEmailTemplate = ({
    hasPersonalInfo,
    hasProfanity,
    hasOtherReason,
    otherReason,
    reviewNotes,
}: RejectionEmailProps) => (
    <>
        <Grid item xs={12}>
            <MetBody sx={{ mb: 1 }}>
                We reviewed your comments and can't publish them on our public site for the following reason(s):
            </MetBody>
        </Grid>
        <ul>
            <When condition={hasPersonalInfo}>
                <li>
                    <Grid item xs={12}>
                        <MetBody sx={{ mb: 1 }}>
                            One or many of your comments contain personal information such as name, address, or other
                            information that could identify you.
                        </MetBody>
                    </Grid>
                </li>
            </When>
            <When condition={hasProfanity}>
                <li>
                    <Grid item xs={12}>
                        <MetBody sx={{ mb: 1 }}>
                            One or many of your comments contain swear words or profanities.
                        </MetBody>
                    </Grid>
                </li>
            </When>
            <When condition={otherReason}>
                <li>
                    <Grid item xs={12}>
                        <MetBody
                            sx={{ mb: 1 }}
                        >{`One or many of your comments can't be published because ${otherReason}.`}</MetBody>
                    </Grid>
                </li>
            </When>
        </ul>

        <When condition={!!reviewNotes}>
            <Grid item xs={12}>
                <MetBody sx={{ mb: 1 }}>{reviewNotes ? reviewNotes[0]?.note : ''}</MetBody>
            </Grid>
        </When>
        <Grid item xs={12}>
            <MetBody sx={{ mb: 1 }}>
                You can access and edit your answers <Link>here</Link>
            </MetBody>
        </Grid>
    </>
);
