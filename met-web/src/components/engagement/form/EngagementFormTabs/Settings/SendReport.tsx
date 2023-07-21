import React, { useContext, useEffect, useState } from 'react';
import { Grid, Divider, FormGroup, FormControlLabel, Switch } from '@mui/material';
import { MetHeader4, MetBody } from 'components/common';
import { EngagementTabsContext } from '../EngagementTabsContext';

const SendReport = () => {
    const { settings, settingsLoading, loadSettings } = useContext(EngagementTabsContext);
    const [sendReport, setSendReport] = useState(Boolean(settings?.send_report));

    useEffect(() => {
        if (!settings) {
            loadSettings();
        } else {
            setSendReport(settings.send_report);
        }
    }, [settings]);

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
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={sendReport}
                                onChange={() => {
                                    setSendReport(!sendReport);
                                }}
                                disabled={settingsLoading}
                            />
                        }
                        label="Send report"
                    />
                </FormGroup>
            </Grid>
            <Grid item xs={12}>
                <Divider sx={{ mt: '1em' }} />
            </Grid>
        </Grid>
    );
};

export default SendReport;
