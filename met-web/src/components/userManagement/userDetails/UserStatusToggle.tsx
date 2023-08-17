import React, { useContext, useEffect, useState } from 'react';
import { FormControlLabel, Switch, CircularProgress } from '@mui/material';
import { MetLabel } from 'components/common';
import { useAppSelector, useAppDispatch } from 'hooks';
import { UserDetailsContext } from './UserDetailsContext';
import { openNotificationModal } from 'services/notificationModalService/notificationModalSlice';
import { openNotification } from 'services/notificationService/notificationSlice';
import { toggleUserStatus } from 'services/userService/api';
import { USER_ROLES } from 'services/userService/constants';

const UserStatusToggle = () => {
    const { roles } = useAppSelector((state) => state.user);
    const { savedUser } = useContext(UserDetailsContext);
    const [userStatus, setUserStatus] = useState(false);
    const [togglingUserStatus, setTogglingUserStatus] = useState(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        console.log('savedUser', savedUser);
    }, [savedUser]);

    const handleUpdateActiveStatus = async (active: boolean) => {
        if (!savedUser) {
            return;
        }

        try {
            setUserStatus(active);
            setTogglingUserStatus(true);
            await toggleUserStatus(savedUser.external_id, active);
            setTogglingUserStatus(false);
        } catch (error) {
            setUserStatus(!active);
            setTogglingUserStatus(false);
            dispatch(openNotification({ severity: 'error', text: 'Failed to update user status' }));
        }
    };

    const handleToggleUserStatus = async (active: boolean) => {
        if (!roles.includes(USER_ROLES.TOGGLE_USER_STATUS)) {
            dispatch(
                openNotification({ severity: 'error', text: 'You do not have permissions to update user status' }),
            );
            return;
        }

        if (active) {
            return handleActivateUser();
        }

        return handleDeactivateUser();
    };
    const handleDeactivateUser = () => {
        dispatch(
            openNotificationModal({
                open: true,
                data: {
                    header: `Deactivate User`,
                    subText: [
                        {
                            text: `You are attempting to deactivate ${savedUser?.first_name} ${savedUser?.last_name}`,
                        },
                        {
                            text: 'Are you sure?',
                        },
                    ],
                    handleConfirm: () => {
                        handleUpdateActiveStatus(false);
                    },
                },
                type: 'confirm',
            }),
        );
    };

    const handleActivateUser = () => {
        dispatch(
            openNotificationModal({
                open: true,
                data: {
                    header: `Activate User`,
                    subText: [
                        {
                            text: `You are attempting to activate ${savedUser?.first_name} ${savedUser?.last_name}`,
                        },
                        {
                            text: 'Are you sure?',
                        },
                    ],
                    handleConfirm: () => {
                        handleUpdateActiveStatus(true);
                    },
                },
                type: 'confirm',
            }),
        );
    };

    return (
        <FormControlLabel
            control={
                <Switch
                    disabled={togglingUserStatus}
                    checked={userStatus}
                    onChange={(e) => handleToggleUserStatus(e.target.checked)}
                />
            }
            label={togglingUserStatus ? <CircularProgress size={20} color="info" /> : <MetLabel>Active</MetLabel>}
        />
    );
};

export default UserStatusToggle;
