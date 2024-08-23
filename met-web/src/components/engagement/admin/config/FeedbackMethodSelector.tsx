import React from 'react';
import { Grid, Checkbox, FormControlLabel } from '@mui/material';
import { SystemMessage } from 'components/common/Layout/SystemMessage';
import { EngagementConfigurationData } from './wizard';
import { useFormContext } from 'react-hook-form';

export const FeedbackMethodSelector = () => {
    const engagementForm = useFormContext<EngagementConfigurationData>();

    const { watch, setValue } = engagementForm;

    return (
        <Grid container spacing={1} direction="column">
            <Grid item>
                <SystemMessage status="warning">
                    Under construction - this setting currently has no effect
                </SystemMessage>
            </Grid>
            <Grid item>
                <FormControlLabel
                    control={<Checkbox checked={watch('feedback_methods').includes('survey')} />}
                    label="Survey"
                    onChange={(_, checked) => {
                        setValue(
                            'feedback_methods',
                            checked
                                ? [...watch('feedback_methods'), 'survey']
                                : watch('feedback_methods').filter((m) => m !== 'survey'),
                            { shouldDirty: true },
                        );
                    }}
                />
            </Grid>
            <Grid item>
                <FormControlLabel
                    control={<Checkbox checked={watch('feedback_methods').includes('3rd_party')} />}
                    label="Third-party"
                    onChange={(_, checked) => {
                        setValue(
                            'feedback_methods',
                            checked
                                ? [...watch('feedback_methods'), '3rd_party']
                                : watch('feedback_methods').filter((m) => m !== '3rd_party'),
                            { shouldDirty: true },
                        );
                    }}
                />
            </Grid>
        </Grid>
    );
};
