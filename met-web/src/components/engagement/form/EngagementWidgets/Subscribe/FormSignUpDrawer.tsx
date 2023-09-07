import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import { Grid, FormControlLabel, Radio, FormLabel, FormControl, FormHelperText } from '@mui/material';
import { MetHeader3, MetLabel, PrimaryButton, SecondaryButton } from 'components/common';
import { useForm, FormProvider, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { SubscribeContext } from './SubscribeContext';
import ControlledTextField from 'components/common/ControlledInputComponents/ControlledTextField';
import { SUBSCRIBE_TYPE, SubscribeForm } from 'models/subscription';
import RichTextEditor from 'components/common/RichTextEditor';
import ControlledRadioGroup from 'components/common/ControlledInputComponents/ControlledRadioGroup';
import { Palette } from 'styles/Theme';
import { patchSubscribeForm, postSubscribeForm } from 'services/subscriptionService';
import { When } from 'react-if';
import { useDispatch } from 'react-redux';
import { openNotification } from 'services/notificationService/notificationSlice';
import { getTextFromDraftJsContentState } from 'components/common/RichTextEditor/utils';

const schema = yup
    .object({
        description: yup
            .string()
            .required('This field is required')
            .max(500, 'Description cannot exceed 500 characters'),
        richDescription: yup.string(),
        callToActionType: yup.string().required('This field is required'),
        callToActionText: yup
            .string()
            .required('This field is required')
            .max(25, 'call to action cannot exceed 25 characters'),
    })
    .required();

type FormSignUp = yup.TypeOf<typeof schema> & {
    call_to_action_type: 'link' | 'button';
};

const FormSignUpDrawer = () => {
    const {
        formSignUpTabOpen,
        widget,
        setFormSignUpTabOpen,
        subscribeOptionToEdit,
        setSubscribeOptionToEdit,
        loadSubscribeOptions,
    } = useContext(SubscribeContext);
    const [isCreating, setIsCreating] = useState(false);
    const [initialRawEditorState, setInitialRawEditorState] = useState('');

    const methods = useForm<FormSignUp>({
        resolver: yupResolver(schema),
    });

    const dispatch = useDispatch();

    const {
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors },
    } = methods;

    useEffect(() => {
        if (subscribeOptionToEdit) {
            const subscribeItem = subscribeOptionToEdit.subscribe_items[0];
            setValue('description', getTextFromDraftJsContentState(subscribeItem.description));
            setValue('richDescription', subscribeItem.description);
            setValue('callToActionType', subscribeItem.call_to_action_type);
            setValue('callToActionText', subscribeItem.call_to_action_text);
            setInitialRawEditorState(subscribeItem.description);
        }
    }, [subscribeOptionToEdit]);

    const createSubscribeForm = async (data: FormSignUp) => {
        const { richDescription, callToActionText, callToActionType } = await schema.validate(data);
        if (!widget) {
            return;
        }
        await postSubscribeForm(widget.id, {
            widget_id: widget.id,
            type: SUBSCRIBE_TYPE.SIGN_UP,
            items: [
                {
                    description: richDescription,
                    call_to_action_type: callToActionType,
                    call_to_action_text: callToActionText,
                    form_type: SUBSCRIBE_TYPE.SIGN_UP,
                },
            ],
        });

        loadSubscribeOptions();
    };

    const updateSubscribeForm = async (data: FormSignUp) => {
        const { richDescription, callToActionText, callToActionType } = await schema.validate(data);
        if (!widget || !subscribeOptionToEdit) {
            return;
        }

        const subscribeOptionItem = subscribeOptionToEdit.subscribe_items[0];
        await patchSubscribeForm(widget.id, subscribeOptionToEdit.id, subscribeOptionItem.id, {
            description: richDescription,
            call_to_action_type: callToActionType,
            call_to_action_text: callToActionText,
        });

        loadSubscribeOptions();
    };

    const saveSubscribeForm = (data: FormSignUp) => {
        if (subscribeOptionToEdit) {
            return updateSubscribeForm(data);
        }
        return createSubscribeForm(data);
    };

    const onSubmit: SubmitHandler<FormSignUp> = async (data: FormSignUp) => {
        try {
            setIsCreating(true);
            await saveSubscribeForm(data);
            setIsCreating(false);
            setFormSignUpTabOpen(false);
        } catch (error) {
            setIsCreating(false);
            dispatch(
                openNotification({ severity: 'error', text: 'An error occurred while trying to save the widget' }),
            );
        }
    };

    const handleClose = () => {
        setFormSignUpTabOpen(false);
        reset({});
        setSubscribeOptionToEdit(null);
    };

    return (
        <Drawer anchor="right" open={formSignUpTabOpen} onClose={handleClose}>
            <Box sx={{ width: '40vw', paddingTop: '7em' }} role="presentation">
                <FormProvider {...methods}>
                    <Grid
                        container
                        direction="row"
                        alignItems="baseline"
                        justifyContent="flex-start"
                        spacing={2}
                        padding="2em"
                    >
                        <Grid item xs={12}>
                            <MetHeader3 bold>Form Sign-Up</MetHeader3>
                            <Divider sx={{ marginTop: '1em' }} />
                        </Grid>
                        <Grid item xs={12}>
                            <MetLabel sx={{ marginBottom: '2px' }}>Description</MetLabel>
                            <Controller
                                name="richDescription"
                                control={control}
                                render={({ field }) => (
                                    <RichTextEditor
                                        handleEditorStateChange={(editorState: string) => field.onChange(editorState)}
                                        setRawText={(rawText: string) => setValue('description', rawText)}
                                        error={Boolean(errors.description)}
                                        helperText={String(errors.description?.message)}
                                        initialRawEditorState={initialRawEditorState}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl error={Boolean(errors.callToActionType)}>
                                <FormLabel
                                    id="controlled-radio-buttons-group"
                                    sx={{ fontWeight: 'bold', color: Palette.text.primary, paddingBottom: 1 }}
                                >
                                    Call-to-action Type
                                </FormLabel>
                                <ControlledRadioGroup name="callToActionType">
                                    <FormControlLabel value="link" control={<Radio />} label={'Link'} />
                                    <FormControlLabel value="button" control={<Radio />} label={'Button'} />
                                </ControlledRadioGroup>
                                <When condition={Boolean(errors.callToActionType)}>
                                    <FormHelperText>{String(errors.callToActionType?.message)}</FormHelperText>
                                </When>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <MetLabel sx={{ marginBottom: '2px' }}>Call-to-action</MetLabel>
                            <ControlledTextField
                                name="callToActionText"
                                variant="outlined"
                                label=""
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            container
                            direction="row"
                            spacing={1}
                            justifyContent={'flex-start'}
                            marginTop="2em"
                        >
                            <Grid item>
                                <PrimaryButton
                                    onClick={handleSubmit(onSubmit)}
                                    loading={isCreating}
                                >{`Save & Close`}</PrimaryButton>
                            </Grid>
                            <Grid item>
                                <SecondaryButton onClick={handleClose}>Cancel</SecondaryButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </FormProvider>
            </Box>
        </Drawer>
    );
};

export default FormSignUpDrawer;
