import React, { useContext, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import { Grid, FormGroup, FormControlLabel, Radio } from '@mui/material';
import { MetHeader3, MetLabel, PrimaryButton, SecondaryButton } from 'components/common';
import { useForm, FormProvider, SubmitHandler, Controller, ControllerRenderProps } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch } from 'hooks';
import { SubscribeContext } from './SubscribeContext';
import ControlledTextField from 'components/common/ControlledInputComponents/ControlledTextField';
import { Subscribe_TYPE } from 'models/subscription';
import RichTextEditor from 'components/common/RichTextEditor';

const schema = yup
    .object({
        description: yup.string().max(500, 'Description cannot exceed 500 characters'),
        cta_type: yup.string(),
        cta_text: yup.string().max(25, 'Description cannot exceed 25 characters'),
    })
    .required();

type FormSignUp = yup.TypeOf<typeof schema> & {
    cta_type: 'link' | 'button';
};

const FormSignUpDrawer = () => {
    const dispatch = useAppDispatch();
    const { handleSubscribeDrawerOpen, formSignUpTabOpen, richFormSignUpDescription, setRichFormSignUpDescription } =
        useContext(SubscribeContext);
    const [isCreating, setIsCreating] = useState(false);
    const [initialRichDescription, setInitialRichDescription] = useState('');
    const [descriptionCharCount, setDescriptionCharCount] = useState(0);
    const methods = useForm<FormSignUp>({
        resolver: yupResolver(schema),
    });

    const getTextFromDraftJsContentState = (contentJSON: string): string => {
        if (!contentJSON) return '';
        const contentState = JSON.parse(contentJSON);
        return contentState.blocks.map((block: { text: string }) => block.text).join(' ');
    };

    useEffect(() => {
        methods.setValue('description', '');
        methods.setValue('cta_type', 'link');
        methods.setValue('cta_text', '');
        const initialDescription = getTextFromDraftJsContentState(richFormSignUpDescription);
        setInitialRichDescription(richFormSignUpDescription);
        setDescriptionCharCount(initialDescription.length);
    }, []);

    const { handleSubmit } = methods;

    const updateSubscribeForm = async (data: FormSignUp) => {
        return;
    };

    const createSubscribeForm = async (data: FormSignUp) => {
        return;
    };

    const onSubmit: SubmitHandler<FormSignUp> = async (data: FormSignUp) => {
        return;
    };

    const handleDescriptionChange = (rawText: string) => {
        setDescriptionCharCount(rawText.length);
    };

    const handleRichDescriptionChange = (newState: string) => {
        setRichFormSignUpDescription(newState);
    };

    return (
        <Drawer
            anchor="right"
            open={formSignUpTabOpen}
            onClose={() => {
                handleSubscribeDrawerOpen(Subscribe_TYPE.FORM, false);
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
                                <MetHeader3 bold>Form Sign-Up</MetHeader3>
                                <Divider sx={{ marginTop: '1em' }} />
                            </Grid>
                            <Grid item xs={12}>
                                <MetLabel sx={{ marginBottom: '2px' }}>Description</MetLabel>
                                <RichTextEditor
                                    setRawText={handleDescriptionChange}
                                    handleEditorStateChange={handleRichDescriptionChange}
                                    initialRawEditorState={initialRichDescription || ''}
                                    error={false}
                                    helperText={'Maximum 550 Characters.'}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <MetLabel sx={{ marginBottom: '2px' }}>Call-to-action type</MetLabel>
                                <FormGroup>
                                    <Controller
                                        control={methods.control}
                                        name="cta_type"
                                        render={({
                                            field,
                                        }: {
                                            field: ControllerRenderProps<FormSignUp, 'cta_type'>;
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
                                        name="cta_type"
                                        render={({
                                            field,
                                        }: {
                                            field: ControllerRenderProps<FormSignUp, 'cta_type'>;
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
                                    name="cta_text"
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

export default FormSignUpDrawer;
