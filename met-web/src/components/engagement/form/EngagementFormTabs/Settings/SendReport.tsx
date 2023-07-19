import React from 'react';
import { Grid, Divider } from '@mui/material';
import { MetHeader4, MetBody } from '../../../../common';

const SendReport = () => {
    return (
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
            <Grid item xs={12} mt={1}>
                <MetHeader4 bold>Send Report</MetHeader4>
            </Grid>
            <Grid item xs={12}>
                <MetBody>
                    Toggle this option off if you do not want an email with a link to the report to be automatically at
                    the end of the engagement period.
                </MetBody>
            </Grid>
            <Grid item xs={12}>
                <Divider sx={{ mt: '1em' }} />
            </Grid>
        </Grid>
    );
};

export default SendReport;
