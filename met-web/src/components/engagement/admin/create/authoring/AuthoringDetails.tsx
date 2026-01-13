import { Box, FormControlLabel, Grid2 as Grid, IconButton, Modal, Radio, RadioGroup, Tab } from '@mui/material';
import { ErrorMessage, EyebrowText as FormDescriptionText } from 'components/common/Typography';
import React, { useEffect, useRef, useState } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { AuthoringFormContainer, AuthoringFormSection } from './AuthoringFormLayout';
import { Header3 } from 'components/common/Typography/Headers';
import { useLoaderData, useOutletContext } from 'react-router-dom';
import { Controller, useFormContext } from 'react-hook-form';
import { TextField } from 'components/common/Input/TextInput';
import { colors, Palette } from 'styles/Theme';
import { RichTextArea } from 'components/common/Input/RichTextArea';
import { AuthoringTemplateOutletContext, FormDetailsTab } from './types';
import { EditorState } from 'draft-js';
import WidgetPicker from '../widgets';
import { WidgetLocation } from 'models/widget';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/pro-light-svg-icons';
import ConfirmModal from 'components/common/Modals/ConfirmModal';
import { AuthoringLoaderData } from './authoringLoader';
import { defaultValuesObject, EngagementUpdateData } from './AuthoringContext';
import { getEditorStateFromRaw } from 'components/common/RichTextEditor/utils';
import UnsavedWorkConfirmation from 'components/common/Navigation/UnsavedWorkConfirmation';

const AuthoringDetails = () => {
    const { setDefaultValues, engagement, fetcher, pageName }: AuthoringTemplateOutletContext = useOutletContext();
    const {
        setValue,
        getValues,
        reset,
        watch,
        control,
        formState: { errors, isDirty, isSubmitting },
    } = useFormContext<EngagementUpdateData>();
    const { detailsTabs } = useLoaderData() as AuthoringLoaderData; // Get fresh data to avoid DB sync issues
    const [tabsEnabled, setTabsEnabled] = useState<boolean | undefined>(undefined);
    const [currentTab, setCurrentTab] = useState<string | undefined>(undefined);
    const [delTabIndex, setDelTabIndex] = useState(-1);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [noTabsModalOpen, setNoTabsModalOpen] = useState(false);
    const [updateFocus, setUpdateFocus] = useState(false);
    const hasUnsavedWork = isDirty && !isSubmitting;
    const selectedTabRef = useRef<HTMLButtonElement | null>(null);
    const tabErrorsRef = useRef<HTMLDivElement>(null);
    const engagementId = engagement.id;
    const authoringDetailsTabs = watch('details_tabs');
    const defaultDetailsTabValues = {
        id: -1,
        engagement_id: engagementId,
        label: 'Tab 1',
        slug: 'tab_1',
        heading: '',
        body: EditorState.createEmpty(),
        sort_index: 1,
    };

    // Return focus to the newly selected element after an update focus request.
    useEffect(() => {
        if (!updateFocus) return;
        selectedTabRef.current?.focus();
        setUpdateFocus(false);
    }, [updateFocus]);

    // Set current values to default state after saving form
    useEffect(() => {
        if (typeof fetcher.data === 'string' && fetcher.data === 'success') {
            const newDefaults = getValues();
            setDefaultValues(newDefaults);
            reset(newDefaults);
        }
    }, [fetcher.data]);

    // Scroll to the tab label errors when there are tab errors, so they are obvious to the user
    useEffect(() => {
        if (Array.isArray(errors?.details_tabs) && errors.details_tabs.length > 0) {
            scrollToTabErrors();
        }
    }, [errors.details_tabs]);

    useEffect(() => {
        reset(defaultValuesObject);
        setValue('form_source', pageName);
        setValue('id', engagementId);
        detailsTabs.then((tabs) => {
            if (Array.isArray(tabs) && tabs.length > 0 && tabs[0].engagement_id === engagementId) {
                const parsedTabs: FormDetailsTab[] = tabs.map((t) => ({
                    id: t.id || -1,
                    engagement_id: t.engagement_id || engagementId,
                    label: t.label || '',
                    slug: t.slug || '',
                    heading: t.heading || '',
                    body: getEditorStateFromRaw(JSON.stringify(t.body) || ''),
                    sort_index: t.sort_index || -1,
                }));
                // Sort by sort_index value
                const sortedTabs = [...parsedTabs].sort((a, b) => a.sort_index - b.sort_index);
                updateTabs(sortedTabs, false);
            } else {
                setValue('details_tabs', [defaultDetailsTabValues]);
            }
            // Pick single or tab mode based on the number of tabs
            if (getValues()?.details_tabs?.length < 2) {
                setTabsEnabled(false);
            } else {
                setTabsEnabled(true);
            }
            setDefaultValues(getValues());
            reset(getValues());
            setCurrentTab('0');
        });
    }, []);

    const addTab = () => {
        const newTabs = [...getValues('details_tabs')];
        if (newTabs.length > 9) {
            return; // Maximum 10 tabs
        }
        const renumberedTabs = renumberTabs(newTabs);
        const newTab: FormDetailsTab = {
            id: -1,
            engagement_id: engagementId,
            label: `Tab ${newTabs.length + 1}`,
            slug: `tab_${newTabs.length + 1}`,
            heading: '',
            body: getEditorStateFromRaw(''),
            sort_index: newTabs.length + 1,
        };
        updateTabs([...renumberedTabs, newTab], true);
        setCurrentTab(String(renumberedTabs.length));
    };

    const renumberTabs = (tabs: FormDetailsTab[]): FormDetailsTab[] => {
        return tabs.map((tab, index) => {
            if (tab.label.includes('Tab ') && !tab.label.includes(` ${String(index + 1)}`)) {
                tab.label = `Tab ${index + 1}`;
                tab.slug = `tab_${index + 1}`;
                tab.sort_index = index + 1;
            }
            return tab;
        });
    };

    const removeTab = (event: React.SyntheticEvent, index: number) => {
        event.stopPropagation();
        const newTabs = getValues('details_tabs');
        if (index !== -1 && newTabs?.[index]) {
            setDelTabIndex(index);
            openModal('delete tab');
        }
    };

    const labelChange = (value: string, index: number) => {
        const newTabs = [...getValues('details_tabs')];
        // Search for duplicate label names and rename new label if necessary
        let newValue = value;
        let suffixCounter = 1;
        while (newTabs.some((tab, i) => tab.label === newValue && i !== index)) {
            newValue = `${value} (${suffixCounter++})`;
        }
        newTabs[index].label = newValue;
        newTabs[index].slug = newValue.toLowerCase().replace(/\s+/g, '_');
        updateTabs(newTabs, true);
    };

    const editorChange = (newEditorState: EditorState, key: number): EditorState => {
        const newTabs = [...getValues('details_tabs')];
        newTabs[key].body = newEditorState;
        updateTabs(newTabs, true);
        return newEditorState;
    };

    const deleteConfirm = () => {
        const newTabs = [...getValues('details_tabs')];
        newTabs.splice(delTabIndex, 1);
        const renumberedTabs = renumberTabs(newTabs);
        if (String(delTabIndex) === currentTab) {
            // If the selected tab was deleted, select the tab before it.
            setCurrentTab(String(Math.max(0, delTabIndex - 1)));
        } else if (!renumberedTabs[Number(currentTab)]) {
            // If the tab no longer exists because of renumbering, choose the new last tab.
            setCurrentTab(String(renumberedTabs.length - 1));
        }
        updateTabs(renumberedTabs, true);
        closeModal('delete tab');
    };

    const updateTabs = (newTabs: FormDetailsTab[], dirtied: boolean) => {
        setValue('details_tabs', newTabs, { shouldDirty: dirtied });
    };

    const enableTabs = () => {
        setTabsEnabled(true);
        addTab();
    };

    const disableTabs = () => {
        if (getValues('details_tabs')?.length > 1) {
            // Don't directly set tabs to disabled if there are multiple tabs - confirm first.
            openModal('disable tabs');
        }
    };

    const noTabsConfirm = () => {
        setTabsEnabled(false);
        const newTabs = getValues('details_tabs');
        // Remove subsequent tabs when switching to no-tab mode. This action dirties the form.
        updateTabs([newTabs[0]], true);
        closeModal('disable tabs');
    };

    const scrollToTabErrors = () => {
        tabErrorsRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    const openModal = (source: string) => {
        switch (source) {
            case 'delete tab':
                setDeleteModalOpen(true);
                break;
            case 'disable tabs':
                setNoTabsModalOpen(true);
                break;
        }
    };

    const closeModal = (source: string) => {
        switch (source) {
            case 'delete tab':
                setDeleteModalOpen(false);
                setDelTabIndex(-1);
                break;
            case 'disable tabs':
                setNoTabsModalOpen(false);
                setCurrentTab('0');
                break;
        }
        setUpdateFocus(true);
    };

    const tabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement | HTMLDivElement>, source: string, index = -1) => {
        if (source === 'add' && (event.key === 'Enter' || event.key === 'Spacebar' || event.key === ' ')) {
            event.preventDefault();
            addTab();
        } else if (source === 'tab' && (event.key === 'Delete' || event.key === 'Backspace')) {
            event.preventDefault();
            removeTab(event, index);
        }
    };

    // WYSIWYG text editor toolbar items

    const toolbar = {
        options: ['inline', 'list', 'link', 'blockType', 'history'],
        inline: {
            options: ['bold', 'italic', 'underline', 'superscript', 'subscript'],
        },
        blockType: { options: ['Normal', 'H2', 'H3', 'Blockquote'] },
        list: { options: ['unordered', 'ordered'] },
    };

    // Styles

    const heading3Styles = {
        pb: '1rem',
        fontWeight: 'bold',
    };

    const formDescriptionTextStyles = {
        fontSize: '0.9rem',
    };

    const tabRadioContainerStyles = {
        display: 'flex',
        width: '100%',
        flexWrap: 'nowrap',
        mt: '1rem',
        fontWeight: 'bold',
    };

    const radioStyles = {
        flexBasis: '50%',
    };

    const tabListStyles = {
        display: tabsEnabled ? 'flex' : 'none',
        borderBottom: `1px solid ${Palette.primary.main}`,
        margin: '1rem 0',
        '& .MuiTabs-flexContainer': {
            flexWrap: 'wrap', // For 7-10 tabs, a second line of tabs is required.
            marginBottom: '-12px',
        },
        '&:focus-visible': {
            outline: `2px solid`,
            outlineColor: 'focus.inner',
            border: '4px solid',
            borderColor: 'focus.outer',
            padding: '0px 20px 0px 14px',
        },
    };

    const tabStyles = {
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        alignItems: 'center',
        height: '48px',
        padding: '4px 18px 2px 18px',
        fontSize: '14px',
        borderRadius: '0px 16px 0px 0px',
        borderBottom: '2px solid',
        borderBottomColor: 'gray.60',
        boxShadow:
            '0px 1px 5px 0px rgba(0, 0, 0, 0.12), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.20)',
        color: 'text.secondary',
        fontWeight: 'normal',
        outlineOffset: '-4px',
        '&:focus-visible': {
            outline: `2px solid`,
            outlineColor: 'focus.inner',
            border: '4px solid',
            borderColor: 'focus.outer',
            padding: '0px 20px 0px 14px',
        },
    };

    const addTabButtonStyles = {
        border: 'none',
        borderRadius: '0px 16px 0px 0px',
        background: 'transparent',
        fontWeight: 'normal',
        fontSize: '0.9rem',
        padding: '0',
        mb: '0.75rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90px',
        color: colors.button.default.shade,
        cursor: 'pointer',
        minWidth: '120px',
        '&:focus-visible': {
            outline: `2px solid`,
            outlineColor: 'focus.inner',
            border: '2px solid',
            borderColor: 'focus.outer',
            padding: '0px 20px 0px 14px',
        },
    };

    const tabPanelStyles = {
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        padding: 0,
    };

    const labelSectionStyles: React.CSSProperties = {
        display: tabsEnabled ? 'flex' : 'none',
    };

    const authoringFormContainerStyles = {
        gap: 0,
        '& .met-input-form-field-title': { fontSize: '0.875rem' },
        '& .met-input-text': { background: 'white' },
        '& #image-upload-section .MuiGrid-container': { background: 'white' },
    };

    const closeTabXContainer = {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const iconButtonStyles = {
        color: 'inherit',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'noWrap',
        alignContent: 'center',
        justifyItems: 'center',
        marginLeft: '1.125rem',
        borderRadius: '4px',
    };

    const fontAwesomeXStyles: React.CSSProperties = {
        fontSize: '16px',
        display: 'inline-flex',
        alignItems: 'center',
        position: 'relative',
        top: '1px',
    };

    return (
        <>
            {/* prevent user from accidentally deleting a tab */}
            <Modal open={deleteModalOpen} aria-describedby="delete-tab-modal-subtext">
                <ConfirmModal
                    style="danger"
                    header={`Are you sure you want to delete ${authoringDetailsTabs[delTabIndex]?.label || 'this tab'}?`}
                    subHeader="The tab will not be recoverable."
                    subTextId="delete-tab-modal-subtext"
                    subText={[
                        {
                            text: `If you delete ${authoringDetailsTabs[delTabIndex]?.label || 'this tab'}, its content (in all languages if multilingual) will be `,
                            bold: false,
                        },
                        { text: 'deleted permanently.', bold: true },
                    ]}
                    handleConfirm={deleteConfirm}
                    handleClose={() => closeModal('delete tab')}
                    confirmButtonText={`Delete ${authoringDetailsTabs[delTabIndex]?.label || 'This Tab'}`}
                    cancelButtonText={'Cancel & Go Back'}
                />
            </Modal>

            {/* prevent user from accidentally deleting all tabs after 1 when switching to No Tabs mode */}
            <Modal open={noTabsModalOpen} aria-describedby="no-tabs-mode-modal-subtext">
                <ConfirmModal
                    style="danger"
                    header={`Are you sure you want to switch to No Tabs mode?`}
                    subHeader="Your tabbed content will be deleted."
                    subTextId="no-tabs-mode-modal-subtext"
                    subText={[
                        {
                            text: 'This includes all tabs and their translations, except for tab one.',
                            bold: false,
                        },
                    ]}
                    handleConfirm={noTabsConfirm}
                    handleClose={() => closeModal('disable tabs')}
                    confirmButtonText={'Delete Tabs'}
                    cancelButtonText={'Cancel & Go Back'}
                />
            </Modal>

            {/* prevent navigating away when the user has unsaved work */}
            <UnsavedWorkConfirmation blockNavigationWhen={hasUnsavedWork} />

            {/* Tabs and form */}
            <AuthoringFormContainer sx={authoringFormContainerStyles}>
                {/* Tabs mode radio selector */}
                <Grid sx={{ margin: '1rem 0' }}>
                    <FormDescriptionText style={formDescriptionTextStyles}>
                        {'In the Details Section of your engagement, you have the option to display your content in a ' +
                            'normal, static page section view (no tabs) or, for lengthy content, use tabs. You may wish ' +
                            'to use tabs if your content is quite lengthy so you can organize it into smaller, more ' +
                            'digestible chunks and reduce the length of your engagement page.'}
                    </FormDescriptionText>
                    <RadioGroup
                        row
                        aria-label="Tab Mode Selector"
                        id="tab_mode_selector"
                        sx={tabRadioContainerStyles}
                        value={tabsEnabled ? 'true' : 'false'}
                        onChange={(_, value) => {
                            value === 'true' ? enableTabs() : disableTabs();
                        }}
                    >
                        <FormControlLabel
                            value="false"
                            control={<Radio />}
                            label={<span style={{ fontWeight: 'bold' }}>No Tabs</span>}
                            style={radioStyles}
                        />
                        <FormControlLabel
                            value="true"
                            control={<Radio />}
                            label={
                                <>
                                    <span style={{ fontWeight: 'bold' }}>Tabs </span>
                                    <span>(2 Minimum)</span>
                                </>
                            }
                            style={radioStyles}
                        />
                    </RadioGroup>
                </Grid>

                {/* Tab instructions */}
                {tabsEnabled && (
                    <Grid sx={{ margin: '1rem 0' }}>
                        <div ref={tabErrorsRef}></div>
                        <Header3 sx={heading3Styles}>Tabs Configuration</Header3>
                        <FormDescriptionText style={formDescriptionTextStyles}>
                            {'If your audience will need additional context to interpret the topic of your ' +
                                'engagement, or it is important for them to understand who, within BC Gov, is ' +
                                'requesting feedback, you may wish to add two to five words of eyebrow text.'}
                        </FormDescriptionText>
                    </Grid>
                )}

                {currentTab && (
                    <Grid>
                        <TabContext value={currentTab}>
                            {/* Tab labels */}
                            <ErrorMessage
                                error={
                                    errors?.details_tabs &&
                                    Array.isArray(errors.details_tabs) &&
                                    errors.details_tabs.length > 0
                                        ? 'Your tabs contain errors. Please fix the tabs highlighted in red.'
                                        : ''
                                }
                            />
                            <TabList
                                id="details-tab-list"
                                sx={tabListStyles}
                                selectionFollowsFocus
                                TabIndicatorProps={{ style: { display: 'none' } }}
                                onChange={(_, value: string) => {
                                    if (value !== 'add') {
                                        setCurrentTab(String(value));
                                    }
                                }}
                            >
                                {authoringDetailsTabs.map((value, key) => (
                                    <Tab
                                        component="button"
                                        key={String(key)}
                                        value={String(key)}
                                        onKeyDown={(event) => {
                                            tabKeyDown(event, 'tab', key);
                                        }}
                                        disableFocusRipple
                                        ref={currentTab === String(key) ? selectedTabRef : null}
                                        // Add an X when appropriate: not on first tab, only if there are 3 or more tabs.
                                        label={
                                            <Box sx={closeTabXContainer}>
                                                <span>{value.label}</span>
                                                {key !== 0 && authoringDetailsTabs.length > 2 ? (
                                                    <IconButton
                                                        component="span"
                                                        sx={iconButtonStyles}
                                                        disableRipple
                                                        tabIndex={-1}
                                                        size="small"
                                                        edge="end"
                                                        aria-label={`Close tab ${value.label}`}
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            removeTab(event, key);
                                                        }}
                                                    >
                                                        <FontAwesomeIcon
                                                            style={{ ...fontAwesomeXStyles }}
                                                            icon={faXmark}
                                                        />
                                                    </IconButton>
                                                ) : null}
                                            </Box>
                                        }
                                        // Colour the tab labels red if they contain errors so the user sees them from another tab.
                                        sx={{
                                            ...tabStyles,
                                            backgroundColor: errors.details_tabs?.[key]
                                                ? colors.button.error.tint
                                                : 'gray.10',
                                            '&.Mui-selected': {
                                                backgroundColor: errors.details_tabs?.[key]
                                                    ? colors.button.error.shade
                                                    : 'primary.main',
                                                borderColor: 'primary.main',
                                                color: 'white',
                                                fontWeight: 'bold',
                                            },
                                        }}
                                    ></Tab>
                                ))}

                                <Tab
                                    value="add"
                                    label="+ Add Tab"
                                    disabled={authoringDetailsTabs.length > 9}
                                    disableRipple
                                    sx={{ ...addTabButtonStyles }}
                                    onClick={() => addTab()}
                                    onKeyDown={(event) => tabKeyDown(event, 'add')}
                                />
                            </TabList>

                            {/* Tab contents */}
                            {authoringDetailsTabs.map((tab, key) => (
                                <TabPanel sx={tabPanelStyles} value={String(key)} key={key}>
                                    <AuthoringFormSection
                                        name={`Tab ${key + 1} Label`}
                                        required={true}
                                        labelFor={`details_tabs.${key}.label`}
                                        style={labelSectionStyles}
                                    >
                                        <FormDescriptionText style={formDescriptionTextStyles}>
                                            Your tab label should be one or two words (maximum three).
                                        </FormDescriptionText>
                                        <Controller
                                            name={`details_tabs.${key}.label`}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    sx={{ backgroundColor: colors.surface.white }}
                                                    id={`details_tabs.${key}.label`}
                                                    aria-label={`Tab ${key + 1} Label`}
                                                    onChange={(value) => {
                                                        field.onChange(value);
                                                        labelChange(value, key);
                                                    }}
                                                    counter
                                                    maxLength={20}
                                                    placeholder={`${tab.label} Label`}
                                                    error={errors.details_tabs?.[key]?.label?.message ?? ''}
                                                />
                                            )}
                                        />
                                    </AuthoringFormSection>

                                    <Grid sx={{ margin: '1rem 0' }}>
                                        <Header3 sx={heading3Styles}>Primary Content (Required)</Header3>
                                        <FormDescriptionText style={formDescriptionTextStyles}>
                                            {'Primary content will display on the left two thirds of the page on large screens ' +
                                                'and full width on small screens. (If you add optional supporting content in the section ' +
                                                'below, on small screens, your primary content will display first (on top) followed ' +
                                                'by your supporting content (underneath).'}
                                        </FormDescriptionText>
                                    </Grid>

                                    <AuthoringFormSection
                                        name="Heading"
                                        required={true}
                                        labelFor={`details_tabs.${key}.heading`}
                                    >
                                        <FormDescriptionText style={formDescriptionTextStyles}>
                                            Your heading should be descriptive, short and succinct.
                                        </FormDescriptionText>
                                        <Controller
                                            name={`details_tabs.${key}.heading`}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    sx={{ backgroundColor: colors.surface.white }}
                                                    id={`details_tabs.${key}.heading`}
                                                    aria-label={`Tab ${key + 1} Heading`}
                                                    counter
                                                    maxLength={60}
                                                    placeholder="Heading"
                                                    error={errors?.details_tabs?.[key]?.heading?.message ?? ''}
                                                />
                                            )}
                                        />
                                    </AuthoringFormSection>

                                    <AuthoringFormSection
                                        name="Body Copy"
                                        required={true}
                                        labelFor={`details_tabs.${key}.body`}
                                    >
                                        <FormDescriptionText style={formDescriptionTextStyles}>
                                            {'If the content you add for this tab is quite long, a "read more" expander will be ' +
                                                'added to your content at approximately xx (large screens) and xx (small screens). ' +
                                                'In this case, you will want to ensure that the most important body copy is first so ' +
                                                'that your audience will see it even if they do not interact with the Read More expander.'}
                                        </FormDescriptionText>
                                        <ErrorMessage error={errors?.details_tabs?.[key]?.body?.message ?? ''} />
                                        <Controller
                                            name={`details_tabs.${key}.body`}
                                            control={control}
                                            render={({ field }) => (
                                                <RichTextArea
                                                    spellCheck
                                                    editorState={field.value}
                                                    aria-label={`Tab ${key + 1} Body`}
                                                    onEditorStateChange={(value) => {
                                                        field.onChange(editorChange(value, key));
                                                    }}
                                                    handlePastedText={() => false}
                                                    toolbar={toolbar}
                                                    placeholder="Body Copy"
                                                />
                                            )}
                                        />
                                    </AuthoringFormSection>

                                    {/* Todo: Replace with streamlined widget selector that saves on form save */}
                                    <Grid sx={{ mt: '1rem' }}>
                                        <Header3 sx={heading3Styles}>Supporting Content (Optional)</Header3>
                                        <FormDescriptionText style={formDescriptionTextStyles}>
                                            {'You may use a widget to add supporting content to your primary content. On large screens ' +
                                                'this content will be displayed to the right of your primary content. On small screens this ' +
                                                'content will be displayed below your primary content.'}
                                        </FormDescriptionText>
                                        <Grid sx={{ maxWidth: '700px', mt: '1rem' }} direction="column">
                                            <WidgetPicker location={WidgetLocation.Details} />
                                        </Grid>
                                    </Grid>
                                </TabPanel>
                            ))}
                        </TabContext>
                    </Grid>
                )}
            </AuthoringFormContainer>
        </>
    );
};

export default AuthoringDetails;
