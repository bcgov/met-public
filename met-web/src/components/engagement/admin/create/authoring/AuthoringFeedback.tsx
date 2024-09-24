import { Grid, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { EyebrowText as FormDescriptionText } from 'components/common/Typography';
import { colors, MetLabel, MetHeader3, MetLabel as MetBigLabel } from 'components/common';
import { Button, TextField } from 'components/common/Input';
import { RichTextArea } from 'components/common/Input/RichTextArea';
import { EditorState } from 'draft-js';
import React, { useState } from 'react';
import { Palette } from 'styles/Theme';

const AuthoringFeedback = () => {
    const [sectionHeading, setSectionHeading] = useState('');
    // const [bodyText, setBodyText] = useState('');
    const [editorState, setEditorState] = useState<EditorState>();
    const [surveyButtonText, setSurveyButtonText] = useState('');
    const [thirdPartyCtaText, setThirdPartyCtaText] = useState('');
    const [thirdPartyCtaLink, setThirdPartyCtaLink] = useState('');
    const [currentWidget, setCurrentWidget] = useState('');

    // Define the styles
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
    const formItemContainerStyles = {
        padding: '2rem 1.4rem !important',
        margin: '1rem 0',
        borderRadius: '16px',
    };
    const metLabelStyles = {
        fontSize: '0.95rem',
    };
    const buttonStyles = {
        height: '2.6rem',
        borderRadius: '8px',
        border: 'none',
        padding: '0 1rem',
        minWidth: '8.125rem',
        fontSize: '0.9rem',
    };
    const widgetPreviewStyles = {
        margin: '2rem 4rem 4rem',
        display: 'flex',
        minHeight: '18rem',
        border: '2px dashed rgb(122, 120, 118)',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '16px',
    };
    const conditionalSelectStyles = {
        width: '100%',
        backgroundColor: colors.surface.white,
        borderRadius: '8px',
        boxShadow: '0 0 0 1px #7A7876 inset',
        lineHeight: '1.4375em',
        height: '48px',
        marginTop: '8px',
        padding: '0',
    };
    const toolbar = {
        options: ['inline', 'list', 'link', 'blockType', 'history'],
        inline: {
            options: ['bold', 'italic', 'underline', 'superscript', 'subscript'],
        },
        blockType: { options: ['Normal', 'H2', 'H3', 'Blockquote'] },
        list: { options: ['unordered', 'ordered'] },
    };

    const handleEditorChange = (newEditorState: EditorState) => {
        setEditorState(newEditorState);
        // const plainText = newEditorState.getCurrentContent().getPlainText();
        // setBodyText(plainText);
    };

    const handleWidgetChange = (event: SelectChangeEvent<string>) => {
        setCurrentWidget(event.target.value);
    };

    const handleRemoveWidget = () => {
        if ('' === currentWidget) {
            return;
        } else {
            setCurrentWidget('');
        }
    };

    return (
        <Grid container sx={{ maxWidth: '700px', mt: '1rem' }} direction="column">
            <Grid item sx={{ mt: '1rem' }}>
                <MetHeader3 style={metHeader3Styles}>Primary Content (Required)</MetHeader3>
                <FormDescriptionText style={formDescriptionTextStyles}>
                    This section of content should provide a brief overview of what your engagement is about and what
                    you would like your audience to do.
                </FormDescriptionText>
            </Grid>

            <Grid sx={{ ...formItemContainerStyles, backgroundColor: colors.surface.blue[10] }} item>
                <label htmlFor="section_heading">
                    <MetBigLabel style={metBigLabelStyles}>
                        Section Heading <span style={{ fontWeight: 'normal' }}>(Required)</span>
                    </MetBigLabel>
                    <FormDescriptionText style={formDescriptionTextStyles}>
                        Your section heading should be descriptive, short and succinct.
                    </FormDescriptionText>
                    <TextField
                        sx={{ backgroundColor: colors.surface.white }}
                        value={sectionHeading}
                        id="section_heading"
                        counter
                        maxLength={60}
                        placeholder="Section heading message"
                        onChange={(value) => {
                            setSectionHeading(value);
                        }}
                    />
                </label>
            </Grid>

            <Grid sx={{ ...formItemContainerStyles, backgroundColor: colors.surface.blue[10] }} item>
                <label htmlFor="body_copy">
                    <MetBigLabel style={metBigLabelStyles}>
                        Body Copy
                        <span style={{ fontWeight: 'normal' }}> (Required)</span>
                    </MetBigLabel>
                    <FormDescriptionText style={formDescriptionTextStyles}>
                        You must either include links to your engagement feedback methods within this section’s body
                        copy using the link button in the WSIWYG editor below, or, Call to Action Buttons in the
                        following two fields.
                    </FormDescriptionText>
                    <RichTextArea
                        spellCheck
                        editorState={editorState}
                        onEditorStateChange={handleEditorChange}
                        handlePastedText={() => false}
                        editorStyle={{
                            height: '15em',
                            padding: '1em',
                            resize: 'vertical',
                            backgroundColor: colors.surface.white,
                        }}
                        toolbar={toolbar}
                    />
                </label>
            </Grid>

            <Grid sx={{ ...formItemContainerStyles, backgroundColor: colors.surface.gray[10] }} item>
                <label htmlFor="survey_button_text">
                    <MetBigLabel style={metBigLabelStyles}>
                        Survey Call to Action Button <span style={{ fontWeight: 'normal' }}>(Optional)</span>
                    </MetBigLabel>
                    <FormDescriptionText style={formDescriptionTextStyles}>
                        This is the button that will link to your engagement's Survey feedback method. You should use
                        short, action oriented text.
                    </FormDescriptionText>
                    <TextField
                        sx={{ backgroundColor: colors.surface.white }}
                        value={surveyButtonText}
                        id="survey_button_text"
                        counter
                        maxLength={60}
                        placeholder="https://"
                        onChange={(value) => {
                            setSurveyButtonText(value);
                        }}
                    />
                </label>
            </Grid>

            <Grid sx={{ ...formItemContainerStyles, backgroundColor: colors.surface.gray[10] }} item>
                <label htmlFor="third_party_cta">
                    <MetBigLabel style={metBigLabelStyles}>
                        3rd Party Call to Action Button <span style={{ fontWeight: 'normal' }}>(Optional)</span>
                    </MetBigLabel>
                    <FormDescriptionText style={formDescriptionTextStyles}>
                        This is the button that will link to your engagement's <strong>3rd Party</strong> feedback
                        method. You should use short, action oriented text.
                    </FormDescriptionText>
                    <MetLabel style={metLabelStyles}>Primary CTA (Button) Text</MetLabel>
                    <TextField
                        sx={{ backgroundColor: colors.surface.white }}
                        value={thirdPartyCtaText}
                        id="third_party_cta"
                        counter
                        maxLength={20}
                        placeholder="3rd Party button text"
                        onChange={(value) => {
                            setThirdPartyCtaText(value);
                        }}
                    />
                </label>
                <label htmlFor="third_party_cta_link">
                    <MetLabel style={metLabelStyles}>URL</MetLabel>
                    <TextField
                        sx={{ backgroundColor: colors.surface.white }}
                        value={thirdPartyCtaLink}
                        id="third_party_cta_link"
                        placeholder="3rd Party button text"
                        onChange={(value) => {
                            setThirdPartyCtaLink(value);
                        }}
                    />
                </label>
            </Grid>

            <Grid item sx={{ mt: '1rem' }}>
                <MetHeader3 style={metHeader3Styles}>Supporting Content (Optional)</MetHeader3>
                <FormDescriptionText style={formDescriptionTextStyles}>
                    You may use a widget to add supporting content to your primary content. On large screens this
                    content will be displayed to the right of your primary content. On small screens this content will
                    be displayed below your primary content.
                </FormDescriptionText>
            </Grid>

            <Grid item>
                <label htmlFor="widget_select">
                    <MetLabel style={metLabelStyles}>Widgets</MetLabel>
                    <Select
                        sx={{ ...conditionalSelectStyles, maxWidth: '300px' }}
                        id="widget_select"
                        onChange={handleWidgetChange}
                        value={currentWidget}
                    >
                        <MenuItem value="Video">Video</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </Select>
                </label>
            </Grid>

            <Grid
                sx={{
                    ...formItemContainerStyles,
                    backgroundColor: colors.surface.blue[10],
                    border: '2px dashed rgb(122, 120, 118)',
                    minHeight: '33rem',
                }}
                item
            >
                <MetLabel style={{ minHeight: '1.5rem' }}>
                    {currentWidget} {currentWidget && 'Widget'}
                </MetLabel>
                <Grid xs={12} sx={widgetPreviewStyles} item>
                    {/* todo: show a preview of the widget here */}
                    Widget Preview
                </Grid>
                <Button
                    name="edit_widget"
                    id="edit_widget"
                    sx={{
                        ...buttonStyles,
                        background: Palette.primary.main,
                        color: colors.surface.white,
                        marginRight: '1rem',
                        '&:hover': {
                            background: Palette.primary.main,
                            color: colors.surface.white,
                        },
                        // todo: Hook up the widget edit modal dialog to this button
                    }}
                >
                    Edit Widget
                </Button>
                <Button
                    name="remove_widget"
                    id="remove_widget"
                    onClick={handleRemoveWidget}
                    sx={{
                        ...buttonStyles,
                        boxShadow: '0 0 0 1px #7A7876 inset',
                    }}
                >
                    Remove Widget
                </Button>
            </Grid>
        </Grid>
    );
};

export default AuthoringFeedback;
