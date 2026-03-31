import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldKeyhole } from '@fortawesome/pro-regular-svg-icons';
import { Grid2 as Grid } from '@mui/material';
import { ResponsiveContainer } from 'components/common/Layout';
import { BodyText, Heading1 } from 'components/common/Typography';
import React from 'react';

const NoAccess = () => {
    return (
        <ResponsiveContainer>
            <Grid container size={12} alignItems="center" spacing={1} justifyContent="flex-start">
                <Grid
                    container
                    mt={{ xs: 10, md: 15, lg: 18 }}
                    mb={{ xs: 10, md: 15, lg: 18 }}
                    size={{ xs: 12, sm: 10, md: 8, xl: 6 }}
                    alignContent="center"
                    justifyContent={'center'}
                >
                    <Grid
                        container
                        direction="column"
                        spacing={2}
                        size={{ xs: 12, sm: 10, xl: 8 }}
                        justifyContent="flex-start"
                    >
                        <Heading1 bold sx={{ mb: 1 }}>
                            <FontAwesomeIcon icon={faShieldKeyhole} /> Access Requested
                        </Heading1>
                        <BodyText>
                            Your IDIR login was successful and an email has been sent to our administrators to request
                            that you be granted access. Once your request is processed, you'll get a notification email
                            to confirm you can now access the platform with your credentials.
                        </BodyText>
                        <BodyText>
                            If you think you are seeing this message mistakenly, try reloading the page or contact your
                            administrator for assistance.
                        </BodyText>
                        <BodyText>Thank you.</BodyText>
                    </Grid>
                </Grid>
            </Grid>
        </ResponsiveContainer>
    );
};

export default NoAccess;
