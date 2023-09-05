import React, { useContext, useState } from 'react';
import { Grid } from '@mui/material';
import { MetDescription, MetLabel, PrimaryButton } from 'components/common';
import { useAppDispatch } from 'hooks';
import { FormContext } from './FormContext';
import { openNotification } from 'services/notificationService/notificationSlice';
import * as yup from 'yup';
import ControlledTextField from 'components/common/ControlledInputComponents/ControlledTextField';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { submitCACForm } from 'services/FormCAC';
import { useNavigate } from 'react-router-dom';

const schema = yup
    .object({
        firstName: yup.string().required(),
        lastName: yup.string().required(),
        city: yup.string().required(),
        email: yup.string().email().required(),
    })
    .required();

type SecondCACTabForm = yup.TypeOf<typeof schema>;

export const FirstTab = () => {
    const { formSubmission, setFormSubmission, setSubmitting } = useContext(FormContext);
    const [submittingForm, setSubmittingForm] = useState(false);

    const methods = useForm<SecondCACTabForm>({
        resolver: yupResolver(schema),
        defaultValues: {
            firstName: '',
            lastName: '',
            city: '',
            email: '',
        },
    });

    const { handleSubmit } = methods;

    const onSubmit: SubmitHandler<SecondCACTabForm> = async (data: SecondCACTabForm) => {
        const { firstName, lastName, city, email } = await schema.validate(data);
        setSubmittingForm(true);
        setFormSubmission({
            ...formSubmission,
            firstName,
            lastName,
            city,
            email,
        });
        setSubmitting(true);
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <FormProvider {...methods}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <MetDescription>Please tell us your</MetDescription>
                        </Grid>
                        <Grid item xs={12}>
                            <MetLabel>First Name</MetLabel>
                            <ControlledTextField
                                variant="outlined"
                                label=" "
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                fullWidth
                                name="firstName"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <MetLabel>Last Name</MetLabel>
                            <ControlledTextField
                                variant="outlined"
                                label=" "
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                fullWidth
                                name="lastName"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <MetLabel>City</MetLabel>
                            <ControlledTextField
                                variant="outlined"
                                label=" "
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                fullWidth
                                name="city"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <MetLabel>Email</MetLabel>
                            <ControlledTextField
                                variant="outlined"
                                label=" "
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                fullWidth
                                name="email"
                            />
                        </Grid>
                    </Grid>
                </FormProvider>
            </Grid>

            <Grid item xs={12}>
                <MetDescription>
                    A select Community Advisory Committee will be formed if there is sufficient community interest and
                    if it would support the assessment. If formed, this committee would seek to represent the diversity
                    of the people who may be affected by a proposed project and would participate in additional
                    engagement and information seeking activities with the EAO. The EAO will ask interested members of
                    the public to apply for the select Community Advisory Committee at the time it is determined and is
                    necessary
                </MetDescription>
            </Grid>

            <Grid item xs={12}>
                <PrimaryButton loading={submittingForm} onClick={handleSubmit(onSubmit)}>
                    Submit
                </PrimaryButton>
            </Grid>
        </Grid>
    );
};
