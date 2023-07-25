import React, { useContext } from 'react';
import { Grid, FormControlLabel, Switch } from '@mui/material';
import { MetLabel, MetHeader4, MetDescription } from '../../../../common';
import { INTERNAL_EMAIL_DOMAIN } from 'constants/emailVerification';
import { EngagementSettingsContext } from './EngagementSettingsContext';

const InternalEngagement = () => {
    const { isInternal, setIsInternal } = useContext(EngagementSettingsContext);

    const handleChangeIsInternal = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsInternal(e.target.checked);
    };

    return (
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
            <Grid item xs={12}>
                <MetHeader4 bold>Internal Engagement</MetHeader4>
            </Grid>
            <Grid item xs={12}>
                <MetDescription>
                    This will make the engagement only available to people requesting access from a{' '}
                    {INTERNAL_EMAIL_DOMAIN} email address and will not show on the engagement home page.
                </MetDescription>
            </Grid>
            <Grid item xs={12}>
                <FormControlLabel
                    control={<Switch name="is_internal" checked={isInternal} onChange={handleChangeIsInternal} />}
                    label={<MetLabel>Set-up as Internal Engagement</MetLabel>}
                />
            </Grid>
        </Grid>
    );
};

export default InternalEngagement;
