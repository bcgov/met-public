import React, { useContext, useState } from 'react';
import { Checkbox, FormControlLabel, FormGroup, Grid, Link, TextField } from '@mui/material';
import { MetDescription, MetLabel, MetParagraph, PrimaryButton } from 'components/common';
import { useAppDispatch, useAppTranslation } from 'hooks';
import { FormContext } from './FormContext';
import { TAB_TWO } from './constants';
import { openNotification } from 'services/notificationService/notificationSlice';

export const FirstTab = () => {
    const { t: translate } = useAppTranslation();
    const { setTabValue } = useContext(FormContext);
    const dispatch = useAppDispatch();

    const [detailsForm, setDetailsForm] = useState({
        firstName: '',
        lastName: '',
        city: '',
        emailAddress: '',
    });

    const { firstName, lastName, city, emailAddress } = detailsForm;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setDetailsForm({ ...detailsForm, [name]: value });
    };
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <MetDescription>Please tell us your</MetDescription>
            </Grid>
            <Grid item xs={12}>
                <MetLabel>First Name</MetLabel>
                <TextField
                    variant="outlined"
                    label=" "
                    InputLabelProps={{
                        shrink: false,
                    }}
                    fullWidth
                    name="firstName"
                    value={firstName}
                    onChange={handleChange}
                />
            </Grid>
        </Grid>
    );
};
