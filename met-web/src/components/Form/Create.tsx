import React from 'react';
import { selectError, FormBuilder } from '@formio/react';
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
                <FormBuilder form={{ display: 'form' }} options={formioOptions} />
            </Grid>
        </Grid>
    );
};

export default Create;
