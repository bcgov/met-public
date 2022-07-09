import React, { useContext } from 'react';
import { Skeleton, Grid, Stack, Button } from '@mui/material';
import { ActionContext } from './ActionContext';
import FormSubmit from 'components/Form/FormSubmit';
import { useNavigate } from 'react-router-dom';

export const SurveyForm = () => {
    const navigate = useNavigate();
    const { isLoading, savedSurvey } = useContext(ActionContext);

    const handleChange = (form: unknown) => {
        console.log(form);
    };

    if (isLoading) {
        return <Skeleton variant="rectangular" height="50em" width="100%" />;
    }

    return (
        <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            spacing={1}
            padding={'2em 2em 1em 2em'}
        >
            <Grid item xs={12}>
                <FormSubmit savedForm={savedSurvey.form_json} handleFormChange={handleChange} />
            </Grid>
            <Grid item xs={12} container direction="row" justifyContent="flex-end">
                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" onClick={() => navigate('/')}>
                        Cancel
                    </Button>
                    <Button variant="contained">Submit Survey</Button>
                </Stack>
            </Grid>
        </Grid>
    );
};
