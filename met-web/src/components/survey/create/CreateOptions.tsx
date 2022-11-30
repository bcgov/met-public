import React, { useContext, useState } from 'react';
import { Grid, TextField, Stack } from '@mui/material';
import { CreateSurveyContext } from './CreateSurveyContext';
import { useNavigate } from 'react-router-dom';
import { hasKey } from 'utils';
import { postSurvey } from 'services/surveyService';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { MetLabel, PrimaryButton, SecondaryButton } from 'components/common';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import ControlledTextField from 'components/common/ControlledInputComponents/ControlledTextField';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup
    .object({
        name: yup.string().max(50, 'Survey name should not exceed 50 characters').required(),
    })
    .required();

type SurveyForm = yup.TypeOf<typeof schema>;

export const CreateOptions = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { engagementToLink } = useContext(CreateSurveyContext);

    const [isSaving, setIsSaving] = useState(false);

    const methods = useForm<SurveyForm>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
        },
    });

    const { handleSubmit } = methods;

    const onSubmit: SubmitHandler<SurveyForm> = async (data: SurveyForm) => {
        try {
            setIsSaving(true);
            const createdSurvey = await postSurvey({
                name: data.name,
                engagement_id: engagementToLink?.id ? String(engagementToLink.id) : undefined,
                form_json: {
                    display: 'form',
                    components: [],
                },
            });

            dispatch(
                openNotification({
                    severity: 'success',
                    text: 'Survey created, please proceed to building it',
                }),
            );
            navigate(`/surveys/${createdSurvey.id}/build`);
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while attempting to save survey',
                }),
            );
            setIsSaving(false);
        }
    };

    return (
        <Grid container direction="row" alignItems="flex-start" justifyContent="flex-start" item xs={12} spacing={2}>
            <FormProvider {...methods}>
                <Grid item xs={6}>
                    <MetLabel>Enter Survey Name</MetLabel>
                    <ControlledTextField
                        id="survey-name"
                        size="small"
                        variant="outlined"
                        label=" "
                        name="name"
                        value={name}
                        InputLabelProps={{
                            shrink: false,
                        }}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <Stack direction="row" spacing={2}>
                        <PrimaryButton onClick={handleSubmit(onSubmit)} loading={isSaving}>
                            {'Save & Continue'}
                        </PrimaryButton>
                        <SecondaryButton onClick={() => navigate(-1)}>Cancel</SecondaryButton>
                    </Stack>
                </Grid>
            </FormProvider>
        </Grid>
    );
};
