import React, { useContext } from 'react';
import { Divider, Grid } from '@mui/material';
import { MetPaper, PrimaryButton } from 'components/common';
import ConsentMessage from './ConsentMessage';
import EngagementInformation from './EngagementInformation';

import { AdditionalDetailsContext } from './AdditionalDetailsContext';

const AdditionalTabContent = () => {
    const { handleSaveAdditional, updatingAdditional } = useContext(AdditionalDetailsContext);

    return (
        <MetPaper elevation={1}>
            <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                spacing={2}
                sx={{ padding: '2em' }}
            >
                <Grid item xs={12}>
                    <EngagementInformation />
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item xs={12}>
                    <ConsentMessage />
                </Grid>
                <Grid item xs={12}>
                    <PrimaryButton loading={updatingAdditional} onClick={handleSaveAdditional}>
                        Save
                    </PrimaryButton>
                </Grid>
            </Grid>
        </MetPaper>
    );
};

export default AdditionalTabContent;
