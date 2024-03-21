import React, { useContext, useState } from 'react';
import { Box, Button, IconButton, MenuItem, Tooltip, Menu, Skeleton, Grid, Divider } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons';
import AddContentTabModal from './AddContentTabModal';
import EditContentTabModal from './EditContentTabModal';
import CustomTabContent from './CustomTabContent';
import SummaryTabContent from './SummaryTabContent';
import { MetTab, MetTabList, MetTabPanel } from '../../StyledTabComponents';
import TabContext from '@mui/lab/TabContext'; // Import TabContext from MUI
import { CONTENT_TYPE } from 'models/engagementContent';
import { deleteEngagementContent } from 'services/engagementContentService';
import { ActionContext } from '../../ActionContext';
import { EngagementContentContext } from './EngagementContentContext';
import { If, Then, Else } from 'react-if';

export const ContentTabs: React.FC = () => {
    const { fetchEngagementContents, contentTabs, setContentTabs, savedEngagement } = useContext(ActionContext);
    const { isContentsLoading } = useContext(EngagementContentContext);
    const [tabIndex, setTabIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTabType, setSelectedTabType] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [customTabAdded, setCustomTabAdded] = useState(false); // Define state to track whether a custom tab has been added
    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
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
        setSelectedTabType(type);
        handleModalOpen();
        handleMenuClose();

        // Set customTabAdded to true when a custom tab is added
        if (type === CONTENT_TYPE.CUSTOM) {
            setCustomTabAdded(true);
        }
    };

    const handleEditTab = (index: number) => {
        setTabIndex(index);
        setIsEditModalOpen(true);
    };

    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
    };

    return (
        <If condition={isContentsLoading}>
            <Then>
                <Grid item xs={12}>
                    <Skeleton width="100%" height="6em" />
                </Grid>
            </Then>
            <Else>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={tabIndex.toString()}>
                        <Box>
                            <MetTabList onChange={handleChange}>
                                {contentTabs?.map((tab, index) => (
                                    <MetTab
                                        key={index}
                                        value={index.toString()}
                                        label={
                                            <Box display="flex" alignItems="center">
                                                <span>{tab.title}</span>
                                                <Tooltip title="Edit Tab">
                                                    <IconButton onClick={() => handleEditTab(index)} aria-label="edit">
                                                        <FontAwesomeIcon icon={faPenToSquare} fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                {index !== 0 && (
                                                    <Tooltip title="Delete Tab">
                                                        <IconButton
                                                            onClick={() => handleDeleteTab(index)}
                                                            aria-label="delete"
                                                        >
                                                            <FontAwesomeIcon icon={faTrash} fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </Box>
                                        }
                                    />
                                ))}
                                <Button
                                    aria-controls="add-tab-menu"
                                    aria-haspopup={!customTabAdded} // Only allow the dropdown if customTabAdded is false
                                    onClick={handleMenuOpen}
                                    disabled={customTabAdded} // Disable the button if customTabAdded is true
                                >
                                    <FontAwesomeIcon icon={faPlus} fontSize="small" />
                                </Button>
                            </MetTabList>
                        </Box>
                        <Divider /> {/* Add a Divider */}
                        <Menu id="add-tab-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                            <MenuItem onClick={() => handleMenuClick(CONTENT_TYPE.CUSTOM)}>Add new custom tab</MenuItem>
                        </Menu>
                        <AddContentTabModal
                            open={isModalOpen}
                            updateModal={handleModalClose}
                            setTabs={setContentTabs}
                            selectedTabType={selectedTabType}
                        />
                        <EditContentTabModal
                            open={isEditModalOpen}
                            updateModal={handleEditModalClose}
                            tabs={contentTabs}
                            setTabs={setContentTabs}
                            selectedTabIndex={tabIndex}
                        />
                        <Box mt={3}>
                            <MetTabPanel value={tabIndex.toString()}>
                                {/* Conditional rendering */}
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
