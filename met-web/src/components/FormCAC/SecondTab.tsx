import React, { useContext, useState } from 'react';
import { Grid2 as Grid } from '@mui/material';
import { BodyText } from 'components/common/Typography/Body';
import { FormContext } from './FormContext';
import * as yup from 'yup';
import ControlledTextField from 'components/common/ControlledInputComponents/ControlledTextField';
import { FormProvider, SubmitHandler, useForm, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppTranslation } from 'hooks';
import { Button } from 'components/common/Input/Button';

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
        resolver: yupResolver(schema) as unknown as Resolver<SecondCACTabForm>,
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
            <Grid size={12}>
                <FormProvider {...methods}>
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <BodyText>{translate('formCAC.tab2.description.0')}</BodyText>
                        </Grid>
                        <Grid container size={12}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <BodyText bold>{translate('formCAC.tab2.labels.0')}</BodyText>
                                <ControlledTextField name="firstName" />
                            </Grid>
                        </Grid>
                        <Grid container size={12}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <BodyText bold>{translate('formCAC.tab2.labels.1')}</BodyText>
                                <ControlledTextField name="lastName" />
                            </Grid>
                        </Grid>
                        <Grid container size={12}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <BodyText bold>{translate('formCAC.tab2.labels.2')}</BodyText>
                                <ControlledTextField name="city" />
                            </Grid>
                        </Grid>
                        <Grid container size={12}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <BodyText bold>{translate('formCAC.tab2.labels.3')}</BodyText>
                                <ControlledTextField name="email" />
                            </Grid>
                        </Grid>
                    </Grid>
                </FormProvider>
            </Grid>

            <Grid size={12}>
                <BodyText>{translate('formCAC.tab2.description.1')}</BodyText>
            </Grid>

            <Grid size={12}>
                <Button variant="primary" size="small" loading={submittingForm} onClick={handleSubmit(onSubmit)}>
                    {translate('formCAC.tab2.button.submit')}
                </Button>
            </Grid>
        </Grid>
    );
};
