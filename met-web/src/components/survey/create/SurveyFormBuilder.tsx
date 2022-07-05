import React, { useContext } from 'react';
import { Grid, Stack, Button, Typography, Divider } from '@mui/material';
import { CreateSurveyContext } from './CreateSurveyContext';
import { useNavigate } from 'react-router-dom';
import FormBuilder from 'components/Form/Create';
import ClearIcon from '@mui/icons-material/Clear';

const SurveyFormBuilder = () => {
    const navigate = useNavigate();
    const { surveyForm } = useContext(CreateSurveyContext);
    const { name } = surveyForm;

    const handleSaveForm = (form: unknown) => {
        console.log(form);
    };

    return (
        <Grid container direction="row" alignItems="flex-start" justifyContent="flex-start" item xs={12} spacing={2}>
            <Grid item xs={12}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{name}</Typography>
                    <ClearIcon />
                </Stack>
                <Divider />
            </Grid>
            <Grid item xs={12}>
                <FormBuilder handleSaveForm={handleSaveForm} />
            </Grid>
            <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                    <Button variant="contained">{'Save & Continue'}</Button>
                    <Button variant="outlined">Cancel</Button>
                </Stack>
            </Grid>
        </Grid>
    );
};

export default SurveyFormBuilder;
