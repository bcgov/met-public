import { Grid, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { TextField } from 'components/common/Input';
import { AuthoringTemplateOutletContext } from './types';
import { colors, Palette } from 'styles/Theme';
import { EyebrowText as FormDescriptionText } from 'components/common/Typography';
import { MetLabel, MetHeader3, MetLabel as MetBigLabel } from 'components/common';
import { Button } from 'components/common/Input';
import { RichTextArea } from 'components/common/Input/RichTextArea';
import { EditorState } from 'draft-js';

const AuthoringBanner = () => {
    const {
        setValue, // Optional form control prop
        watch, // Optional form control prop
        control, // Optional form control prop
        engagement, // Engagement for populating values
    }: AuthoringTemplateOutletContext = useOutletContext(); // Access the form functions and values from the authoring template

    const [editorState, setEditorState] = useState<EditorState>();
    const [bodyText, setBodyText] = useState('');
    const [currentWidget, setCurrentWidget] = useState('');

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
        boxShadow: '0 0 0 1px #7A7876 inset',
        lineHeight: '1.4375em',
        height: '48px',
        marginTop: '8px',
        padding: '0',
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
    const buttonStyles = {
        height: '2.6rem',
        borderRadius: '8px',
        border: 'none',
        padding: '0 1rem',
        minWidth: '8.125rem',
        fontSize: '0.9rem',
    };

    const toolbar = {
        options: ['inline', 'list', 'link', 'blockType', 'history'],
        inline: {
            options: ['bold', 'italic', 'underline', 'superscript', 'subscript'],
        },
        blockType: { options: ['Normal', 'H2', 'H3', 'Blockquote'] },
        list: { options: ['unordered', 'ordered'] },
    };

    const handleWidgetSelectChange = (event: SelectChangeEvent<string>) => {
        const newWidgetValue = event.target.value;
        setCurrentWidget(newWidgetValue);
    };

    const handleEditorChange = (newEditorState: EditorState) => {
        const plainText = newEditorState.getCurrentContent().getPlainText();
        setEditorState(newEditorState);
        setBodyText(plainText);
    };

    return (
        <Grid container sx={{ maxWidth: '700px', mt: '1rem' }} direction="column">
            <Grid sx={{ ...formItemContainerStyles, backgroundColor: colors.surface.blue[10] }} item>
                <label htmlFor="section_heading">
                    <MetBigLabel style={metBigLabelStyles}>
                        Section Heading
                        <span style={{ fontWeight: 'normal' }}> (Required)</span>
                    </MetBigLabel>
                    <FormDescriptionText style={formDescriptionTextStyles}>
                        Your section heading should be descriptive, short and succinct.
                    </FormDescriptionText>
                    <TextField
                        sx={{ backgroundColor: colors.surface.white }}
                        id="section_heading"
                        counter
                        maxLength={60}
                        placeholder="Section heading text"
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
                        Your section heading should be descriptive, short and succinct.
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

            <Grid sx={{ mt: '1rem' }} item>
                <MetHeader3 style={metHeader3Styles}>Supporting Content (Optional)</MetHeader3>
                <FormDescriptionText style={formDescriptionTextStyles}>
                    You may use a widget to add supporting content to your primary content.
                </FormDescriptionText>
            </Grid>

            <Grid item>
                <label htmlFor="widget_select">
                    <MetLabel style={metLabelStyles}>Widgets</MetLabel>
                    <Select
                        sx={{ ...conditionalSelectStyles, maxWidth: '300px' }}
                        id="widget_select"
                        onChange={handleWidgetSelectChange}
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
                    onClick={() => '' !== currentWidget && setCurrentWidget('')}
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

export default AuthoringBanner;
