import React, { useContext, useState } from 'react';
import { Grid, TextField, Typography, Stack, Button } from '@mui/material';
import { CreateSurveyContext } from './CreateSurveyContext';
import { useNavigate } from 'react-router-dom';
import { hasKey } from 'utils';

export const CreateOptions = () => {
    const navigate = useNavigate();
    const { surveyForm, handleSurveyFormChange, handleTabValueChange } = useContext(CreateSurveyContext);
    const { name } = surveyForm;

    const initialFormError = {
        name: false,
    };
    const [formError, setFormError] = useState(initialFormError);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        handleSurveyFormChange({
            ...surveyForm,
            [e.target.name]: e.target.value,
        });

        if (hasKey(formError, e.target.name) && formError[e.target.name]) {
            setFormError({
                ...formError,
                [e.target.name]: false,
            });
        }
    };

    const validate = () => {
        setFormError({
            name: !surveyForm.name,
        });
        return Object.values(surveyForm).some((errorExists) => errorExists);
    };

    const handleSaveClick = () => {
        if (!validate()) {
            return;
        }

        handleTabValueChange(1);
    };

    return (
        <Grid container direction="row" alignItems="flex-start" justifyContent="flex-start" item xs={12} spacing={2}>
            <Grid item xs={6}>
                <Typography variant="h6" sx={{ marginBottom: '2px' }}>
                    Enter Survey Name
                </Typography>
                <TextField
                    id="survey-name"
                    size="small"
                    variant="outlined"
                    label=" "
                    InputLabelProps={{
                        shrink: false,
                    }}
                    fullWidth
                    name="name"
                    value={name}
                    onChange={handleChange}
                    error={formError.name}
                    helperText={formError.name ? 'Name must be specified' : ' '}
                />
            </Grid>
            <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                    <Button variant="contained" onClick={handleSaveClick}>
                        {'Save & Continue'}
                    </Button>
                    <Button variant="outlined" onClick={() => navigate('/survey/listing')}>
                        Cancel
                    </Button>
                </Stack>
            </Grid>
        </Grid>
    );
};
