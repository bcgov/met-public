import React, { useContext, useEffect, useState } from 'react';
import { Grid, FormControlLabel, Switch } from '@mui/material';
import { MetLabel, MetHeader4, MetDescription } from '../../../../common';
import { INTERNAL_EMAIL_DOMAIN } from 'constants/emailVerification';
import { EngagementTabsContext } from '../EngagementTabsContext';
import { ActionContext } from '../../ActionContext';

const InternalEngagement = () => {
    const { savedEngagement } = useContext(ActionContext);
    const { hasBeenOpened, engagementFormData, setEngagementFormData } = useContext(EngagementTabsContext);
    const [initialInternalFlag, setInitialInternalFlag] = useState(savedEngagement.is_internal);

    useEffect(() => {
        setInitialInternalFlag(engagementFormData.is_internal);
    }, []);

    const handleChangeIsInternal = () => {
        setInitialInternalFlag(!initialInternalFlag);
        setEngagementFormData({
            ...engagementFormData,
            is_internal: !initialInternalFlag,
        });
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
                    control={
                        <Switch name="is_internal" checked={initialInternalFlag} onChange={handleChangeIsInternal} />
                    }
                    label={<MetLabel>Set-up as Internal Engagement</MetLabel>}
                    disabled={hasBeenOpened}
                />
            </Grid>
        </Grid>
    );
};

export default InternalEngagement;
