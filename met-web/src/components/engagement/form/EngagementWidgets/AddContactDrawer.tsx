import React, { useContext, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import { Grid } from '@mui/material';
import { MetHeader3, MetLabel, PrimaryButton, SecondaryButton } from 'components/common';
import ImageUpload from 'components/imageUpload';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ControlledTextField from 'components/common/ControlledInputComponents/ControlledTextField';
import { patchContact, postContact, PatchContactRequest } from 'services/contactService';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { WidgetDrawerContext } from './WidgetDrawerContext';
import { updatedDiff } from 'deep-object-diff';

const schema = yup
    .object({
        name: yup.string().required(),
        title: yup.string(),
        phone_number: yup.string(),
        email: yup.string().email().required(),
        address: yup.string(),
        bio: yup.string(),
    })
    .required();

type ContactForm = yup.TypeOf<typeof schema>;

const AddContactDrawer = () => {
    const dispatch = useAppDispatch();
    const { addContactDrawerOpen, handleAddContactDrawerOpen, loadContacts, selectedContact, updateSelectedContact } =
        useContext(WidgetDrawerContext);
    const [isCreatingContact, setIsCreatingContact] = useState(false);
    const methods = useForm<ContactForm>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: selectedContact ? selectedContact.name : '',
            phone_number: selectedContact ? selectedContact.phone_number : '',
            title: selectedContact ? selectedContact.title : '',
            email: selectedContact ? selectedContact.email : '',
            address: selectedContact ? selectedContact.address : '',
            bio: selectedContact ? selectedContact.bio : '',
        },
    });

    useEffect(() => {
        methods.setValue('name', selectedContact?.name);
        methods.setValue('phone_number', selectedContact?.phone_number);
        methods.setValue('title', selectedContact?.title);
        methods.setValue('email', selectedContact?.email);
        methods.setValue('address', selectedContact?.address);
        methods.setValue('bio', selectedContact?.bio);
    }, [selectedContact]);

    const { handleSubmit } = methods;

    const updateContact = async (data: ContactForm) => {
        if (selectedContact) {
            const contactUpdatesToPatch = updatedDiff(selectedContact, {
                ...methods.getValues(),
            }) as PatchContactRequest;

            const updatedContact = await patchContact({
                ...contactUpdatesToPatch,
                id: selectedContact.id,
            });
            updateSelectedContact(updatedContact);
            dispatch(openNotification({ severity: 'success', text: 'Contact was successfully updated' }));
        } else {
            dispatch(openNotification({ severity: 'error', text: 'Contact does not exist' }));
        }
        loadContacts();
    };

    const createContact = async (data: ContactForm) => {
        await postContact(data);
        dispatch(openNotification({ severity: 'success', text: 'A new contact was successfully added' }));
        loadContacts();
    };

    const onSubmit: SubmitHandler<ContactForm> = async (data: ContactForm) => {
        try {
            setIsCreatingContact(true);
            selectedContact ? updateContact(data) : createContact(data);
            setIsCreatingContact(false);
            handleAddContactDrawerOpen(false);
        } catch (err) {
            console.log(err);
            !selectedContact
                ? dispatch(
                      openNotification({
                          severity: 'error',
                          text: 'An error occured while trying to create a new contact',
                      }),
                  )
                : dispatch(
                      openNotification({ severity: 'error', text: 'An error occured while trying to update contact' }),
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
                            <MetHeader3 bold>{selectedContact ? 'Edit' : 'Add'} Contact</MetHeader3>
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
                                <MetLabel sx={{ marginBottom: '2px' }}>* Name</MetLabel>
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
                                <MetLabel sx={{ marginBottom: '2px' }}>Title</MetLabel>
                                <ControlledTextField
                                    id="contact-title"
                                    data-testid="contact-form/title"
                                    variant="outlined"
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    fullWidth
                                    name="title"
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
                            <MetLabel sx={{ marginBottom: '2px' }}>* Email </MetLabel>
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
