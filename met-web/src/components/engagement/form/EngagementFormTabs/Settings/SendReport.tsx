import React, { useContext, useEffect } from 'react';
import { Grid, FormGroup, FormControlLabel, Switch } from '@mui/material';
import { MetHeader4, MetDescription, MetLabel } from 'components/common';
import { EngagementTabsContext } from '../EngagementTabsContext';
import { ActionContext } from '../../ActionContext';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { EngagementSettingsContext } from './EngagementSettingsContext';

const SendReport = () => {
    const { settings, settingsLoading } = useContext(EngagementTabsContext);
    const { savedEngagement } = useContext(ActionContext);
    const { sendReport, setSendReport } = useContext(EngagementSettingsContext);

    const dispatch = useAppDispatch();

    useEffect(() => {
        setSendReport(Boolean(settings.send_report));
    }, [settings]);

    return (
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
            <Grid item xs={12} mt={1}>
                <MetHeader4 bold>Send Report</MetHeader4>
            </Grid>
            <Grid item xs={12}>
                <MetDescription>
                    Toggle this option off if you do not want an email with a link to the report to be automatically at
                    the end of the engagement period.
                </MetDescription>
            </Grid>
            <Grid item xs={12}>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={sendReport}
                                onChange={() => {
                                    if (!savedEngagement.id) {
                                        dispatch(
                                            openNotification({ text: 'Must save engagement first', severity: 'error' }),
                                        );
                                        return;
                                    }
                                    setSendReport(!sendReport);
                                }}
                                disabled={settingsLoading}
                            />
                        }
                        sx={{ fontWeight: 'bold' }}
                        label={<MetLabel>Send report</MetLabel>}
                    />
                </FormGroup>
            </Grid>
        </Grid>
    );
};

export default SendReport;
