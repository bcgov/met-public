import React from 'react';
import Box from '@mui/material/Box';
import { Palette } from 'styles/Theme';

const EnvironmentBanner = () => {
    const host = window.location.hostname;
    const isTestEnvironment =
        host.startsWith('met-web-dev') || host.startsWith('met-web-test') || host.startsWith('met-web-demo') || host.startsWith('localhost');
    if (!isTestEnvironment) {
        return <></>;
    }
    return (
        <Box sx={{ backgroundColor: Palette.secondary.main, color: Palette.text.primary }} textAlign="center">
            You are using a non-production environment (<strong>{host}</strong>)
        </Box>
    );
};

export default EnvironmentBanner;
