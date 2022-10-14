import React, { useContext, useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import { Grid } from '@mui/material';
import { MetHeader3, MetLabel, PrimaryButton, SecondaryButton } from 'components/common';
import { ActionContext } from '../ActionContext';
import ImageUpload from 'components/imageUpload';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ControlledTextField from 'components/common/ControlledInputComponents/ControlledFormInput';
import { postContact } from 'services/contactService';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';

const schema = yup
    .object({
        name: yup.string().required(),
        role: yup.string().required(),
        phone_number: yup.string().required(),
        email: yup.string().email().required(),
        address: yup.string().required(),
        bio: yup.string().min(20).required(),
    })
    .required();

type ContactForm = yup.TypeOf<typeof schema>;

const AddContactDrawer = () => {
    const dispatch = useAppDispatch();

    const methods = useForm<ContactForm>({
        resolver: yupResolver(schema),
    });

    const { handleSubmit } = methods;
    const { addContactDrawerOpen, handleAddContactDrawerOpen } = useContext(ActionContext);
    const [isCreatingContact, setIsCreatingContact] = useState(false);

    const onSubmit: SubmitHandler<ContactForm> = async (data: ContactForm) => {
        try {
            setIsCreatingContact(true);
            await postContact(data);
            setIsCreatingContact(false);
            handleAddContactDrawerOpen(false);
            dispatch(openNotification({ severity: 'success', text: 'A new contact was successfully added' }));
        } catch (err) {
            console.log(err);
            dispatch(
                openNotification({ severity: 'error', text: 'An error occured while trying to create a new contact' }),
            );
            setIsCreatingContact(false);
        }
    };

    return (
        <Drawer anchor="right" open={addContactDrawerOpen} onClose={() => handleAddContactDrawerOpen(false)}>
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
                            <MetHeader3 bold>Add Contact</MetHeader3>
                            <Divider sx={{ marginTop: '1em' }} />
                        </Grid>
                        <Grid item xs={12} lg={4}>
                            <MetLabel sx={{ marginBottom: '2px' }}>Profile Picture</MetLabel>
                            <ImageUpload
                                data-testid="engagement-form /image-upload"
                                handleAddFile={() => {
                                    /***/
                                }}
                                savedImageUrl={''}
                            />
                        </Grid>
                        <Grid item xs={12} lg={8} container direction="row" spacing={2}>
                            <Grid item xs={12}>
                                <MetLabel sx={{ marginBottom: '2px' }}>Name</MetLabel>
                                <ControlledTextField
                                    name="name"
                                    id="contact-name"
                                    data-testid="contact-form/name"
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
                                <MetLabel sx={{ marginBottom: '2px' }}>Role</MetLabel>
                                <ControlledTextField
                                    id="contact-role"
                                    data-testid="contact-form/role"
                                    variant="outlined"
                                    label=" "
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    fullWidth
                                    name="role"
                                    size="small"
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} lg={4}>
                            <MetLabel sx={{ marginBottom: '2px' }}>Phone</MetLabel>
                            <ControlledTextField
                                id="contact-phone"
                                data-testid="contact-form/phone"
                                variant="outlined"
                                label=" "
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                fullWidth
                                name="phone_number"
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} lg={8}>
                            <MetLabel sx={{ marginBottom: '2px' }}>Email</MetLabel>
                            <ControlledTextField
                                id="contact-email"
                                data-testid="contact-form/email"
                                variant="outlined"
                                label=" "
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                fullWidth
                                name="email"
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <MetLabel sx={{ marginBottom: '2px' }}>Address</MetLabel>
                            <ControlledTextField
                                id="contact-address"
                                data-testid="contact-form/address"
                                variant="outlined"
                                label=" "
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                fullWidth
                                name="address"
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <MetLabel sx={{ marginBottom: '2px' }}>Bio</MetLabel>
                            <ControlledTextField
                                id="contact-bio"
                                data-testid="contact-form/bio"
                                variant="outlined"
                                label=" "
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                fullWidth
                                name="bio"
                                size="small"
                                multiline
                                minRows={5}
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            container
                            direction="row"
                            spacing={1}
                            justifyContent={'flex-start'}
                            marginTop="8em"
                        >
                            <Grid item>
                                <PrimaryButton loading={isCreatingContact} onClick={handleSubmit(onSubmit)}>
                                    {`Save & Close`}
                                </PrimaryButton>
                            </Grid>
                            <Grid item>
                                <SecondaryButton
                                    onClick={() => handleAddContactDrawerOpen(false)}
                                >{`Cancel`}</SecondaryButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </FormProvider>
            </Box>
        </Drawer>
    );
};

export default AddContactDrawer;
