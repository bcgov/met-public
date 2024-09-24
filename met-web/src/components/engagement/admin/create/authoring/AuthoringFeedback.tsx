// import React from 'react';
// export const AuthoringFeedback = () => {
//     return <div>AuthoringFeedback</div>;
// };
// export default AuthoringFeedback;

import { Grid, IconButton, MenuItem, Select, SelectChangeEvent, Tab, Tabs } from '@mui/material';
import { EyebrowText as FormDescriptionText } from 'components/common/Typography';
import { colors, MetLabel, MetHeader3, MetLabel as MetBigLabel } from 'components/common';
import { Button, TextField } from 'components/common/Input';
import React, { SyntheticEvent, useState } from 'react';
import { RichTextArea } from 'components/common/Input/RichTextArea';
import { AuthoringTemplateOutletContext, DetailsTabProps, TabValues } from './types';
import { useOutletContext } from 'react-router-dom';
import { Palette } from 'styles/Theme';
import { Unless, When } from 'react-if';
import { TabContext, TabPanel } from '@mui/lab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/pro-regular-svg-icons';
import { EditorState } from 'draft-js';

const handleDuplicateTabNames = (newTabs: TabValues[], newTabName: string) => {
    // Will add a sequencial number suffix for up to 10 numbers if there is a duplicate, then add (copy) if none of those are available.
    for (let i = 2; i < 12; i++) {
        if (!newTabs.find((tab) => tab.heading === `${newTabName} (${i})`)) {
            return `${newTabName} (${i})`;
        }
    }
    return `${newTabName} (copy)`;
};

const AuthoringDetails = () => {
    const {
        setValue,
        contentTabsEnabled,
        tabs,
        setTabs,
        setSingleContentValues,
        setContentTabsEnabled,
        singleContentValues,
        defaultTabValues,
    }: AuthoringTemplateOutletContext = useOutletContext(); // Access the form functions and values from the authoring template
    const [currentTab, setCurrentTab] = useState(tabs[0]);

    const tabsStyles = {
        borderBottom: `2px solid ${colors.surface.gray[60]}`,
        overflow: 'hidden',
        '& .MuiTabs-flexContainer': {
            justifyContent: 'flex-start',
            width: 'max-content',
        },
    };
    const tabStyles = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '48px',
        padding: '4px 18px 2px 18px',
        fontSize: '14px',
        borderRadius: '0px 16px 0px 0px',
        border: `1px solid ${colors.surface.gray[60]}`,
        borderBottom: 'none',
        boxShadow:
            '0px 2px 5px 0px rgba(0, 0, 0, 0.12), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.20)',
        backgroundColor: 'gray.10',
        color: 'text.secondary',
        fontWeight: 'normal',
        '&.Mui-selected': {
            backgroundColor: 'primary.main',
            borderColor: 'primary.main',
            color: 'white',
            fontWeight: 'bold',
        },
        outlineOffset: '-4px',
        '&:focus-visible': {
            outline: `2px solid`,
            outlineColor: '#12508F',
            border: '4px solid',
            borderColor: '#12508F',
            padding: '0px 20px 0px 14px',
        },
    };

    const handleCloseTab = (e: React.MouseEvent, tab: TabValues) => {
        e.stopPropagation();
        const index = tabs.findIndex((t) => t.heading === tab.heading);
        if (-1 < index) {
            const newTabs = [...tabs];
            newTabs.splice(index, 1);
            if (1 === newTabs.length) {
                // If we're switching back to single content mode
                'Tab 1' !== tabs[0].heading
                    ? setSingleContentValues(tabs[0])
                    : setSingleContentValues({ ...tabs[0], heading: '' }); // If the current Section Heading is "Tab 1" then change it to a blank value.
                setTabs([tabs[0]]);
                setContentTabsEnabled('false');
            } else {
                setTabs(newTabs);
                tab === currentTab && setCurrentTab(newTabs[index - 1]); // Switch tabs if you're closing the current one
            }
        }
    };

    const handleAddTab = () => {
        const newTabs = [...tabs];
        const newTabName = 'Tab ' + (newTabs.length + 1);
        newTabs.find((tab) => newTabName === tab.heading)
            ? newTabs.push({ ...defaultTabValues, heading: handleDuplicateTabNames(newTabs, newTabName) })
            : newTabs.push({ ...defaultTabValues, heading: newTabName }); // Don't create duplicate entries
        setTabs(newTabs);
        setCurrentTab(newTabs[newTabs.length - 1]);
    };

    return (
        <Grid item sx={{ maxWidth: '700px' }} direction="column">
            <When condition={'true' === contentTabsEnabled && 1 < tabs.length}>
                <Grid sx={{ borderBottom: '1', borderColor: 'divider' }} item>
                    <TabContext
                        value={
                            tabs.find((tab) => tab.heading === currentTab.heading)
                                ? tabs[tabs.findIndex((t) => t.heading === currentTab.heading)].heading
                                : tabs[tabs.length - 1].heading
                        }
                    >
                        <Tabs
                            component="nav"
                            variant="scrollable"
                            aria-label="Admin Engagement View Tabs"
                            TabIndicatorProps={{ sx: { display: 'none' } }}
                            sx={tabsStyles}
                            value={
                                tabs.find((tab) => tab.heading === currentTab.heading)
                                    ? tabs[tabs.findIndex((t) => t.heading === currentTab.heading)].heading
                                    : tabs[tabs.length - 1].heading
                            }
                            onChange={(event: SyntheticEvent<Element, Event>, value: string) =>
                                tabs.find((tab) => tab.heading === value) &&
                                setCurrentTab(tabs[tabs.findIndex((tab) => tab.heading === value)])
                            }
                        >
                            {tabs.map((tab, key) => {
                                return (
                                    <Tab
                                        sx={tabStyles}
                                        label={
                                            <span>
                                                <span style={{ marginRight: '1rem' }}>{tab.heading}</span>
                                                <When condition={0 !== key}>
                                                    <IconButton
                                                        size="small"
                                                        component="span"
                                                        onClick={(e: React.MouseEvent) => handleCloseTab(e, tab)}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faX}
                                                            style={{
                                                                fontSize: '0.9rem',
                                                                marginTop: '-4px',
                                                                color:
                                                                    currentTab.heading === tab.heading
                                                                        ? colors.surface.white
                                                                        : Palette.text.primary,
                                                            }}
                                                        />
                                                    </IconButton>
                                                </When>
                                            </span>
                                        }
                                        key={key}
                                        value={tab.heading}
                                        disableFocusRipple
                                    />
                                );
                            })}
                            <Button
                                sx={{
                                    border: 'none !important',
                                    boxShadow: 'none !important',
                                    backgroundColor: 'transparent !important',
                                    color: '#12508F !important',
                                    fontSize: '0.9rem',
                                }}
                                onClick={() => {
                                    handleAddTab();
                                }}
                            >
                                + Add Tab
                            </Button>
                        </Tabs>
                        {tabs.map((tab, key) => {
                            return (
                                <TabPanel value={tab.heading} key={key} sx={{ padding: '1rem 0' }}>
                                    <DetailsTab
                                        // setValue={setValue}
                                        setTabs={setTabs}
                                        setCurrentTab={setCurrentTab}
                                        setSingleContentValues={setSingleContentValues}
                                        tabs={tabs}
                                        tabIndex={key}
                                        singleContentValues={singleContentValues}
                                        defaultTabValues={defaultTabValues}
                                    />
                                </TabPanel>
                            );
                        })}
                    </TabContext>
                </Grid>
            </When>
            <Unless condition={'true' === contentTabsEnabled}>
                <DetailsTab
                    // setValue={setValue}
                    setTabs={setTabs}
                    setCurrentTab={setCurrentTab}
                    setSingleContentValues={setSingleContentValues}
                    tabs={tabs}
                    tabIndex={0}
                    singleContentValues={singleContentValues}
                    defaultTabValues={defaultTabValues}
                />
            </Unless>
        </Grid>
    );
};

export default AuthoringDetails;

const DetailsTab = ({
    //    setValue,
    setTabs,
    setCurrentTab,
    setSingleContentValues,
    tabs,
    tabIndex,
    singleContentValues,
    defaultTabValues,
}: DetailsTabProps) => {
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

    const handleSectionHeadingChange = (value: string) => {
        const newHeading = value;
        if (2 > tabs.length && 0 === tabIndex) {
            // If there are no tabs
            setSingleContentValues({ ...singleContentValues, heading: newHeading });
            setTabs([{ ...defaultTabValues, heading: newHeading }]);
        } else {
            // If there are tabs
            const newTabs = [...tabs];
            newTabs[tabIndex].heading = newTabs.find((tab) => tab.heading === newHeading)
                ? handleDuplicateTabNames(newTabs, newHeading)
                : newHeading; // If the new name is the same as an existing one, rename it
            setSingleContentValues(newTabs[0]);
            setTabs([...newTabs]);
            setCurrentTab(newTabs[tabIndex]);
        }
    };

    const handleWidgetChange = (event: SelectChangeEvent<string>) => {
        const newWidget = event.target.value;
        const newTabs = [...tabs];
        newTabs[tabIndex].widget = newWidget;
        setTabs(newTabs);
    };

    const handleRemoveWidget = () => {
        if ('' === tabs[tabIndex].widget) {
            return;
        } else {
            const newTabs = [...tabs];
            newTabs[tabIndex].widget = '';
            setTabs(newTabs);
        }
    };

    const handleBodyTextChange = (newEditorState: EditorState) => {
        const plainText = newEditorState.getCurrentContent().getPlainText();
        const newTabs = [...tabs];
        newTabs[tabIndex].bodyCopyEditorState = newEditorState;
        newTabs[tabIndex].bodyCopyPlainText = plainText;
        setTabs(newTabs);
    };

    return (
        <Grid container sx={{ maxWidth: '700px', mt: '1rem' }} direction="column">
            <Grid item sx={{ mt: '1rem' }}>
                <MetHeader3 style={metHeader3Styles}>Primary Content (Required)</MetHeader3>
                <FormDescriptionText style={formDescriptionTextStyles}>
                    Primary content will display on the left two thirds of the page on large screens and full width on
                    small screens. (If you add optional supporting content in the section below, on small screens, your
                    primary content will display first (on top) followed by your supporting content (underneath).
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
                        value={1 < tabs.length ? tabs[tabIndex].heading : singleContentValues.heading}
                        id="section_heading"
                        counter
                        maxLength={60}
                        placeholder="Section heading message"
                        onChange={handleSectionHeadingChange}
                    />
                </label>
            </Grid>

            <Grid sx={{ ...formItemContainerStyles, backgroundColor: colors.surface.blue[10] }} item>
                <label htmlFor="description">
                    <MetBigLabel style={metBigLabelStyles}>
                        Body Copy
                        <span style={{ fontWeight: 'normal' }}> (Required)</span>
                    </MetBigLabel>
                    <FormDescriptionText style={formDescriptionTextStyles}>
                        If the content you add for this tab is quite long, a “read more” expander will be added to your
                        content at approximately xx (large screens) and xx (small screens). In this case, you will want
                        to ensure that the most important body copy is first so that your audience will see it even if
                        they do not interact with the Read More expander.
                    </FormDescriptionText>
                    <RichTextArea
                        ariaLabel="Body copy: If the content you add for this tab is quite long, a “read more” expander will be added to your
                        content at approximately xx (large screens) and xx (small screens). In this case, you will want
                        to ensure that the most important body copy is first so that your audience will see it even if
                        they do not interact with the Read More expander."
                        spellCheck
                        editorState={tabs[tabIndex].bodyCopyEditorState}
                        onEditorStateChange={handleBodyTextChange}
                        handlePastedText={() => false}
                        editorStyle={{
                            height: '40em',
                            padding: '1em',
                            resize: 'vertical',
                            backgroundColor: colors.surface.white,
                        }}
                        toolbar={toolbar}
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
                        value={tabs[tabIndex].widget}
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
                    {tabs[tabIndex].widget} {tabs[tabIndex].widget && 'Widget'}
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
