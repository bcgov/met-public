import React, { useContext, useState } from 'react';
import { Box, Button, IconButton, MenuItem, Menu, Divider } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faSquarePen } from '@fortawesome/pro-regular-svg-icons';
import { MetTab, MetTabList, MetTabPanel } from '../../StyledTabComponents';
import TabContext from '@mui/lab/TabContext';
import { deleteEngagementContent } from 'services/engagementContentService';
import { ActionContext } from '../../ActionContext';
import { EngagementContentContext } from './EngagementContentContext';
import ContentTabModal from './ContentTabModal';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { MetTooltip } from 'components/common';
import TabContent from './TabContent';

export const ContentTabs: React.FC = () => {
    const { contentTabs, setContentTabs, savedEngagement } = useContext(ActionContext);
    const { setIsEditMode } = useContext(EngagementContentContext);
    const [tabIndex, setTabIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
        setTabIndex(0);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleMenuClick = () => {
        setIsEditMode(false);
        handleModalOpen();
        handleMenuClose();
    };

    const handleEditTab = (index: number) => {
        setIsEditMode(true);
        setTabIndex(index);
        setIsModalOpen(true);
    };

    return (
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
                                                    icon={faSquarePen as IconProp}
                                                    fontSize="medium"
                                                    data-testid="edit-tab-details"
                                                />
                                            </IconButton>
                                        </MetTooltip>
                                        {index !== 0 && (
                                            <MetTooltip title="Delete Tab">
                                                <IconButton onClick={() => handleDeleteTab(index)} aria-label="delete">
                                                    <FontAwesomeIcon icon={faTrash as IconProp} fontSize="small" />
                                                </IconButton>
                                            </MetTooltip>
                                        )}
                                    </Box>
                                }
                            />
                        ))}
                        <Button
                            aria-controls="add-tab-menu"
                            onClick={handleMenuOpen}
                            disabled={!savedEngagement.id} // Disable the button if customTabAdded is true
                            data-testid="add-tab-menu"
                        >
                            <FontAwesomeIcon icon={faPlus as IconProp} fontSize="small" />
                        </Button>
                    </MetTabList>
                </Box>
                <Divider />
                <Menu id="add-tab-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                    <MenuItem onClick={() => handleMenuClick()} data-testid="add-new-custom-tab">
                        Add new custom tab
                    </MenuItem>
                </Menu>
                <ContentTabModal // Use ContentTabModal instead of AddContentTabModal and EditContentTabModal
                    open={isModalOpen}
                    updateModal={handleModalClose}
                    tabs={contentTabs}
                    setTabs={setContentTabs}
                    tabIndex={tabIndex} // Pass the tabIndex prop if needed
                />
                {contentTabs?.map((tab, index) => (
                    <MetTabPanel key={tab.id} value={index.toString()}>
                        <TabContent index={index} />
                    </MetTabPanel>
                ))}
            </TabContext>
        </Box>
    );
};
