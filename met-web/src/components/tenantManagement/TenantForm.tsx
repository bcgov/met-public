import React, { useEffect, useState } from 'react';
import { Box, FormGroup } from '@mui/material';
import { Button, TextAreaField, TextField } from 'components/common/Input';
import { DetailsContainer, Detail } from 'components/common/Layout';
import { BodyText } from 'components/common/Typography/';
import ImageUpload from 'components/imageUpload';
import { createTenant } from 'services/tenantService';
import { Tenant } from 'models/tenant';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useAppDispatch } from 'hooks';
import { useNavigate } from 'react-router-dom';
import { saveObject } from 'services/objectStorageService';
import { UploadGuidelines } from 'components/imageUpload/UploadGuidelines';

export const TenantForm = ({ tenant }: { tenant?: Tenant }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [bannerImage, setBannerImage] = useState<File | null>();
    const [savedBannerImageFileName, setSavedBannerImageFileName] = useState(tenant?.logo_url || '');

    const { handleSubmit, formState, control, reset, setValue } = useForm<Tenant>({
        defaultValues: {
            ...(tenant || {
                name: '',
                contact_name: '',
                contact_email: '',
                short_name: '',
                title: '',
                description: '',
                logo_url: '',
                logo_credit: '',
                logo_description: '',
            }),
        },
        mode: 'onBlur',
        reValidateMode: 'onChange',
    });
    const { isDirty, isValid, errors } = formState;

    useEffect(() => {
        reset({
            ...(tenant || {
                name: '',
                contact_name: '',
                contact_email: '',
                short_name: '',
                title: '',
                description: '',
                logo_url: '',
                logo_credit: '',
                logo_description: '',
            }),
        });
        setBannerImage(null);
        setSavedBannerImageFileName(tenant?.logo_url || '');
        setValue('logo_url', tenant?.logo_url || '');
    }, [tenant, reset]);

    const handleAddHeroImage = (files: File[]) => {
        if (files.length > 0) {
            setBannerImage(files[0]);
            setSavedBannerImageFileName(files[0].name);
            return;
        }

        setBannerImage(null);
        setSavedBannerImageFileName('');
        setValue('logo_url', '');
    };

    const handleUploadHeroImage = async () => {
        if (!bannerImage) {
            return savedBannerImageFileName;
        }
        try {
            const savedDocumentDetails = await saveObject(bannerImage, { filename: bannerImage.name });
            return savedDocumentDetails?.uniquefilename || '';
        } catch (error) {
            console.log(error);
            throw new Error('Error occurred during banner image upload');
        }
    };

    const onSubmit: SubmitHandler<Tenant> = async (data, event) => {
        if (Object.keys(errors).length || !isValid) {
            dispatch(
                openNotification({ text: 'Please correct the highlighted errors before saving.', severity: 'error' }),
            );
            return false;
        }
        try {
            data.logo_url = await handleUploadHeroImage();
            await createTenant(data);
            dispatch(openNotification({ text: 'Tenant created successfully!', severity: 'success' }));
            navigate('../tenantadmin');
        } catch (error) {
            dispatch(openNotification({ text: 'Unknown error while creating tenant', severity: 'error' }));
            console.error(error);
        }
    };

    const handleKeys = (event: React.KeyboardEvent) => {
        // Handle as many key combinations as possible
        if ((event.ctrlKey || event.metaKey || event.altKey) && event.key === 'Enter') {
            event.nativeEvent.stopImmediatePropagation();
            event.preventDefault(); // Prevent default to stop any native form submission
            handleSubmit(onSubmit)();
        }
    };

    return (
        <DetailsContainer
            sx={{
                maxWidth: '1000px',
                margin: {
                    // on small screens, negate the padding of the ResponsiveContainer
                    // so the container hugs the edge of the screen
                    xs: '0 -16px',
                    sm: '0',
                },
            }}
        >
            <FormGroup onKeyDown={handleKeys}>
                <Detail>
                    <Controller
                        name="name"
                        control={control}
                        rules={{
                            required: true,
                            maxLength: { value: 30, message: 'This name is too long!' },
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                title="Tenant Instance Name"
                                instructions="The name of the tenant instance"
                                placeholder="Name"
                                error={errors.name?.message}
                                clearable
                                required
                                counter
                                maxLength={30}
                            />
                        )}
                    />
                </Detail>
                <Detail>
                    <Controller
                        name="contact_name"
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                title="Primary Contact Name"
                                instructions="Who should people contact about this tenant instance?"
                                placeholder="Full Name"
                                error={errors.contact_name?.message}
                                clearable
                                required
                            />
                        )}
                    />
                </Detail>
                <Detail>
                    <Controller
                        name="contact_email"
                        control={control}
                        rules={{
                            required: true,
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "That doesn't look like a valid email...",
                            },
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                error={errors.contact_email?.message}
                                required
                                clearable
                                autoComplete="email"
                                title="Primary Contact Email"
                                instructions="Where should people send emails about this tenant instance?"
                                placeholder="Email"
                            />
                        )}
                    />
                </Detail>
                <Detail>
                    <Controller
                        name="short_name"
                        control={control}
                        rules={{
                            required: true,
                            pattern: { value: /^[a-zA-Z0-9_-]+$/, message: 'Your input contains invalid symbols' },
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                required
                                error={errors.short_name?.message}
                                title="Tenant Short Name (URL)"
                                instructions="Must be unique. Letters, underscores and dashes only are permitted."
                                placeholder="shortname"
                                startAdornment={
                                    <BodyText bold sx={{ mr: '-8px' }}>
                                        met.gov.bc.ca/
                                    </BodyText>
                                }
                            />
                        )}
                    />
                </Detail>
                <Detail>
                    <Controller
                        name="title"
                        control={control}
                        rules={{
                            required: true,
                            maxLength: { value: 60, message: 'This input is too long!' },
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                required
                                error={errors.title?.message}
                                clearable
                                title="Hero Banner Title"
                                instructions="The title that appears on top of the hero banner"
                                placeholder="Title"
                                counter
                                maxLength={60}
                            />
                        )}
                    />
                </Detail>
                <Detail>
                    <Controller
                        name="description"
                        control={control}
                        rules={{
                            required: true,
                            maxLength: { value: 160, message: 'This input is too long!' },
                        }}
                        render={({ field }) => (
                            <TextAreaField
                                {...field}
                                error={errors.description?.message}
                                required
                                clearable
                                title="Hero Banner Description"
                                instructions="The text that appears below the title on the hero banner"
                                placeholder="Description"
                                counter
                                maxLength={160}
                            />
                        )}
                    />
                </Detail>
                <Detail sx={{ padding: '16px 24px' }}>
                    <BodyText bold size="large">
                        Hero Banner Image
                    </BodyText>
                    <BodyText size="small">
                        If you do not add a hero banner image, a default image will be used.
                    </BodyText>
                    <br />
                    <BodyText bold sx={{ color: '#464341' }}>
                        Image Guidance
                    </BodyText>
                    <BodyText size="small">
                        The image you upload will be displayed at the top of your home page as a decorative element
                        behind the page title and description. When choosing an image keep in mind that much of the left
                        side of your image will be covered by this text and will not be visible.
                    </BodyText>
                    <br />
                    <UploadGuidelines />
                    <Box width="100%" mt="2em" mb="2em">
                        <ImageUpload
                            margin={4}
                            data-testid="engagement-form/image-upload"
                            handleAddFile={handleAddHeroImage}
                            savedImageUrl={savedBannerImageFileName}
                            savedImageName={savedBannerImageFileName}
                            height="200px"
                            cropAspectRatio={1920 / 700}
                        />
                    </Box>
                    <Controller
                        name="logo_credit"
                        control={control}
                        rules={{ maxLength: { value: 60, message: 'This input is too long!' } }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                error={errors.logo_credit?.message}
                                optional
                                clearable
                                counter
                                maxLength={60}
                                title="Image Credit"
                                instructions="Who should be credited for this image?"
                            />
                        )}
                    />
                    <Controller
                        name="logo_description"
                        control={control}
                        rules={{ maxLength: { value: 80, message: 'This input is too long!' } }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                error={errors.logo_description?.message}
                                optional
                                clearable
                                counter
                                maxLength={80}
                                title="Image Description"
                                instructions="An accessible description of the image"
                            />
                        )}
                    />
                </Detail>
                <Detail invisible sx={{ flexDirection: 'row', gap: '24px' }}>
                    <Button disabled={!isDirty || !isValid} onClick={handleSubmit(onSubmit)} variant="primary">
                        Create Tenant
                    </Button>
                    <Button variant="secondary" onClick={() => navigate('../tenantadmin')}>
                        Cancel
                    </Button>
                </Detail>
            </FormGroup>
        </DetailsContainer>
    );
};
