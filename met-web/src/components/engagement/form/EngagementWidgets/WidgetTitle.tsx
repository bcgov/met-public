import React, { useContext } from 'react';
import { MetHeader3, PrimaryButtonOld } from 'components/common';
import { Widget } from 'models/widget';
import { CircularProgress, IconButton, Stack, TextField } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/pro-regular-svg-icons/faPen';
import { Else, If, Then } from 'react-if';
import { useUpdateWidgetMutation } from 'apiManager/apiSlices/widgets';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { WidgetDrawerContext } from './WidgetDrawerContext';

export const WidgetTitle = ({ widget }: { widget: Widget }) => {
    const [editing, setEditing] = React.useState(false);
    const [title, setTitle] = React.useState(widget.title);
    const [updateWidget] = useUpdateWidgetMutation();
    const dispatch = useAppDispatch();
    const { setWidgets } = useContext(WidgetDrawerContext);
    const [isSaving, setIsSaving] = React.useState(false);

    const saveTitle = async () => {
        if (title === widget.title) {
            setEditing(false);
            return;
        }
        try {
            setIsSaving(true);
            const response = await updateWidget({
                id: widget.id,
                engagementId: widget.engagement_id,
                data: {
                    title,
                },
            }).unwrap();
            setWidgets((prevWidgets) => {
                const updatedWidget = prevWidgets.find((prevWidget) => prevWidget.id === widget.id);
                if (updatedWidget) {
                    updatedWidget.title = response?.title || '';
                }
                return [...prevWidgets];
            });
            dispatch(openNotification({ severity: 'success', text: 'Widget title successfully updated' }));
            setIsSaving(false);
            setEditing(false);
        } catch {
            setIsSaving(false);
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while updating widget title' }));
        }
    };

    const handleTitleChange = (text: string) => {
        setTitle(text);
    };

    return (
        <If condition={editing}>
            <Then>
                <Stack
                    direction={'row'}
                    spacing={1}
                    alignItems={'flex-start'}
                    justifyContent={'space-between'}
                    width={'100%'}
                >
                    <TextField
                        name="title"
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        inputProps={{ maxLength: 100 }}
                        fullWidth
                    />
                    <If condition={isSaving}>
                        <Then>
                            <CircularProgress size={20} color="info" />
                        </Then>
                        <Else>
                            <PrimaryButtonOld
                                onClick={() => {
                                    saveTitle();
                                }}
                            >
                                Save
                            </PrimaryButtonOld>
                        </Else>
                    </If>
                </Stack>
            </Then>
            <Else>
                <Stack
                    direction={'row'}
                    spacing={1}
                    alignItems={'flex-start'}
                    justifyContent={'space-between'}
                    width={'100%'}
                >
                    <MetHeader3>{widget.title}</MetHeader3>
                    <IconButton
                        sx={{ paddingY: 0 }}
                        onClick={() => {
                            setEditing(true);
                        }}
                    >
                        <FontAwesomeIcon icon={faPen} style={{ fontSize: '22px', color: '#757575' }} />
                    </IconButton>
                </Stack>
            </Else>
        </If>
    );
};
