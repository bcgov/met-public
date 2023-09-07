import React, { useContext, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import { Grid, FormControlLabel, Radio, FormLabel, FormControl } from '@mui/material';
import { MetHeader3, MetLabel, PrimaryButton, SecondaryButton } from 'components/common';
import { useForm, FormProvider, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { SubscribeContext } from './SubscribeContext';
import ControlledTextField from 'components/common/ControlledInputComponents/ControlledTextField';
import { SUBSCRIBE_TYPE } from 'models/subscription';
import RichTextEditor from 'components/common/RichTextEditor';
import ControlledRadioGroup from 'components/common/ControlledInputComponents/ControlledRadioGroup';
import { Palette } from 'styles/Theme';

const schema = yup
    .object({
        description: yup.string().max(5, 'Description cannot exceed 500 characters'),
        richDescription: yup.string(),
        call_to_action_type: yup.string().required('This field is required'),
        call_to_action_text: yup
            .string()
            .required('This field is required')
            .max(25, 'call to action cannot exceed 25 characters'),
    })
    .required();

type FormSignUp = yup.TypeOf<typeof schema> & {
    call_to_action_type: 'link' | 'button';
};

const FormSignUpDrawer = () => {
    const { handleSubscribeDrawerOpen, formSignUpTabOpen } = useContext(SubscribeContext);
    const [isCreating] = useState(false);
    const methods = useForm<FormSignUp>({
        resolver: yupResolver(schema),
    });

    // useEffect(() => {
    //     methods.setValue('description', '');
    //     methods.setValue('call_to_action_type', 'link');
    //     methods.setValue('call_to_action_text', '');
    // }, []);

    const {
        handleSubmit,
        trigger,
        control,
        setValue,
        formState: { errors },
    } = methods;

    const onSubmit: SubmitHandler<FormSignUp> = async (data: FormSignUp) => {
        trigger();
        console.log(data);
        return;
    };

    return (
        <Drawer
            anchor="right"
            open={formSignUpTabOpen}
            onClose={() => {
                handleSubscribeDrawerOpen(SUBSCRIBE_TYPE.FORM, false);
            }}
        >
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
                            {/* <RichTextEditor
                                    setRawText={handleDescriptionChange}
                                    handleEditorStateChange={handleRichDescriptionChange}
                                    initialRawEditorState={initialRichDescription || ''}
                                    error={false}
                                    helperText={'Maximum 550 Characters.'}
                                /> */}
                            <Controller
                                name="richDescription"
                                control={control}
                                render={({ field }) => (
                                    <RichTextEditor
                                        handleEditorStateChange={(editorState: string) => field.onChange(editorState)}
                                        setRawText={(rawText: string) => setValue('description', rawText)}
                                        error={Boolean(errors.description)}
                                        helperText={String(errors.description?.message)}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl>
                                <FormLabel
                                    id="controlled-radio-buttons-group"
                                    sx={{ fontWeight: 'bold', color: Palette.text.primary, paddingBottom: 1 }}
                                >
                                    Call-to-action Type
                                </FormLabel>
                                <ControlledRadioGroup name="call_to_action_type">
                                    <FormControlLabel value="link" control={<Radio />} label={'Link'} />
                                    <FormControlLabel value="button" control={<Radio />} label={'Button'} />
                                </ControlledRadioGroup>
                            </FormControl>
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
                                <PrimaryButton
                                    onClick={handleSubmit(onSubmit)}
                                    type="submit"
                                    loading={isCreating}
                                >{`Save & Close`}</PrimaryButton>
                            </Grid>
                            <Grid item>
                                <SecondaryButton
                                    onClick={() => handleSubscribeDrawerOpen(SUBSCRIBE_TYPE.EMAIL_LIST, false)}
                                >
                                    Cancel
                                </SecondaryButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </FormProvider>
            </Box>
        </Drawer>
    );
};

export default FormSignUpDrawer;
