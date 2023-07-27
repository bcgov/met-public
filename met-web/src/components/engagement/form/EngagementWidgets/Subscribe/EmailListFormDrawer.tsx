import React, { useContext, useState, useEffect } from 'react';
import { useAppDispatch } from 'hooks';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import { Grid, FormGroup, FormControlLabel, Radio } from '@mui/material';
import { MetHeader3, MetLabel, PrimaryButton, SecondaryButton } from 'components/common';
import { useForm, FormProvider, SubmitHandler, Controller, ControllerRenderProps } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { SubscribeContext } from './SubscribeContext';
import ControlledTextField from 'components/common/ControlledInputComponents/ControlledTextField';
import { Subscribe_TYPE, SubscribeForm } from 'models/subscription';
import RichTextEditor from 'components/common/RichTextEditor';
import { openNotification } from 'services/notificationService/notificationSlice';
import { getTextFromDraftJsContentState } from 'components/common/RichTextEditor/utils';
import { postSubscribeForm, patchSubscribeForm } from 'services/subscriptionService';

const schema = yup
    .object({
        description: yup.string(),
        call_to_action_type: yup.string(),
        call_to_action_text: yup
            .string()
            .max(25, 'Call to action cannot exceed 25 characters')
            .required('Call to action is required'),
    })
    .required();

type EmailList = yup.TypeOf<typeof schema> & {
    call_to_action_type: 'link' | 'button';
};

const EmailListDrawer = () => {
    const {
        widget,
        handleSubscribeDrawerOpen,
        emailListTabOpen,
        richEmailListDescription,
        setRichEmailListDescription,
        setSubscribe,
    } = useContext(SubscribeContext);
    const [isCreating, setIsCreating] = useState(false);
    const [initialRichDescription, setInitialRichDescription] = useState('');
    const [descriptionCharCount, setDescriptionCharCount] = useState(0);
    const dispatch = useAppDispatch();
    const methods = useForm<EmailList>({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        methods.setValue('description', '');
        methods.setValue('call_to_action_type', 'link');
        methods.setValue('call_to_action_text', 'Click here to sign up');
        const initialDescription = getTextFromDraftJsContentState(richEmailListDescription);
        setInitialRichDescription(richEmailListDescription);
        setDescriptionCharCount(initialDescription.length);
    }, []);

    const { handleSubmit } = methods;

    const updateEmailListForm = async (data: EmailList) => {
        return;
    };

    const createEmailListForm = async (data: EmailList) => {
        const validatedData = await schema.validate(data);
        const { call_to_action_type, call_to_action_text } = validatedData;
        if (widget) {
            const createdWidgetForm = await postSubscribeForm(widget.id, {
                widget_id: widget.id,
                type: Subscribe_TYPE.EMAIL_LIST,
                items: [
                    {
                        description: richEmailListDescription,
                        call_to_action_type: call_to_action_type,
                        call_to_action_text: call_to_action_text,
                        form_type: Subscribe_TYPE.EMAIL_LIST,
                    },
                ],
            });

            setSubscribe((prevWidgetForms: SubscribeForm[]) => [...prevWidgetForms, createdWidgetForm]);
        }
        dispatch(openNotification({ severity: 'success', text: 'Email list form was successfully created' }));
    };

    const saveForm = async (data: EmailList) => {
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
            handleSubscribeDrawerOpen(Subscribe_TYPE.EMAIL_LIST, false);
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

    const handleDescriptionChange = (rawText: string) => {
        setDescriptionCharCount(rawText.length);
    };

    const handleRichDescriptionChange = (newState: string) => {
        setRichEmailListDescription(newState);
    };

    return (
        <Drawer
            anchor="right"
            open={emailListTabOpen}
            onClose={() => {
                handleSubscribeDrawerOpen(Subscribe_TYPE.EMAIL_LIST, false);
            }}
        >
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
                                <RichTextEditor
                                    setRawText={handleDescriptionChange}
                                    handleEditorStateChange={handleRichDescriptionChange}
                                    initialRawEditorState={initialRichDescription || ''}
                                    error={getTextFromDraftJsContentState(richEmailListDescription).length > 550}
                                    helperText={'Maximum 550 Characters.'}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <MetLabel sx={{ marginBottom: '2px' }}>Call-to-action type</MetLabel>
                                <FormGroup>
                                    <Controller
                                        control={methods.control}
                                        name="call_to_action_type"
                                        render={({
                                            field,
                                        }: {
                                            field: ControllerRenderProps<EmailList, 'call_to_action_type'>;
                                        }) => (
                                            <FormControlLabel
                                                control={<Radio />}
                                                label="Link"
                                                checked={field.value === 'link'}
                                                onChange={() => field.onChange('link')}
                                            />
                                        )}
                                    />
                                    <Controller
                                        control={methods.control}
                                        name="call_to_action_type"
                                        render={({
                                            field,
                                        }: {
                                            field: ControllerRenderProps<EmailList, 'call_to_action_type'>;
                                        }) => (
                                            <FormControlLabel
                                                control={<Radio />}
                                                label="Button"
                                                checked={field.value === 'button'}
                                                onChange={() => field.onChange('button')}
                                            />
                                        )}
                                    />
                                </FormGroup>
                            </Grid>
                            <Grid item xs={12}>
                                <MetLabel sx={{ marginBottom: '2px' }}>Call-to-action</MetLabel>
                                <ControlledTextField
                                    name="call_to_action_text"
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
                                    <SecondaryButton
                                        onClick={() => handleSubscribeDrawerOpen(Subscribe_TYPE.EMAIL_LIST, false)}
                                    >
                                        Cancel
                                    </SecondaryButton>
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
