import React, { useContext } from 'react';
import TabContext from '@mui/lab/TabContext/TabContext';
import TabPanel from '@mui/lab/TabPanel/TabPanel';
import { FormContext } from './FormContext';
import { FirstTab } from './FirstTab';
import { TAB_ONE, TAB_TWO } from './constants';
import { Grid, Skeleton, Step, StepLabel, Stepper } from '@mui/material';
import { SecondTab } from './SecondTab';
import { useAppTranslation } from 'hooks';

export const Tabs = () => {
    const { t: translate } = useAppTranslation();
    const { tabValue, loading } = useContext(FormContext);

    if (loading) {
        return <Skeleton variant="rectangular" height={400} />;
    }
    return (
        <TabContext value={String(tabValue)}>
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <Stepper alternativeLabel>
                        <Step active={tabValue === TAB_ONE}>
                            <StepLabel>{translate('formCAC.tabs.0')}</StepLabel>
                        </Step>
                        <Step active={tabValue === TAB_TWO}>
                            <StepLabel>{translate('formCAC.tabs.1')}</StepLabel>
                        </Step>
                    </Stepper>
                </Grid>
                <Grid container item xs={12} spacing={3}>
                    <TabPanel value={String(TAB_ONE)}>
                        <FirstTab />
                    </TabPanel>
                    <TabPanel value={String(TAB_TWO)}>
                        <SecondTab />
                    </TabPanel>
                </Grid>
            </Grid>
        </TabContext>
    );
};
