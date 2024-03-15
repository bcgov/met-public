import React, { useContext, useState } from 'react';
import { Grid } from '@mui/material';
import { MetDescription, MetLabel, PrimaryButton } from 'components/common';
import { FormContext } from './FormContext';
import * as yup from 'yup';
import ControlledTextField from 'components/common/ControlledInputComponents/ControlledTextField';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppTranslation } from 'hooks';

const schema = yup
    .object({
        firstName: yup.string().required(),
        lastName: yup.string().required(),
        city: yup.string().required(),
        email: yup.string().email().required(),
    })
    .required();

type SecondCACTabForm = yup.TypeOf<typeof schema>;

export const SecondTab = () => {
    const { t: translate } = useAppTranslation();
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
                            <MetDescription>{translate('formCAC.tab2.description.0')}</MetDescription>
                        </Grid>
                        <Grid container item xs={12}>
                            <Grid item xs={12} sm={6}>
                                <MetLabel>{translate('formCAC.tab2.labels.0')}</MetLabel>
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
                        </Grid>
                        <Grid container item xs={12}>
                            <Grid item xs={12} sm={6}>
                                <MetLabel>{translate('formCAC.tab2.labels.1')}</MetLabel>
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
                        </Grid>
                        <Grid container item xs={12}>
                            <Grid item xs={12} sm={6}>
                                <MetLabel>{translate('formCAC.tab2.labels.2')}</MetLabel>
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
                        </Grid>
                        <Grid container item xs={12}>
                            <Grid item xs={12} sm={6}>
                                <MetLabel>{translate('formCAC.tab2.labels.3')}</MetLabel>
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
                    </Grid>
                </FormProvider>
            </Grid>

            <Grid item xs={12}>
                <MetDescription>{translate('formCAC.tab2.description.1')}</MetDescription>
            </Grid>

            <Grid item xs={12}>
                <PrimaryButton loading={submittingForm} onClick={handleSubmit(onSubmit)}>
                    {translate('formCAC.tab2.button.submit')}
                </PrimaryButton>
            </Grid>
        </Grid>
    );
};
