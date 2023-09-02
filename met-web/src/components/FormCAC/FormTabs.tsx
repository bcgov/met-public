import React, { useContext } from 'react';
import TabContext from '@mui/lab/TabContext/TabContext';
import TabPanel from '@mui/lab/TabPanel/TabPanel';
import { FormContext } from './FormContext';
import { FirstTab } from './FirstTab';
import { TAB_ONE, TAB_TWO } from './constants';
import { MetPageGridContainer, MetPaper } from 'components/common';
import { Grid, Step, StepLabel, Stepper } from '@mui/material';

export const FormTabs = () => {
    const { tabValue } = useContext(FormContext);
    return (
        <MetPageGridContainer>
            <MetPaper sx={{ padding: '3em' }}>
                <TabContext value={String(tabValue)}>
                    <Grid container spacing={6}>
                        <Grid item xs={12}>
                            <Stepper alternativeLabel>
                                <Step active={tabValue === TAB_ONE}>
                                    <StepLabel>Information</StepLabel>
                                </Step>
                                <Step active={tabValue === TAB_TWO}>
                                    <StepLabel>You and Your Community</StepLabel>
                                </Step>
                            </Stepper>
                        </Grid>
                        <Grid container item xs={12} spacing={3}>
                            <TabPanel value={String(TAB_ONE)}>
                                <FirstTab />
                            </TabPanel>
                            <TabPanel value={String(TAB_TWO)}>Item Two</TabPanel>
                        </Grid>
                    </Grid>
                </TabContext>
            </MetPaper>
        </MetPageGridContainer>
    );
};
