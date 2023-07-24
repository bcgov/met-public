import React, { useContext, useEffect, useState } from 'react';
import { Grid, Divider, FormGroup, FormControlLabel, Switch } from '@mui/material';
import { MetHeader4, MetBody, PrimaryButton } from 'components/common';
import { EngagementTabsContext } from '../EngagementTabsContext';
import { ActionContext } from '../../ActionContext';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';

const SendReport = () => {
    const { settings, settingsLoading, updateEngagementSettings, updatingSettings } = useContext(EngagementTabsContext);
    const { savedEngagement } = useContext(ActionContext);
    const [sendReport, setSendReport] = useState(Boolean(settings.send_report));

    const dispatch = useAppDispatch();

    useEffect(() => {
        setSendReport(Boolean(settings.send_report));
    }, [settings]);

    const handleUpdateSettings = async () => {
        updateEngagementSettings({
            send_report: sendReport,
        });
    };

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
                        label="Send report"
                    />
                </FormGroup>
            </Grid>
            <Grid item xs={12}>
                <PrimaryButton loading={updatingSettings} onClick={handleUpdateSettings}>
                    Save
                </PrimaryButton>
            </Grid>
            <Grid item xs={12}>
                <Divider sx={{ mt: '1em' }} />
            </Grid>
        </Grid>
    );
};

export default SendReport;
