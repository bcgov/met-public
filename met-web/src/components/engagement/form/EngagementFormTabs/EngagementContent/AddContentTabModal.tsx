import React, { useContext, useState } from 'react';
import { MenuItem, Modal, Grid, Stack, TextField, Select, SelectChangeEvent } from '@mui/material';
import { modalStyle, MetHeader1, MetLabel, PrimaryButton } from 'components/common';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { ActionContext } from '../../ActionContext';
import { EngagementContentContext } from './EngagementContentContext';
import { EngagementContent } from 'models/engagementContent';
import { postEngagementContent } from 'services/engagementContentService';

interface AddContentModalProps {
    open: boolean;
    updateModal: (open: boolean) => void;
    setTabs: React.Dispatch<React.SetStateAction<EngagementContent[]>>;
    selectedTabType: string;
}

const AddContentTabModal = ({ open, updateModal, setTabs, selectedTabType }: AddContentModalProps) => {
    const { savedEngagement } = useContext(ActionContext);
    const { setIsContentsLoading } = useContext(EngagementContentContext);
    const dispatch = useAppDispatch();
    const [tabTitle, setTabTitle] = useState('');
    const [tabIcon, setTabIcon] = useState('');

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

    const handleCreateTab = async () => {
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
            setIsContentsLoading(true);
            const newtab = await postEngagementContent(savedEngagement.id, {
                title: tabTitle,
                icon_name: tabIcon,
                content_type: selectedTabType,
                engagement_id: savedEngagement.id,
            });

            if (newtab && Object.keys(newtab).length !== 0) {
                // Update the state by adding the new tab to the existing tabs
                setTabs((prevTabs) => [...prevTabs, newtab]);
            }

            dispatch(
                openNotification({
                    severity: 'success',
                    text: 'Content tab successfully created. Proceed to add details',
                }),
            );
            setIsContentsLoading(false);
            handleModalClose();
        } catch (error) {
            setIsContentsLoading(false);
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while creating engagement content' }));
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
                            Add a new engagement content tab
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
                                <MenuItem value="faRectangleList">Rectangle-list</MenuItem>
                                <MenuItem value="faFileLines">File-lines</MenuItem>
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
                    <PrimaryButton variant="contained" onClick={handleCreateTab}>
                        Add Tab
                    </PrimaryButton>
                </Grid>
            </Grid>
        </Modal>
    );
};

export default AddContentTabModal;
