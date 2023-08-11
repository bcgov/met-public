import { Box, Grid, Stack, Link } from '@mui/material';
import * as React from 'react';
import { MetBody } from 'components/common';
import { ReactComponent as BCLogo } from 'assets/images/BritishColumbiaLogoDark.svg';
import { Survey } from 'models/survey';
import { formatDate } from 'components/common/dateHelper';
import { useAppSelector } from 'hooks';
import { TenantState } from 'reduxSlices/tenantSlice';

export default function EmailPreview({
    survey,
    children,
    ...rest
}: {
    survey: Survey;
    children: React.ReactNode;
    [prop: string]: unknown;
}) {
    const scheduledDate = formatDate(survey.engagement?.scheduled_date || '', 'MMM DD YYYY');
    const tenant: TenantState = useAppSelector((state) => state.tenant);
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box style={container}>
                <Stack direction={'row'}>
                    <Box
                        component={BCLogo}
                        sx={{
                            height: '5em',
                            width: { xs: '4em', md: '5em' },
                            marginRight: { xs: '0.5em', md: '0.5em' },
                        }}
                        alt="British Columbia Logo"
                    />
                </Stack>
                <Grid item xs={12}>
                    <MetBody sx={{ mb: 1 }}>
                        Thank you for taking the time to provide your feedback on {survey.engagement?.name || ''}.
                    </MetBody>
                </Grid>
                {children}
                <Grid item xs={12}>
                    <MetBody sx={{ mb: 2 }}>
                        You can edit and re-submit your feedback. The comment period is open until {scheduledDate}. You
                        must re-submit your feedback before the comment period closes.
                    </MetBody>
                </Grid>
                <Grid item xs={12}>
                    <MetBody
                        sx={{
                            borderLeft: '4px solid grey',
                            paddingLeft: '8px',
                            color: '#555',
                            mb: 2,
                        }}
                    >
                        <Link>Edit your feedback</Link>
                    </MetBody>
                </Grid>
                <Grid item xs={12}>
                    <MetBody sx={{ mb: 1 }}>Thank you,</MetBody>
                </Grid>
                <Grid item xs={12}>
                    <MetBody sx={{ mb: 1 }}>The {tenant.name} Team</MetBody>
                </Grid>
            </Box>
        </Box>
    );
}

const container = {
    backgroundColor: '#ffffff',
    border: '1px solid #eee',
    borderRadius: '5px',
    boxShadow: '0 5px 10px rgba(20,50,70,.2)',
    width: '80%',
    padding: '30px 20px 40px',
};
