import React from 'react';
import { selectError, FormEdit } from '@formio/react';
import { useSelector } from 'react-redux';
import { Grid, Typography } from '@mui/material';
import { formioOptions } from './FormBuilderOptions';
import './formio.css';

const Create = () => {
    const errors = useSelector((state) => selectError('form', state));
    const handleSaveForm = (form: unknown) => {
        console.log(form);
    };
    return (
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h4">Create Form</Typography>
            </Grid>
            <Grid item xs={12}>
                <FormEdit
                    form={{ display: 'form' }}
                    saveText={'Create Form'}
                    errors={errors}
                    options={formioOptions}
                    saveForm={handleSaveForm}
                />
            </Grid>
        </Grid>
    );
};

export default Create;
