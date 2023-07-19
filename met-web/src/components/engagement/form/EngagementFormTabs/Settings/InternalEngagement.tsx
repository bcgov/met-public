import React, { useContext } from 'react';
import { Grid, FormControlLabel, Switch, Divider } from '@mui/material';
import { MetLabel, MetHeader4, MetBody } from '../../../../common';
import { EngagementTabsContext } from '../EngagementTabsContext';
import { INTERNAL_EMAIL_DOMAIN } from 'constants/emailVerification';

const InternalEngagement = () => {
    const { engagementFormData, setEngagementFormData } = useContext(EngagementTabsContext);
    const { is_internal } = engagementFormData;

    const handleChangeIsInternal = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEngagementFormData({
            ...engagementFormData,
            is_internal: e.target.checked,
        });
    };

    return (
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
            <Grid item xs={12}>
                <MetHeader4 bold>Internal Engagement</MetHeader4>
            </Grid>
            <Grid item xs={12}>
                <MetBody>
                    This will make the engagement only available to people requesting access from a{' '}
                    {INTERNAL_EMAIL_DOMAIN} email address and will not show on the engagement home page.
                </MetBody>
            </Grid>
            <Grid item xs={12}>
                <FormControlLabel
                    control={<Switch name="is_internal" checked={is_internal} onChange={handleChangeIsInternal} />}
                    label={<MetLabel>Set-up as Internal Engagement</MetLabel>}
                />
            </Grid>
            <Grid item xs={12}>
                <Divider sx={{ mt: '1em' }} />
            </Grid>
        </Grid>
    );
};

export default InternalEngagement;
