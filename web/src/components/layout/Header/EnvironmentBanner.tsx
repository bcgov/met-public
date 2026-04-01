import React from 'react';
import Grid from '@mui/material/Grid2';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { BodyText } from 'components/common/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const EnvironmentBanner = () => {
    const host = window.location.hostname;
    // TODO: Replace this when implementing DEP-242
    const isTestEnvironment =
        host.startsWith('dep-web-dev') ||
        host.startsWith('dep-web-test') ||
        host.startsWith('dep-web-demo') ||
        host.startsWith('localhost');
    if (!isTestEnvironment) {
        return <></>;
    }
    return (
        <Grid
            container
            direction="row"
            gap={2}
            padding={{ xs: '0 1em 0', md: '0 5vw 0', lg: '0 10em 0' }}
            color={(theme) => theme.palette.warning.contrastText}
            height="50px"
            bgcolor="gold.10"
            borderBottom="4px solid"
            borderColor="warning.main"
            textAlign="left"
            alignItems="center"
            lineHeight="28px"
        >
            <BodyText component="span" fontSize="22px" color="warning.dark">
                <FontAwesomeIcon icon={faExclamationTriangle} />
            </BodyText>
            <BodyText component="span">You are using a test environment.</BodyText>
        </Grid>
    );
};

export default EnvironmentBanner;
