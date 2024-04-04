import React, { useContext, useEffect, useState } from 'react';
import { Grid, FormGroup, FormControlLabel, Switch } from '@mui/material';
import { MetHeader4, MetDescription, MetLabel } from 'components/common';
import { EngagementTabsContext } from '../EngagementTabsContext';
import { ActionContext } from '../../ActionContext';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';

const SendReport = () => {
    const { settings, sendReport, setSendReport, settingsLoading } = useContext(EngagementTabsContext);
    const { savedEngagement } = useContext(ActionContext);
    const [initialSendReportFlag, setInitialSendReportFlag] = useState(settings.send_report);

    const dispatch = useAppDispatch();

    useEffect(() => {
        setInitialSendReportFlag(sendReport.send_report || settings.send_report);
    }, []);

    const handleSettingsChange = () => {
        setInitialSendReportFlag(!initialSendReportFlag);
        setSendReport({ send_report: !initialSendReportFlag });
    };

    return (
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
            <Grid item xs={12} mt={1}>
                <MetHeader4 bold>Send Report</MetHeader4>
            </Grid>
            <Grid item xs={12}>
                <MetDescription>
                    Toggle this option off if you do not want an email with a link to the report to be automatically
                    sent at the end of the engagement period.
                </MetDescription>
            </Grid>
            <Grid item xs={12}>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={initialSendReportFlag}
                                onChange={() => {
                                    if (!savedEngagement.id) {
                                        dispatch(
                                            openNotification({ text: 'Must save engagement first', severity: 'error' }),
                                        );
                                        return;
                                    }
                                    handleSettingsChange();
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
