import { FormControlLabel, Grid, MenuItem, Radio, RadioGroup, Select } from '@mui/material';
import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { TextField } from 'components/common/Input';
import { AuthoringTemplateOutletContext } from './types';
import { colors } from 'styles/Theme';
import { EyebrowText as FormDescriptionText } from 'components/common/Typography';
import { MetLabel, MetHeader3, MetLabel as MetBigLabel } from 'components/common';
import ImageUpload from 'components/imageUpload';

const ENGAGEMENT_UPLOADER_HEIGHT = '360px';
const ENGAGEMENT_CROPPER_ASPECT_RATIO = 1920 / 700;

const AuthoringBanner = () => {
    const { engagement }: AuthoringTemplateOutletContext = useOutletContext(); // Access the form functions and values from the authoring template

    const [bannerImage, setBannerImage] = useState<File | null>();
    const [savedBannerImageFileName, setSavedBannerImageFileName] = useState(engagement.banner_filename || '');

    const [openCtaExternalURLEnabled, setOpenCtaExternalURLEnabled] = useState(false);
    const [openCtaSectionSelectEnabled, setOpenCtaSectionSelectEnabled] = useState(true);
    const [viewResultsCtaExternalURLEnabled, setViewResultsCtaExternalURLEnabled] = useState(false);
    const [viewResultsSectionSelectEnabled, setViewResultsSectionSelectEnabled] = useState(true);

    //Define the styles
    const metBigLabelStyles = {
        fontSize: '1.05rem',
        marginBottom: '0.7rem',
        lineHeight: 1.167,
        color: '#292929',
        fontWeight: '700',
    };
    const metHeader3Styles = {
        fontSize: '1.05rem',
        marginBottom: '0.7rem',
    };
    const formDescriptionTextStyles = {
        fontSize: '0.9rem',
        marginBottom: '1.5rem',
    };
    const metLabelStyles = {
        fontSize: '0.95rem',
    };
    const formItemContainerStyles = {
        padding: '2rem 1.4rem !important',
        margin: '1rem 0',
        borderRadius: '16px',
    };
    const conditionalSelectStyles = {
        width: '100%',
        backgroundColor: colors.surface.white,
        borderRadius: '8px',
        // boxShadow: '0 0 0 1px #7A7876 inset',
        lineHeight: '1.4375em',
        height: '48px',
        marginTop: '8px',
        padding: '0',
        '&:disabled': {
            boxShadow: 'none',
        },
    };

    const handleAddBannerImage = (files: File[]) => {
        if (files.length > 0) {
            setBannerImage(files[0]);
            return;
        }
        setBannerImage(null);
        setSavedBannerImageFileName('');
    };

    const handleRadioSelectChange = (event: React.FormEvent<HTMLInputElement>, source: string) => {
        const newRadioValue = event.currentTarget.value;
        if ('ctaLinkType' === source) {
            setOpenCtaExternalURLEnabled('section' === newRadioValue ? false : true);
            setOpenCtaSectionSelectEnabled('section' === newRadioValue ? true : false);
        } else {
            setViewResultsCtaExternalURLEnabled('section' === newRadioValue ? false : true);
            setViewResultsSectionSelectEnabled('section' === newRadioValue ? true : false);
        }
    };

    return (
        <Grid container sx={{ maxWidth: '700px', mt: '1rem' }} direction="column">
            <Grid sx={{ ...formItemContainerStyles, backgroundColor: colors.surface.blue[10] }} item>
                <label htmlFor="name">
                    <MetBigLabel style={metBigLabelStyles}>
                        Engagement Title <span style={{ fontWeight: 'normal' }}>(Required)</span>
                    </MetBigLabel>
                    <FormDescriptionText style={formDescriptionTextStyles}>
                        This is the title that will display for your engagement and should be descriptive, short and
                        succinct.
                    </FormDescriptionText>
                    <MetLabel style={metLabelStyles}>Title</MetLabel>
                    <TextField
                        sx={{ backgroundColor: colors.surface.white }}
                        id="name"
                        counter
                        maxLength={60}
                        placeholder="Engagement title"
                    />
                </label>
            </Grid>

            <Grid sx={{ ...formItemContainerStyles, backgroundColor: colors.surface.gray[10] }} item>
                <label htmlFor="eyebrow">
                    <MetBigLabel style={metBigLabelStyles}>
                        Eyebrow Text <span style={{ fontWeight: 'normal' }}>(Optional)</span>
                    </MetBigLabel>
                    <FormDescriptionText style={formDescriptionTextStyles}>
                        If your audience will need additional context to interpret the topic of your engagement or, it
                        is important for them to understand who, within BC Gov, is requesting feedback, you may wish to
                        add two to five words of eyebrow text.
                    </FormDescriptionText>
                    <MetLabel style={metLabelStyles}>Eyebrow</MetLabel>
                    <TextField
                        sx={{ backgroundColor: colors.surface.white }}
                        id="eyebrow"
                        counter
                        maxLength={40}
                        placeholder="Eyebrow text"
                    />
                </label>
            </Grid>

            <Grid sx={{ ...formItemContainerStyles, backgroundColor: colors.surface.blue[10] }} item>
                <MetBigLabel style={metBigLabelStyles}>
                    Hero Image <span style={{ fontWeight: 'normal' }}>(Required)</span>
                </MetBigLabel>
                <FormDescriptionText style={formDescriptionTextStyles}>
                    Please ensure you use high quality images that help to communicate the topic of your engagement. You
                    must ensure that any important subject matter is positioned on the right side.
                </FormDescriptionText>
                <ImageUpload
                    margin={4}
                    data-testid="engagement-form/image-upload"
                    handleAddFile={handleAddBannerImage}
                    savedImageUrl={engagement.banner_url}
                    savedImageName={engagement.banner_filename}
                    height={ENGAGEMENT_UPLOADER_HEIGHT}
                    cropAspectRatio={ENGAGEMENT_CROPPER_ASPECT_RATIO}
                />
            </Grid>

            <Grid item sx={{ mt: '1rem' }}>
                <MetHeader3 style={metHeader3Styles}>Engagement State Content Variants</MetHeader3>
                <FormDescriptionText style={formDescriptionTextStyles}>
                    The content in this section of your engagement may be changed based on the state or status of your
                    engagement. Select the Section Preview or Page Preview button to see each of these states.
                </FormDescriptionText>
            </Grid>

            <Grid sx={{ ...formItemContainerStyles, backgroundColor: colors.surface.gray[10] }} item>
                <label htmlFor="message_text">
                    <MetBigLabel style={metBigLabelStyles}>
                        "Upcoming" State Message Text <span style={{ fontWeight: 'normal' }}>(Optional)</span>
                    </MetBigLabel>
                    <FormDescriptionText style={formDescriptionTextStyles}>
                        If you are going to publish your engagement before it is “Open”, you may add message text to
                        your hero banner advising your engagement audience to come back later to provide feedback.
                    </FormDescriptionText>
                    <MetLabel style={metLabelStyles}>Message Text</MetLabel>
                    <TextField
                        sx={{ backgroundColor: colors.surface.white }}
                        id="message_text"
                        counter
                        maxLength={20}
                        placeholder="Message text"
                    />
                </label>
            </Grid>

            <Grid sx={{ ...formItemContainerStyles, backgroundColor: colors.surface.blue[10] }} item>
                <label htmlFor="cta_button_text">
                    <MetBigLabel style={metBigLabelStyles}>
                        "Open" State Primary CTA <span style={{ fontWeight: 'normal' }}>(Required)</span>
                    </MetBigLabel>
                    <FormDescriptionText style={formDescriptionTextStyles}>
                        When your engagement is open the Primary CTA (button) in your engagement's hero banner should
                        link to the most important action you want your engagement audience to take. Enter text for the
                        Primary CTA (button) below and then indicate where you would like it to link to.
                    </FormDescriptionText>
                    <MetLabel style={metLabelStyles}>Primary CTA (Button) Text</MetLabel>
                    <TextField
                        sx={{ backgroundColor: colors.surface.white }}
                        id="cta_button_text"
                        counter
                        maxLength={20}
                        placeholder="Call-to-action button text"
                    />
                </label>
                <label htmlFor="cta_link_type">
                    <RadioGroup
                        row
                        id="cta_link_radio"
                        name="cta_link_radio"
                        defaultValue="section"
                        sx={{ flexWrap: 'nowrap' }}
                        onChange={(event) => handleRadioSelectChange(event, 'ctaLinkType')}
                    >
                        <Grid item xs={6} direction="column" sx={{ paddingRight: '2rem' }}>
                            <FormControlLabel value="section" control={<Radio />} label="In-Page Section Link" />
                            <br />
                            <Select
                                disabled={!openCtaSectionSelectEnabled}
                                sx={{
                                    ...conditionalSelectStyles,
                                    boxShadow: openCtaSectionSelectEnabled ? '0 0 0 1px #7A7876 inset' : 'none',
                                }}
                                id="section_link"
                                defaultValue="provide_feedback"
                            >
                                <MenuItem value="provide_feedback">Provide Feedback Section</MenuItem>
                                <MenuItem value="other_section">Other Section</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControlLabel value="external" control={<Radio />} label="External URL" />
                            <br />
                            <TextField
                                disabled={!openCtaExternalURLEnabled}
                                sx={{ backgroundColor: colors.surface.white }}
                                id="external_link"
                                placeholder="Paste or type URL here"
                            />
                        </Grid>
                    </RadioGroup>
                </label>
            </Grid>

            <Grid sx={{ ...formItemContainerStyles, backgroundColor: colors.surface.gray[10] }} item>
                <label htmlFor="message_text">
                    <MetBigLabel style={metBigLabelStyles}>
                        "Closed" (Results Pending) State Message Text{' '}
                        <span style={{ fontWeight: 'normal' }}>(Optional)</span>
                    </MetBigLabel>
                    <FormDescriptionText style={formDescriptionTextStyles}>
                        When your engagement is closed, you may wish to add message text to your hero banner advising
                        your engagement audience to come back later to view the results of your engagement.
                    </FormDescriptionText>
                    <MetLabel style={metLabelStyles}>Message Text</MetLabel>
                    <TextField
                        sx={{ backgroundColor: colors.surface.white }}
                        id="message_text"
                        counter
                        maxLength={20}
                        placeholder="Engagement closed message"
                    />
                </label>
            </Grid>

            <Grid sx={{ ...formItemContainerStyles, backgroundColor: colors.surface.gray[10] }} item>
                <label htmlFor="cta_button_text">
                    <MetBigLabel style={metBigLabelStyles}>
                        "View Results" State Primary CTA <span style={{ fontWeight: 'normal' }}>(Optional)</span>
                    </MetBigLabel>
                    <FormDescriptionText style={formDescriptionTextStyles}>
                        If you will be publishing the results of your engagement, you can use the primary CTA in your
                        hero banner do direct your engagement audience to those results. You may link to results
                        published within this engagement, or enter a URL to an external web page.
                    </FormDescriptionText>
                    <MetLabel style={metLabelStyles}>Button (Primary CTA) Text</MetLabel>
                    <TextField
                        sx={{ backgroundColor: colors.surface.white }}
                        id="cta_button_text"
                        counter
                        maxLength={20}
                        placeholder="View results text"
                    />
                </label>
                <label htmlFor="cta_link_type">
                    <RadioGroup
                        row
                        id="cta_view_results_radio"
                        name="cta_view_results_radio"
                        defaultValue="section"
                        sx={{ flexWrap: 'nowrap' }}
                        onChange={(event) => handleRadioSelectChange(event, 'ctaViewResultsType')}
                    >
                        <Grid item xs={6} direction="column" sx={{ paddingRight: '2rem' }}>
                            <FormControlLabel value="section" control={<Radio />} label="In-Page Section Link" />
                            <br />
                            <Select
                                disabled={!viewResultsSectionSelectEnabled}
                                sx={{
                                    ...conditionalSelectStyles,
                                    boxShadow: viewResultsSectionSelectEnabled ? '0 0 0 1px #7A7876 inset' : 'none',
                                }}
                                id="view_results_link"
                                defaultValue="results_section"
                            >
                                <MenuItem value="results_section">Results Section</MenuItem>
                                <MenuItem value="other_section">Other Section</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControlLabel value="external" control={<Radio />} label="External URL" />
                            <br />
                            <TextField
                                disabled={!viewResultsCtaExternalURLEnabled}
                                sx={{ backgroundColor: colors.surface.white }}
                                id="view_results_link"
                                placeholder="Paste or type URL here"
                            />
                        </Grid>
                    </RadioGroup>
                </label>
            </Grid>
        </Grid>
    );
};

export default AuthoringBanner;
