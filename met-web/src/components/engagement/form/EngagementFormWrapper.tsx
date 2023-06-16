import React, { useContext } from 'react';
import { MetPageGridContainer, MidScreenLoader } from 'components/common';
import EngagementFormTabs from './EngagementFormTabs/';
import { ActionContext } from './ActionContext';
import { Grid } from '@mui/material';
import WidgetsBlock from './EngagementWidgets';

const EngagementFormWrapper = () => {
    const { loadingSavedEngagement, loadingAuthorization } = useContext(ActionContext);

    const loading = loadingSavedEngagement || loadingAuthorization;
    if (loading) {
        return <MidScreenLoader data-testid="loader" />;
    }

    return (
        <MetPageGridContainer container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
            <Grid item xs={12} lg={8}>
                <EngagementFormTabs />
            </Grid>
            <Grid item xs={12} lg={4}>
                <WidgetsBlock />
            </Grid>
        </MetPageGridContainer>
    );
};

export default EngagementFormWrapper;
