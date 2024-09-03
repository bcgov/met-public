import React, { useContext, useEffect, useState } from 'react';
import { Modal, Grid, Stack, TextField } from '@mui/material';
import { modalStyle, MetHeader1Old, MetLabel, PrimaryButtonOld } from 'components/common';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { ActionContext } from '../../ActionContext';
import { EngagementContent } from 'models/engagementContent';
import { postEngagementContent, patchEngagementContent } from 'services/engagementContentService';
import { EngagementContentContext } from './EngagementContentContext';

interface ContentTabModalProps {
    open: boolean;
    updateModal: (open: boolean) => void;
    tabs: EngagementContent[];
    setTabs: React.Dispatch<React.SetStateAction<EngagementContent[]>>;
    selectedTabType?: string;
    tabIndex?: number;
}

const ContentTabModal = ({ open, updateModal, tabs, setTabs, selectedTabType, tabIndex }: ContentTabModalProps) => {
    const { savedEngagement } = useContext(ActionContext);
    const { isEditMode } = useContext(EngagementContentContext);
    const dispatch = useAppDispatch();
    const [tabTitle, setTabTitle] = useState('');

    useEffect(() => {
        // Fetch tab details when modal is opened and selectedTabIndex changes
        if (open && isEditMode && typeof tabIndex === 'number' && tabs[tabIndex]) {
            setTabTitle(tabs[tabIndex].title);
        } else {
            // If not in edit mode, initialize tabTitle and tabIcon with empty values
            setTabTitle('');
        }
    }, [open, isEditMode, tabIndex, tabs]);

    const fetchData = async () => {
        const newtab = isEditMode
            ? await patchEngagementContent(savedEngagement.id, tabs[tabIndex || 0].id, {
                  title: tabTitle,
              })
            : await postEngagementContent(savedEngagement.id, {
                  title: tabTitle,
                  engagement_id: savedEngagement.id,
              });

        if (isEditMode) {
            if (newtab && Object.keys(newtab).length !== 0) {
                setTabs((prevTabs) => {
                    const newTabs = [...prevTabs];
                    newTabs[tabIndex || 0] = newtab;
                    return newTabs;
                });
            }
        } else {
            if (newtab && Object.keys(newtab).length !== 0) {
                // Update the state by adding the new tab to the existing tabs
                setTabs((prevTabs) => [...prevTabs, newtab]);
            }
        }

        dispatch(
            openNotification({
                severity: 'success',
                text: `Content tab successfully ${isEditMode ? 'updated' : 'created'}. Proceed to ${
                    isEditMode ? 'edit' : 'add'
                } details.`,
            }),
        );
        handleModalClose();
    };

    const handleModalClose = () => {
        updateModal(false);
        setTabTitle('');
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
                        <MetHeader1Old bold sx={{ mb: 2 }} data-testid={isEditMode ? 'edit-tab' : 'add-tab'}>
                            {isEditMode ? 'Edit the engagement content tab' : 'Add a new engagement content tab'}
                        </MetHeader1Old>
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
                                helperText={
                                    tabTitle.length > 50
                                        ? 'Title must not exceed 50 characters'
                                        : 'Title must be specified'
                                }
                                size="small"
                            />
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
                    <PrimaryButtonOld
                        variant="contained"
                        onClick={fetchData}
                        data-testid={isEditMode ? 'update-tab-button' : 'add-tab-button'}
                    >
                        {isEditMode ? 'Update Tab' : 'Add Tab'}
                    </PrimaryButtonOld>
                </Grid>
            </Grid>
        </Modal>
    );
};

export default ContentTabModal;
