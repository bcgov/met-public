import React, { useContext } from 'react';
import { Header3 } from 'components/common/Typography';
import { Button } from 'components/common/Input/Button';
import { Widget } from 'models/widget';
import { IconButton, Grid2 as Grid } from '@mui/material';
import { TextInput } from 'components/common/Input/TextInput';
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
                <Grid container spacing={1} alignItems="center" size={12} mt={2}>
                    <TextInput
                        name="title"
                        value={title}
                        onChange={(value) => handleTitleChange(value)}
                        inputProps={{ maxLength: 100 }}
                        fullWidth
                    />

                    <Button
                        loading={isSaving}
                        variant="primary"
                        onClick={() => {
                            saveTitle();
                        }}
                    >
                        Save
                    </Button>
                </Grid>
            </Then>
            <Else>
                <Grid container size={12} spacing={1} alignItems="center" mt={2}>
                    <Grid size="grow">
                        <Header3 weight="bold" width="max-content">
                            {widget.title}
                        </Header3>
                    </Grid>
                    <Grid size="auto">
                        <IconButton
                            onClick={() => {
                                setEditing(true);
                            }}
                        >
                            <FontAwesomeIcon icon={faPen} style={{ fontSize: '22px', color: '#757575' }} />
                        </IconButton>
                    </Grid>
                </Grid>
            </Else>
        </If>
    );
};
