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
import { updatedDiff } from 'deep-object-diff';
import { WhoIsListeningContext } from './WhoIsListeningContext';
import { saveDocument } from 'services/objectStorageService';

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
    const { addContactDrawerOpen, handleAddContactDrawerOpen, loadContacts, contactToEdit, handleChangeContactToEdit } =
        useContext(WhoIsListeningContext);

    const [isCreatingContact, setIsCreatingContact] = useState(false);
    const [avatarFileName, setAvatarFileName] = useState(contactToEdit?.avatar_filename || '');
    const [avatarImage, setAvatarImage] = useState<File | null>(null);

    const methods = useForm<ContactForm>({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        methods.setValue('name', contactToEdit?.name || '');
        methods.setValue('phone_number', contactToEdit?.phone_number || '');
        methods.setValue('title', contactToEdit?.title || '');
        methods.setValue('email', contactToEdit?.email || '');
        methods.setValue('address', contactToEdit?.address || '');
        methods.setValue('bio', contactToEdit?.bio || '');
    }, [contactToEdit]);

    const { handleSubmit } = methods;

    const handleUploadAvatarImage = async () => {
        if (!avatarImage) {
            return avatarFileName;
        }
        try {
            const savedDocumentDetails = await saveDocument(avatarImage, { filename: avatarImage.name });
            return savedDocumentDetails?.uniquefilename || '';
        } catch (error) {
            console.log(error);
            throw new Error('Error occurred during avatar image upload');
        }
    };

    const updateContact = async (data: ContactForm) => {
        if (contactToEdit) {
            const uploadedAvatarImageFileName = await handleUploadAvatarImage();
            const contactUpdatesToPatch = updatedDiff(contactToEdit, {
                ...data,
                avatar_filename: uploadedAvatarImageFileName,
            }) as PatchContactRequest;

            await patchContact({
                ...contactUpdatesToPatch,
                id: contactToEdit.id,
            });

            handleChangeContactToEdit(null);
            dispatch(openNotification({ severity: 'success', text: 'Contact was successfully updated' }));
        }
    };

    const createContact = async (data: ContactForm) => {
        const uploadedAvatarImageFileName = await handleUploadAvatarImage();
        await postContact({
            ...data,
            avatar_filename: uploadedAvatarImageFileName,
        });
        dispatch(openNotification({ severity: 'success', text: 'A new contact was successfully added' }));
    };

    const saveContact = async (data: ContactForm) => {
        if (contactToEdit) {
            return updateContact(data);
        }
        return createContact(data);
    };

    const onSubmit: SubmitHandler<ContactForm> = async (data: ContactForm) => {
        try {
            setIsCreatingContact(true);
            await saveContact(data);
            await loadContacts();
            setIsCreatingContact(false);
            handleAddContactDrawerOpen(false);
        } catch (err) {
            console.log(err);
            dispatch(openNotification({ severity: 'error', text: 'An error occured while trying to save contact' }));
            setIsCreatingContact(false);
        }
    };

    const handleAddAvatarImage = (files: File[]) => {
        if (files.length > 0) {
            setAvatarImage(files[0]);
            return;
        }

        setAvatarImage(null);
        setAvatarFileName('');
    };

    return (
        <Drawer
            anchor="right"
            open={addContactDrawerOpen}
            onClose={() => {
                handleAddContactDrawerOpen(false);
                handleChangeContactToEdit(null);
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
                            <MetHeader3 bold>{contactToEdit ? 'Edit' : 'Add'} Contact</MetHeader3>
                            <Divider sx={{ marginTop: '1em' }} />
                        </Grid>
                        <Grid item xs={12} lg={4}>
                            <MetLabel sx={{ marginBottom: '2px' }}>Profile Picture</MetLabel>
                            <ImageUpload
                                data-testid="contact/image-upload"
                                handleAddFile={handleAddAvatarImage}
                                savedImageUrl={contactToEdit?.avatar_url || ''}
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
