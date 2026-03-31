import React, { useContext } from 'react';
import { MidScreenLoader } from 'components/common';
import { ResponsiveContainer } from 'components/common/Layout';
import { ActionContext } from './ActionContext';
import { Grid2 as Grid } from '@mui/material';
import WidgetsBlock from './EngagementWidgets';

const EngagementFormWrapper = () => {
    const { loadingAuthorization, savedEngagement } = useContext(ActionContext);

    const loading = loadingAuthorization;
    if (loading || !savedEngagement) {
        return <MidScreenLoader data-testid="loader" />;
    }

    return (
        <ResponsiveContainer container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
            <Grid size={{ xs: 12, lg: 4 }}>
                <WidgetsBlock />
            </Grid>
        </ResponsiveContainer>
    );
};

export default EngagementFormWrapper;
