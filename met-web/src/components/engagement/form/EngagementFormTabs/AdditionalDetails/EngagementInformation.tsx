/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext } from 'react';
import { Grid, MenuItem, TextField, Select, SelectChangeEvent } from '@mui/material';
import { MetLabel, MetHeader4 } from 'components/common';
import { EngagementTabsContext } from '../EngagementTabsContext';
import { AppConfig } from 'config';

const EngagementInformation = () => {
    const { engagementFormData, setEngagementFormData } = useContext(EngagementTabsContext);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setEngagementFormData({
            ...engagementFormData,
            [e.target.name]: e.target.value,
        });
    };

    const handleChangeMetadata = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | SelectChangeEvent) => {
        setEngagementFormData({
            ...engagementFormData,
        });
    };

    return (
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
            <Grid item xs={12} mb={1}>
                <MetHeader4 bold>Engagement Metadata</MetHeader4>
            </Grid>
        </Grid>
    );
};

export default EngagementInformation;
