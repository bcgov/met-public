import React, { useState } from 'react';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Grid } from '@mui/material';
import { Button, TextAreaField, TextField } from 'components/common/Input';
import { ResponsiveContainer, DetailsContainer, Detail } from 'components/common/Layout';
import { Header1, Header2, BodyText } from 'components/common/Typography/';
import { BreadcrumbTrail } from 'components/common/Navigation';
import { useAppDispatch } from 'hooks';
import ImageUpload from 'components/imageUpload';
import { createTenant } from 'services/tenantService';
import { Tenant } from 'models/tenant';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useNavigate } from 'react-router-dom';

const TenantCreationPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const checkIcon = <FontAwesomeIcon icon={faCheck} style={{ marginRight: '8px', fontSize: '18px' }} />;
    const xIcon = <FontAwesomeIcon icon={faXmark} style={{ marginRight: '8px', fontSize: '18px' }} />;

    const methods = useForm<Tenant>({
        defaultValues: {
            name: '',
            short_name: '',
            contact_name: '',
            contact_email: '',
            title: '',
            description: '',
            logo_url: '',
            logo_credit: '',
            logo_description: '',
        },
    });

    const onSubmit: SubmitHandler<Tenant> = async (data, event) => {
        const formErrors = methods.formState.errors;
        if (Object.keys(formErrors).length) {
            dispatch(
                openNotification({ text: 'Please correct the highlighted errors before saving.', severity: 'error' }),
            );
            return false;
        }
        try {
            await createTenant(data);
            dispatch(openNotification({ text: 'Tenant created successfully!', severity: 'success' }));
            navigate('../tenantadmin');
        } catch (error) {
            dispatch(openNotification({ text: 'Unknown error while creating tenant', severity: 'error' }));
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

    const {
        handleSubmit,
        formState: { isDirty, isValid },
        control,
    } = methods;

    const handleAddHeroImage = (files: File[]) => {
        if (files.length > 0) {
            setBannerImage(files[0]);
            return;
        }

        setBannerImage(null);
        setSavedBannerImageFileName('');
    };

    const [bannerImage, setBannerImage] = useState<File | null>();
    const [savedBannerImageFileName, setSavedBannerImageFileName] = useState('');

    return (
        <ResponsiveContainer>
            <BreadcrumbTrail
                smallScreenOnly
                crumbs={[
                    { name: 'Dashboard', link: '../../home' },
                    { name: 'Tenant Admin', link: '../tenantadmin' },
                    { name: 'Create Tenant Instance' },
                ]}
            />

            <Header1>Create Tenant Instance</Header1>
            <Grid container spacing={0} direction="column" mb="0.5em">
                <Grid item xs={12}>
                    <Header2 decorated sx={{ mb: 0 }}>
                        Tenant Details
                    </Header2>
                </Grid>
                <Grid item xs={12}>
                    <BodyText size="small">* Required fields</BodyText>
                </Grid>
            </Grid>
            <DetailsContainer
                sx={{
                    maxWidth: '1000px',
                    margin: {
                        xs: '0 -16px', //offset the padding of the ResponsiveContainer
                        sm: '0',
                    },
                }}
            >
                <Detail>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                required
                                title="Tenant Instance Name"
                                instructions="The name of the tenant instance"
                                placeholder="Name"
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
                        render={({ field }) => (
                            <TextField
                                {...field}
                                required
                                title="Primary Contact Name"
                                instructions="Who should people contact about this tenant instance?"
                                placeholder="Full Name"
                            />
                        )}
                    />
                </Detail>
                <Detail>
                    <Controller
                        name="contact_email"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                required
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
                        render={({ field }) => (
                            <TextField
                                {...field}
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
                        render={({ field }) => (
                            <TextField
                                {...field}
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
                        render={({ field }) => (
                            <TextAreaField
                                {...field}
                                required
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
                    <Grid container spacing={2} direction="row" mb="0.5em">
                        <Grid item container spacing={1} xs={12} md={6} justifyContent="center" direction="column">
                            <Grid item xs component={BodyText} size="small">
                                {checkIcon} Wide images (Landscape)
                            </Grid>
                            <Grid item xs component={BodyText} size="small">
                                {checkIcon} Decorative subject matter
                            </Grid>
                            <Grid item xs component={BodyText} size="small">
                                {checkIcon} Any subject of focus is on the right
                            </Grid>
                            <Grid item xs component={BodyText} size="small">
                                {checkIcon} 2500px or more (width)
                            </Grid>
                        </Grid>
                        <Grid item container spacing={1} xs={12} md={6} justifyContent="center" direction="column">
                            <Grid item xs component={BodyText} size="small">
                                {xIcon} Tall images (Portrait)
                            </Grid>
                            <Grid item xs component={BodyText} size="small">
                                {xIcon} Informative imagery, text or logos
                            </Grid>
                            <Grid item xs component={BodyText} size="small">
                                {xIcon} Images with key elements on the left
                            </Grid>
                            <Grid item xs component={BodyText} size="small">
                                {xIcon} Less than 1500px (width)
                            </Grid>
                        </Grid>
                    </Grid>
                    <Box width="100%" mt="2em" mb="2em">
                        <ImageUpload
                            margin={4}
                            data-testid="engagement-form/image-upload"
                            handleAddFile={handleAddHeroImage}
                            savedImageUrl="https://via.placeholder.com/1200x400"
                            savedImageName="hero-banner.jpg"
                            height="200px"
                            cropAspectRatio={1920 / 700}
                        />
                    </Box>
                    <Controller
                        name="logo_credit"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                optional
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
                        render={({ field }) => (
                            <TextField
                                {...field}
                                optional
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
                    <Button variant="secondary">Cancel</Button>
                </Detail>
            </DetailsContainer>
        </ResponsiveContainer>
    );
};

export default TenantCreationPage;
