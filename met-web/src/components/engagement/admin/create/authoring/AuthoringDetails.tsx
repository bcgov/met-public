import { Grid, IconButton, Tab, Tabs, TextField, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { colors, MetLabel, MetHeader3, MetLabel as MetBigLabel } from 'components/common';
import { Button } from 'components/common/Input';
import React, { useEffect, useState } from 'react';
import { RichTextArea } from 'components/common/Input/RichTextArea';
import { AuthoringTemplateOutletContext, DetailsFieldsProps } from './types';
import { useOutletContext, useParams } from 'react-router-dom';
import { Controller, useFormContext, useFieldArray, useForm, FormProvider } from 'react-hook-form';
import { useRouteLoaderData } from 'react-router-dom';
import { Palette } from 'styles/Theme';
import { If, Else, Then, When } from 'react-if';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/pro-regular-svg-icons';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import WidgetPicker from '../widgets';
import { WidgetLocation } from 'models/widget';
import { Header2, EyebrowText } from 'components/common/Typography';
import RichTextEditor from 'components/common/RichTextEditor';
import { useAppSelector } from 'hooks';
import AuthoringBottomNav from './AuthoringBottomNav';
import { EngagementLoaderData } from 'components/engagement/public/view';
import { defaultValuesObject, EngagementUpdateData } from './AuthoringContext';

const AuthoringDetails = () => {
    const {
        watch,
        control,
        formState: { isDirty, isValid, isSubmitting },
        register,
        reset,
        setValue,
    } = useFormContext<EngagementUpdateData>();
    const { engagement } = useOutletContext() as EngagementLoaderData;

    // useEffect(() => {
    //     reset(defaultValuesObject);
    //     engagement.then(() => {
    //         /** */
    //     });
    // }, [engagement]);

    const [currentTab, setCurrentTab] = useState(0);

    // Set up other field array form utilities.
    const { fields, append, update, remove } = useFieldArray({
        control,
        name: 'tabs',
    });
    const watchTabs = watch('tabs');
    const controlledFields = fields.map((field, index) => {
        return {
            ...field,
            ...watchTabs[index],
        };
    });

    const handleDeleteTab = (tabIndex: number, existingId = 0) => {
        // Save any IDs of content tabs that have been marked for deletion.
        setCurrentTab(0);
        remove(tabIndex);
    };

    const handleAddTab = () => {
        append({
            engagement_id: 0,
            sort_index: fields.length - 1,
            is_internal: false,
            title: `Tab ${fields.length + 1}`,
            heading: '',
            json_content: '',
            text_content: '',
        });
    };

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

    const handleTabsSelected = (event: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
        let updatedTabsSelected;

        if (event.target.value === 'true') {
            // Convert to boolean
            updatedTabsSelected = true;
            // If tabs are selected, update the first default tab name
            setValue('tabs.0.title', 'Tab 1');
        } else if (event.target.value === 'false') {
            // Convert to boolean
            updatedTabsSelected = false;
            // If tabs aren't selected, erase the first tab name
            setValue('tabs.0.title', '');
        }
        // Finally, update the form value
        onChange(updatedTabsSelected);
    };

    return (
        <Grid item sx={{ maxWidth: '700px' }}>
            <Grid container sx={{ maxWidth: '700px' }}>
                <Header2 decorated style={{ paddingTop: '1rem' }}>
                    Content Configuration
                </Header2>
                <label>
                    In the Details Section of your engagement, you have the option to display your content in a normal,
                    static page section view (No Tabs), or for lengthy content, use Tabs. You may wish to use tabs if
                    your content is quite lengthy so you can organize it into smaller, more digestible chunks and reduce
                    the length of your engagement page.
                </label>
                <Controller
                    name="tabs_selected"
                    control={control}
                    render={({ field: { value, onChange, ref } }) => (
                        <RadioGroup
                            row
                            id="tabs_enabled"
                            name="tabs_enabled"
                            defaultValue={watch('tabs_selected')}
                            value={value}
                            onChange={(e) => handleTabsSelected(e, onChange)}
                            sx={{ flexWrap: 'nowrap', fontSize: '0.8rem', mb: '1rem', width: '100%' }}
                        >
                            <Grid item xs={6}>
                                <FormControlLabel
                                    aria-label="No Tabs: Select the no tabs option if you only want one content section."
                                    value={false}
                                    control={<Radio ref={ref} />}
                                    label="No Tabs"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControlLabel
                                    aria-label="Tabs (2 Minimum): Select the tabs option for lengthly content so you can break it into smaller chunks."
                                    value={true}
                                    control={<Radio ref={ref} />}
                                    label="Tabs (2 Minimum)"
                                />
                            </Grid>
                        </RadioGroup>
                    )}
                />
            </Grid>
            <Grid sx={{ borderBottom: '1', borderColor: 'divider' }} item>
                {watch('tabs_selected') && (
                    <Tabs
                        component="nav"
                        variant="scrollable"
                        aria-label="Admin Engagement View Tabs"
                        TabIndicatorProps={{ sx: { display: 'none' } }}
                        sx={tabsStyles}
                        value={currentTab}
                        onChange={(_, newValue: number) => setCurrentTab(newValue)}
                    >
                        {controlledFields.map((field, index) => {
                            return (
                                <Tab
                                    sx={tabStyles}
                                    label={
                                        <span>
                                            <span style={{ marginRight: '1rem' }}>{watchTabs[index].title}</span>
                                            <When condition={0 !== index}>
                                                <IconButton
                                                    size="small"
                                                    component="span"
                                                    onClick={() => handleDeleteTab(index, Number(field.id))}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faX}
                                                        style={{
                                                            fontSize: '0.9rem',
                                                            marginTop: '-4px',
                                                            color: Palette.text.primary,
                                                        }}
                                                    />
                                                </IconButton>
                                            </When>
                                        </span>
                                    }
                                    key={field.id}
                                    disableFocusRipple
                                />
                            );
                        })}
                        +{' '}
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
                )}
                {controlledFields.map((field, index) => (
                    <TabPanel index={index} key={field.id} value={currentTab}>
                        <DetailsFields tabsSelected={watch('tabs_selected')} index={index} />
                    </TabPanel>
                ))}
            </Grid>
        </Grid>
    );
};

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`details-tab-${index}`}
        >
            {value === index && <div>{children}</div>}
        </div>
    );
};

/**
 * To work with useFieldArray, each rich text editor needs its own state
 * which gets mounted and unmounted dynamically when browsing between tabs.
 */
const ManagedStateEditor = (props: any) => {
    const [editorState] = useState(props.value);

    return (
        <RichTextEditor
            initialRawEditorState={editorState}
            handleEditorStateChange={(editorState: string) => props.onChange(editorState)}
        />
    );
};

export default AuthoringDetails;

const DetailsFields = ({ index, tabsSelected }: DetailsFieldsProps) => {
    const { control, getValues, register, setValue, watch } = useFormContext();
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

    return (
        <Grid container sx={{ maxWidth: '700px', mt: '1rem' }} direction="column">
            {watch('tabs_selected') && (
                <Grid item sx={{ mt: '1rem' }}>
                    <MetBigLabel id="tab-title-label" style={metBigLabelStyles}>
                        Tab Label <span style={{ fontWeight: 'normal' }}>(Required)</span>
                    </MetBigLabel>
                    <label id="tab-title-description" style={formDescriptionTextStyles}>
                        Your tab label should be one or two words (maximum 20 characters).
                    </label>
                    <TextField
                        {...register(`tabs.${index}.title` as const)}
                        sx={{ backgroundColor: colors.surface.white }}
                        aria-labelledby="tab-title-label tab-title-description"
                        placeholder="Tab name"
                    />
                </Grid>
            )}
            <Grid item sx={{ mt: '1rem' }}>
                <MetHeader3 style={metHeader3Styles}>Primary Content (Required)</MetHeader3>
                <span style={formDescriptionTextStyles}>
                    Primary content will display on the left two thirds of the page on large screens and full width on
                    small screens. (If you add optional supporting content in the section below, on small screens, your
                    primary content will display first (on top) followed by your supporting content (underneath).
                </span>
            </Grid>

            <Grid sx={{ ...formItemContainerStyles, backgroundColor: colors.surface.blue[10] }} item>
                <MetBigLabel id="section-heading-label" style={metBigLabelStyles}>
                    Section Heading <span style={{ fontWeight: 'normal' }}>(Required)</span>
                </MetBigLabel>
                <span id="section-heading-description" style={formDescriptionTextStyles}>
                    Your section heading should be descriptive, short and succinct.
                </span>
                <TextField
                    {...register(`tabs.${index}.heading`)}
                    sx={{ backgroundColor: colors.surface.white }}
                    id="section_heading"
                    aria-labelledby="section-heading-label section-heading-description"
                    placeholder="Section heading message"
                />
            </Grid>

            <Grid sx={{ ...formItemContainerStyles, backgroundColor: colors.surface.blue[10] }} item>
                <MetBigLabel id="body-copy-label" style={metBigLabelStyles}>
                    Body Copy
                    <span style={{ fontWeight: 'normal' }}> (Required)</span>
                </MetBigLabel>
                <label id="body-copy-description" style={formDescriptionTextStyles}>
                    If the content you add for this tab is quite long, a “read more” expander button will appear on some
                    screen sizes. In this case, you will want to ensure that the most important body copy is first so
                    that your audience will see it even if they do not interact with the "read more" expander.
                </label>
                <Controller
                    name={`tabs.${index}.json_content`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                        <ManagedStateEditor
                            value={value}
                            defaultState={getValues(`tabs.${index}.json_content`)}
                            onChange={onChange}
                            toolbar={toolbar}
                        />
                    )}
                />
                <label htmlFor="description"></label>
            </Grid>

            <Grid item sx={{ mt: '1rem' }}>
                <MetHeader3 style={metHeader3Styles}>Supporting Content (Optional)</MetHeader3>
                <label style={formDescriptionTextStyles}>
                    You may use a widget to add supporting content to your primary content. On large screens this
                    content will be displayed to the right of your primary content. On small screens this content will
                    be displayed below your primary content.
                </label>
                <WidgetPicker location={WidgetLocation.Details} />
            </Grid>
        </Grid>
    );
};
