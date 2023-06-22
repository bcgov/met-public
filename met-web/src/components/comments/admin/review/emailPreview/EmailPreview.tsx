import { Box, Grid, Stack } from '@mui/material';
import * as React from 'react';
import { MetHeader4, MetBody } from 'components/common';
import { ReactComponent as BCLogo } from 'assets/images/BritishColumbiaLogoDark.svg';
import { Survey } from 'models/survey';
import { formatDate } from 'components/common/dateHelper';

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
                    <MetHeader4 bold sx={{ mb: 1 }}>
                        Thank you for taking the time to fill in our survey about {survey.name}.
                    </MetHeader4>
                </Grid>
                {children}
                <Grid item xs={12}>
                    <MetHeader4 bold sx={{ mb: 1 }}>
                        The engagement period is open until {scheduledDate}.
                    </MetHeader4>
                </Grid>
                <Grid item xs={12}>
                    <MetBody sx={{ mb: 1 }}>Thank you,</MetBody>
                </Grid>
                <Grid item xs={12}>
                    <MetBody sx={{ mb: 1 }}>The EAO Team</MetBody>
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
