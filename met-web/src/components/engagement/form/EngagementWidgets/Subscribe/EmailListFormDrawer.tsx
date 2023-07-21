import React, { useContext, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import { Grid, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { MetHeader3, MetLabel, PrimaryButton, SecondaryButton } from 'components/common';
import { useForm, FormProvider, SubmitHandler, Controller, ControllerRenderProps } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { SubscribeContext } from './SubscribeContext';
import ControlledTextField from 'components/common/ControlledInputComponents/ControlledTextField';
import { Subscribe_TYPE } from 'models/subscription';

const schema = yup
    .object({
        description: yup.string().max(500, 'Description cannot exceed 500 characters'),
        cta_type: yup.string(),
        cta_text: yup.string().max(25, 'Description cannot exceed 25 characters'),
    })
    .required();

type EmailList = yup.TypeOf<typeof schema> & {
    cta_type: 'link' | 'button';
};

const EmailListDrawer = () => {
    const { handleSubscribeDrawerOpen, emailListTabOpen } = useContext(SubscribeContext);
    const [isCreating] = useState(false);
    const methods = useForm<EmailList>({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        methods.setValue('description', '');
        methods.setValue('cta_type', 'link');
        methods.setValue('cta_text', '');
    }, []);

    const { handleSubmit } = methods;

    const updateEmailListForm = async (data: EmailList) => {
        return;
    };

    const createEmailListForm = async (data: EmailList) => {
        return;
    };

    const onSubmit: SubmitHandler<EmailList> = async (data: EmailList) => {
        return;
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
                                <ControlledTextField
                                    name="description"
                                    variant="outlined"
                                    label=" "
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    fullWidth
                                    size="small"
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
                                            field: ControllerRenderProps<EmailList, 'cta_type'>;
                                        }) => (
                                            <FormControlLabel
                                                control={<Checkbox />}
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
                                            field: ControllerRenderProps<EmailList, 'cta_type'>;
                                        }) => (
                                            <FormControlLabel
                                                control={<Checkbox />}
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

export default EmailListDrawer;
