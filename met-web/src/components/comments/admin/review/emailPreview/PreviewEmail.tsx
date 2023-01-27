import { Box, Grid, Stack } from '@mui/material';
import * as React from 'react';
import { MetBody, MetHeader4 } from 'components/common';
import { ModalSubtext } from 'components/common/Modals/types';
import { ReactComponent as BCLogo } from 'assets/images/BritishColumbiaLogoLight.svg';

interface PreviewEmailProps {
    header: string;
    emailText: Array<ModalSubtext>;
}

export default function PreviewEmail({ header, emailText }: PreviewEmailProps) {
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
                <MetHeader4 sx={{ mb: 2 }}>{header}</MetHeader4>
                {emailText.map((emailText: ModalSubtext) => (
                    <Grid item xs={12}>
                        <MetBody bold={emailText.bold} sx={{ mb: 1 }}>
                            {emailText.text}
                        </MetBody>
                    </Grid>
                ))}
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
