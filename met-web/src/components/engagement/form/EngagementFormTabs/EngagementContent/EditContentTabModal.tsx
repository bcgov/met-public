import React, { useContext, useState, useEffect } from 'react';
import { MenuItem, Modal, Grid, Stack, TextField, Select, SelectChangeEvent } from '@mui/material';
import { modalStyle, MetHeader1, MetLabel, PrimaryButton } from 'components/common';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { ActionContext } from '../../ActionContext';
import { EngagementContent } from 'models/engagementContent';
import { patchEngagementContent } from 'services/engagementContentService'; // Import a function to fetch tab details by ID

interface EditContentTabModalProps {
    open: boolean;
    updateModal: (open: boolean) => void;
    tabs: EngagementContent[];
    setTabs: React.Dispatch<React.SetStateAction<EngagementContent[]>>;
    selectedTabIndex: number;
}

const EditContentTabModal = ({ open, updateModal, tabs, setTabs, selectedTabIndex }: EditContentTabModalProps) => {
    const { savedEngagement } = useContext(ActionContext);
    const [isUpdatingContent, setIsUpdatingContent] = useState(false);
    const [tabTitle, setTabTitle] = useState('');
    const [tabIcon, setTabIcon] = useState('');
    const dispatch = useAppDispatch();

    useEffect(() => {
        // Fetch tab details when modal is opened and selectedTabIndex changes
        if (open && tabs[selectedTabIndex]) {
            setTabTitle(tabs[selectedTabIndex].title);
            setTabIcon(tabs[selectedTabIndex].icon_name);
        }
    }, [open, selectedTabIndex, tabs]);

    const getErrorMessage = () => {
        if (tabTitle.length > 50) {
            return 'Title must not exceed 50 characters';
        } else if (!(tabTitle && tabTitle.length < 50)) {
            return 'Title must be specified';
        }
        return '';
    };

    const handleIconChange = (event: SelectChangeEvent<string>) => {
        setTabIcon(event.target.value);
    };

    const handleEditTab = async () => {
        if (tabTitle.trim() === '' && tabIcon === '') {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Title and Icon cannot be blank',
                }),
            );
            return;
        }

        try {
            setIsUpdatingContent(true);
            // Update the tab details
            const updatedTab = await patchEngagementContent(savedEngagement.id, tabs[selectedTabIndex].id, {
                title: tabTitle,
                icon_name: tabIcon,
            });
            if (updatedTab && Object.keys(updatedTab).length !== 0) {
                setTabs((prevTabs) => {
                    const newTabs = [...prevTabs];
                    newTabs[selectedTabIndex] = updatedTab;
                    return newTabs;
                });
            }
            dispatch(
                openNotification({
                    severity: 'success',
                    text: 'Content tab successfully updated.',
                }),
            );
            setIsUpdatingContent(false);
            handleModalClose();
        } catch (error) {
            setIsUpdatingContent(false);
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while updating engagement content',
                }),
            );
        }
    };

    const handleModalClose = () => {
        updateModal(false);
        setTabTitle('');
        setTabIcon('');
    };

    return (
        <Modal aria-labelledby="modal-title" open={open} onClose={() => updateModal(false)}>
            <Grid
                container
                direction="column"
                justifyContent="flex-start"
                alignItems="flex-start"
                sx={{ ...modalStyle, overflowY: 'scroll' }}
                rowSpacing={2}
            >
                <Grid item xs={12}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <MetHeader1 bold sx={{ mb: 2 }} data-testid="daycalculator-title">
                            Edit the engagement content tab
                        </MetHeader1>
                    </Stack>
                </Grid>
                <Grid container direction="row" item xs={12} alignItems="center">
                    <Grid item md={2} xs={12}>
                        <MetLabel align="left" marginBottom="1rem">
                            Tab Title:
                        </MetLabel>
                    </Grid>
                    <Grid item md={10} xs={12}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <TextField
                                id="content-tab-title"
                                data-testid="content-tab/title"
                                variant="outlined"
                                label=" "
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                fullWidth
                                sx={{ width: '100%' }}
                                name="content-tab-title"
                                value={tabTitle}
                                onChange={(e) => setTabTitle(e.target.value)}
                                error={tabTitle.length > 50}
                                helperText={getErrorMessage()}
                                size="small" // Adjust the size to small
                            />
                        </Stack>
                    </Grid>
                </Grid>
                <Grid container direction="row" item xs={12} alignItems="center">
                    <Grid item md={2} xs={12}>
                        <MetLabel align="left" marginBottom="1rem">
                            Tab Icon:
                        </MetLabel>
                    </Grid>
                    <Grid item md={10} xs={12}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Select
                                name="content-tab-icon"
                                id="content-tab-icon"
                                variant="outlined"
                                value={tabIcon}
                                defaultValue="Select an tab icon"
                                fullWidth
                                sx={{ width: '100%' }}
                                onChange={handleIconChange}
                                size="small" // Adjust the size to small
                            >
                                <MenuItem value="">None</MenuItem>
                                <MenuItem value="fa-regular fa-rectangle-list">Rectangle-list</MenuItem>
                                <MenuItem value="fa-regular fa-file-lines">File-lines</MenuItem>
                            </Select>
                        </Stack>
                    </Grid>
                </Grid>
                <Grid
                    container
                    direction="row"
                    item
                    xs={12}
                    justifyContent="flex-end"
                    alignItems="center"
                    sx={{ mt: '1em' }}
                >
                    <PrimaryButton variant="contained" onClick={handleEditTab}>
                        Update Tab
                    </PrimaryButton>
                </Grid>
            </Grid>
        </Modal>
    );
};

export default EditContentTabModal;
