import React, { useContext, useState, useEffect } from 'react';
import { useAppDispatch } from 'hooks';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import { Grid, FormControlLabel, Radio, FormControl, FormLabel, FormHelperText } from '@mui/material';
import { MetHeader3, MetLabel, PrimaryButton, SecondaryButton } from 'components/common';
import { useForm, FormProvider, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { SubscribeContext } from './SubscribeContext';
import ControlledTextField from 'components/common/ControlledInputComponents/ControlledTextField';
import { SUBSCRIBE_TYPE } from 'models/subscription';
import RichTextEditor from 'components/common/RichTextEditor';
import { openNotification } from 'services/notificationService/notificationSlice';
import { patchSubscribeForm, postSubscribeForm, PatchSubscribeProps } from 'services/subscriptionService';
import { CALL_TO_ACTION_TYPE, RichTextToolbarConfig } from './constants';
import { getTextFromDraftJsContentState } from 'components/common/RichTextEditor/utils';
import ControlledRadioGroup from 'components/common/ControlledInputComponents/ControlledRadioGroup';
import { When } from 'react-if';
import { Palette } from 'styles/Theme';

const schema = yup
    .object({
        description: yup
            .string()
            .required('This field is required')
            .max(500, 'Description cannot exceed 500 characters'),
        richDescription: yup.string().required('This field is required'),
        callToActionType: yup.string().required('This field is required'),
        callToActionText: yup
            .string()
            .required('This field is required')
            .max(25, 'call to action cannot exceed 25 characters'),
    })
    .required();

type EmailList = yup.TypeOf<typeof schema> & {
    callToActionType: 'link' | 'button';
};

const EmailListDrawer = () => {
    const {
        widget,
        handleSubscribeDrawerOpen,
        emailListTabOpen,
        subscribeOptionToEdit,
        loadSubscribeOptions,
        setSubscribeOptionToEdit,
    } = useContext(SubscribeContext);

    const [isCreating, setIsCreating] = useState(false);
    const [initialRichDescription, setInitialRichDescription] = useState('');
    const subscribeItem = subscribeOptionToEdit ? subscribeOptionToEdit.subscribe_items[0] : null;
    const dispatch = useAppDispatch();
    const methods = useForm<EmailList>({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (subscribeOptionToEdit) {
            const subscribeItem = subscribeOptionToEdit.subscribe_items[0];
            setValue('description', getTextFromDraftJsContentState(subscribeItem.description));
            setValue('richDescription', subscribeItem.description);
            setValue('callToActionType', subscribeItem.call_to_action_type);
            setValue('callToActionText', subscribeItem.call_to_action_text);
            setInitialRichDescription(subscribeItem.description);
        } else {
                setValue('callToActionType', 'link');
                setValue('callToActionText', 'Click here to sign up');
                setInitialRichDescription('');
        }
    }, [subscribeOptionToEdit]);

    const {
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = methods;

    const updateEmailListForm = async (data: EmailList) => {
        if (!subscribeOptionToEdit || !subscribeItem || !widget) {
            return;
        }
        const validatedData = await schema.validate(data);
        const { callToActionType, callToActionText, richDescription } = validatedData;
        const subscribeUpdatesToPatch = {
            description: richDescription,
            call_to_action_type: callToActionType,
            call_to_action_text: callToActionText,
        } as PatchSubscribeProps;

        await patchSubscribeForm(widget.id, subscribeOptionToEdit.id, subscribeItem.id, {
            ...subscribeUpdatesToPatch,
        });

        loadSubscribeOptions();

        dispatch(openNotification({ severity: 'success', text: 'EmailListForm was successfully updated' }));
    };

    const createEmailListForm = async (data: EmailList) => {
        if (!widget) {
            return;
        }
        const validatedData = await schema.validate(data);
        const { callToActionType, callToActionText, richDescription } = validatedData;
        await postSubscribeForm(widget.id, {
            widget_id: widget.id,
            type: SUBSCRIBE_TYPE.EMAIL_LIST,
            items: [
                {
                    description: richDescription,
                    call_to_action_type: callToActionType,
                    call_to_action_text: callToActionText,
                    form_type: SUBSCRIBE_TYPE.EMAIL_LIST,
                },
            ],
        });
        loadSubscribeOptions();
        dispatch(openNotification({ severity: 'success', text: 'Email list form was successfully created' }));
    };

    const saveForm = async (data: EmailList) => {
        if (subscribeOptionToEdit) {
            return updateEmailListForm(data);
        }
        return createEmailListForm(data);
    };

    const onSubmit: SubmitHandler<EmailList> = async (data: EmailList) => {
        if (!widget) {
            return;
        }
        try {
            setIsCreating(true);
            await saveForm(data);
            setIsCreating(false);
            handleSubscribeDrawerOpen(SUBSCRIBE_TYPE.EMAIL_LIST, false);
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'An error occurred while trying to create email list form',
                }),
            );
            setIsCreating(false);
        }
    };

    const handleClose = () => {
        handleSubscribeDrawerOpen(SUBSCRIBE_TYPE.EMAIL_LIST, false);
        setSubscribeOptionToEdit(null);
    };

    return (
        <Drawer anchor="right" open={emailListTabOpen} onClose={handleClose}>
            <Box sx={{ width: '40vw', paddingTop: '7em' }} role="presentation">
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid
                            container
                            direction="row"
                            alignItems="baseline"
                            justifyContent="flex-start"
                            spacing={2}
                            padding="2em"
                        >
                            <Grid item xs={12}>
                                <MetHeader3 bold>Email List</MetHeader3>
                                <Divider sx={{ marginTop: '1em' }} />
                            </Grid>
                            <Grid item xs={12}>
                                <MetLabel sx={{ marginBottom: '2px' }}>Description</MetLabel>
                                <Controller
                                    name="richDescription"
                                    control={control}
                                    render={({ field }) => (
                                        <RichTextEditor
                                            handleEditorStateChange={(editorState: string) =>
                                                field.onChange(editorState)
                                            }
                                            setRawText={(rawText: string) => setValue('description', rawText)}
                                            error={Boolean(errors.description)}
                                            helperText={String(errors.description?.message)}
                                            initialRawEditorState={initialRichDescription}
                                            toolbar={RichTextToolbarConfig}
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
                                        <FormControlLabel
                                            value={CALL_TO_ACTION_TYPE.LINK}
                                            control={<Radio />}
                                            label={'Link'}
                                        />
                                        <FormControlLabel
                                            value={CALL_TO_ACTION_TYPE.BUTTON}
                                            control={<Radio />}
                                            label={'Button'}
                                        />
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
                                    <PrimaryButton type="submit" loading={isCreating}>{`Save & Close`}</PrimaryButton>
                                </Grid>
                                <Grid item>
                                    <SecondaryButton onClick={handleClose}>Cancel</SecondaryButton>
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
                </FormProvider>
            </Box>
        </Drawer>
    );
};

export default EmailListDrawer;
