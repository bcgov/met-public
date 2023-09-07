import React, { useContext, useRef } from 'react';
import { Grid, Skeleton } from '@mui/material';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { MetDraggable, MetDroppable } from 'components/common/Dragdrop';
import { reorder } from 'utils';
import SubscribeInfoPaper from './SubscribeInfoPaper';
import { When } from 'react-if';
import { debounce } from 'lodash';
import { deleteSubscribeForm } from 'services/subscriptionService';
import { useAppDispatch } from 'hooks';
import { openNotificationModal } from 'services/notificationModalService/notificationModalSlice';
import { openNotification } from 'services/notificationService/notificationSlice';
import { SubscribeContext } from './SubscribeContext';
import { SUBSCRIBE_TYPE, SubscribeForm } from 'models/subscription';

const SubscribeInfoBlock = () => {
    const {
        subscribeOptions,
        setSubscribeOptions,
        isLoadingSubscribe,
        updateWidgetSubscribeSorting,
        widget,
        loadSubscribeOptions,
    } = useContext(SubscribeContext);
    const dispatch = useAppDispatch();
    const debounceUpdateWidgetSubscribeSorting = useRef(
        debounce((widgetSubscribeToSort: SubscribeForm[]) => {
            updateWidgetSubscribeSorting(widgetSubscribeToSort);
        }, 800),
    ).current;

    const moveSubscribeForm = (result: DropResult) => {
        if (!result.destination) {
            return;
        }

        const items: SubscribeForm[] = reorder(subscribeOptions, result.source.index, result.destination.index);

        setSubscribeOptions(items);

        debounceUpdateWidgetSubscribeSorting(items);
    };

    if (isLoadingSubscribe) {
        return (
            <Grid container direction="row" alignItems={'flex-start'} justifyContent="flex-start" spacing={2}>
                <Grid item xs={12}>
                    <Skeleton variant="rectangular" width="100%" height="12em" />
                </Grid>
            </Grid>
        );
    }

    const handleRemoveSubscribeForm = (subscribeFormId: number) => {
        dispatch(
            openNotificationModal({
                open: true,
                data: {
                    header: 'Remove Subscribe Form',
                    subText: [
                        {
                            text: 'You will be removing this subscribeOptions form from the engagement.',
                        },
                        {
                            text: 'Do you want to remove this subscribeOptions form?',
                        },
                    ],
                    handleConfirm: () => {
                        removeSubscribeForm(subscribeFormId);
                    },
                },
                type: 'confirm',
            }),
        );
    };

    const removeSubscribeForm = async (subscribeFormId: number) => {
        try {
            if (widget) {
                await deleteSubscribeForm(widget.id, subscribeFormId);
                subscribeOptions.filter((subscribeForm) => subscribeForm.id !== subscribeFormId);
                loadSubscribeOptions();
                dispatch(
                    openNotification({
                        severity: 'success',
                        text: 'The subscribeOptions form was removed successfully',
                    }),
                );
            }
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'An error occurred while trying to remove subscribeOptions form',
                }),
            );
        }
    };

    return (
        <DragDropContext onDragEnd={moveSubscribeForm}>
            <MetDroppable droppableId="droppable">
                <Grid container direction="row" alignItems={'flex-start'} justifyContent="flex-start" spacing={2}>
                    {subscribeOptions.map((subscribeForm: SubscribeForm, index: number) => {
                        return (
                            <Grid item xs={12} key={`Grid-${subscribeForm.widget_id}`}>
                                <MetDraggable draggableId={String(subscribeForm.widget_id)} index={index}>
                                    <When condition={subscribeForm.type === SUBSCRIBE_TYPE.EMAIL_LIST}>
                                        <SubscribeInfoPaper
                                            removeSubscribeForm={handleRemoveSubscribeForm}
                                            subscribeForm={subscribeForm}
                                        />
                                    </When>
                                    <When condition={subscribeForm.type === SUBSCRIBE_TYPE.SIGN_UP}>
                                        <SubscribeInfoPaper
                                            removeSubscribeForm={handleRemoveSubscribeForm}
                                            subscribeForm={subscribeForm}
                                        />
                                    </When>
                                </MetDraggable>
                            </Grid>
                        );
                    })}
                </Grid>
            </MetDroppable>
        </DragDropContext>
    );
};

export default SubscribeInfoBlock;
