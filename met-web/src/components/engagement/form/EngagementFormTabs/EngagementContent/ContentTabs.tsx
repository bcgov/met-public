import React, { useContext, useState } from 'react';
import { Box, Button, IconButton, MenuItem, Menu, Skeleton, Grid, Divider } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons';
import CustomTabContent from './CustomTabContent';
import SummaryTabContent from './SummaryTabContent';
import { MetTab, MetTabList, MetTabPanel } from '../../StyledTabComponents';
import TabContext from '@mui/lab/TabContext';
import { CONTENT_TYPE } from 'models/engagementContent';
import { deleteEngagementContent } from 'services/engagementContentService';
import { ActionContext } from '../../ActionContext';
import { EngagementContentContext } from './EngagementContentContext';
import { If, Then, Else } from 'react-if';
import ContentTabModal from './ContentTabModal';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { MetTooltip } from 'components/common';

export const ContentTabs: React.FC = () => {
    const { fetchEngagementContents, contentTabs, setContentTabs, savedEngagement } = useContext(ActionContext);
    const { setIsEditMode, isSummaryContentsLoading } = useContext(EngagementContentContext);
    const [tabIndex, setTabIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTabType, setSelectedTabType] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [customTabAdded, setCustomTabAdded] = useState(false);
    const isAllTabTypesPresent = () => {
        const tabTypes = Object.values(CONTENT_TYPE);
        for (const tabType of tabTypes) {
            if (!contentTabs.some((tab) => tab.content_type === tabType)) {
                return false; // At least one tab type is missing
            }
        }
        return true; // All tab types are present
    };

    const handleSetTabIndex = (_event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleDeleteTab = async (index: number) => {
        const tab_id = contentTabs[index].id;
        if (!tab_id) {
            return;
        }
        await deleteEngagementContent(savedEngagement.id, tab_id);
        await fetchEngagementContents();
        setTabIndex(0);

        // Check if the deleted tab was a custom tab and reset customTabAdded state
        if (contentTabs[index].content_type === CONTENT_TYPE.CUSTOM) {
            setCustomTabAdded(false);
        }
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleMenuClick = (type: string) => {
        setIsEditMode(false);
        setSelectedTabType(type);
        handleModalOpen();
        handleMenuClose();

        // Set customTabAdded to true when a custom tab is added
        if (type === CONTENT_TYPE.CUSTOM) {
            setCustomTabAdded(true);
        }
    };

    const handleEditTab = (index: number) => {
        setIsEditMode(true);
        setTabIndex(index);
        setIsModalOpen(true);
    };

    return (
        <If condition={isSummaryContentsLoading}>
            <Then>
                <Grid item xs={12}>
                    <Skeleton width="100%" height="6em" />
                </Grid>
            </Then>
            <Else>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={tabIndex.toString()}>
                        <Box>
                            <MetTabList onChange={handleSetTabIndex}>
                                {contentTabs?.map((tab, index) => (
                                    <MetTab
                                        key={index}
                                        value={index.toString()}
                                        label={
                                            <Box display="flex" alignItems="center">
                                                <span>{tab.title}</span>
                                                <MetTooltip title="Edit Tab">
                                                    <IconButton onClick={() => handleEditTab(index)} aria-label="edit">
                                                        <FontAwesomeIcon
                                                            icon={faPenToSquare as IconProp}
                                                            fontSize="small"
                                                            data-testid="edit-tab-details"
                                                        />
                                                    </IconButton>
                                                </MetTooltip>
                                                {index !== 0 && (
                                                    <MetTooltip title="Delete Tab">
                                                        <IconButton
                                                            onClick={() => handleDeleteTab(index)}
                                                            aria-label="delete"
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faTrash as IconProp}
                                                                fontSize="small"
                                                            />
                                                        </IconButton>
                                                    </MetTooltip>
                                                )}
                                            </Box>
                                        }
                                    />
                                ))}
                                <Button
                                    aria-controls="add-tab-menu"
                                    aria-haspopup={!customTabAdded} // Only allow the dropdown if customTabAdded is false
                                    onClick={handleMenuOpen}
                                    disabled={isAllTabTypesPresent() || !savedEngagement.id} // Disable the button if customTabAdded is true
                                    data-testid="add-tab-menu"
                                >
                                    <FontAwesomeIcon icon={faPlus as IconProp} fontSize="small" />
                                </Button>
                            </MetTabList>
                        </Box>
                        <Divider />
                        <Menu id="add-tab-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                            <MenuItem
                                onClick={() => handleMenuClick(CONTENT_TYPE.CUSTOM)}
                                data-testid="add-new-custom-tab"
                            >
                                Add new custom tab
                            </MenuItem>
                        </Menu>
                        <ContentTabModal // Use ContentTabModal instead of AddContentTabModal and EditContentTabModal
                            open={isModalOpen}
                            updateModal={handleModalClose}
                            tabs={contentTabs}
                            setTabs={setContentTabs}
                            selectedTabType={selectedTabType}
                            tabIndex={tabIndex} // Pass the tabIndex prop if needed
                        />
                        <Box mt={3}>
                            <MetTabPanel value={tabIndex.toString()}>
                                {contentTabs && contentTabs.length > 0 ? (
                                    (() => {
                                        if (contentTabs[tabIndex]) {
                                            switch (contentTabs[tabIndex].content_type) {
                                                case CONTENT_TYPE.SUMMARY:
                                                    return <SummaryTabContent />;
                                                case CONTENT_TYPE.CUSTOM:
                                                    return <CustomTabContent />;
                                                default:
                                                    return (
                                                        <div>
                                                            Custom tab content for {contentTabs[tabIndex].content_type}
                                                        </div>
                                                    );
                                            }
                                        } else {
                                            return <div>Invalid tab index</div>;
                                        }
                                    })()
                                ) : (
                                    <div>No tabs available</div>
                                )}
                            </MetTabPanel>
                        </Box>
                    </TabContext>
                </Box>
            </Else>
        </If>
    );
};
