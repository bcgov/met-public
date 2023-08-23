import React, { useContext, useEffect, useState } from 'react';
import { SecondaryButton } from 'components/common';
import { useAppSelector, useAppDispatch } from 'hooks';
import { UserDetailsContext } from './UserDetailsContext';
import { openNotificationModal } from 'services/notificationModalService/notificationModalSlice';
import { openNotification } from 'services/notificationService/notificationSlice';
import { toggleUserStatus } from 'services/userService/api';
import { USER_ROLES } from 'services/userService/constants';
import { USER_GROUP } from 'models/user';

const UserStatusButton = () => {
    const { roles } = useAppSelector((state) => state.user);
    const { savedUser } = useContext(UserDetailsContext);
    const [userStatus, setUserStatus] = useState(false);
    const [togglingUserStatus, setTogglingUserStatus] = useState(false);
    const dispatch = useAppDispatch();

    const isActive = savedUser?.status_id === 1;

    useEffect(() => {
        setUserStatus(isActive);
    }, [savedUser]);

    const handleUpdateActiveStatus = async (active: boolean) => {
        if (!savedUser) {
            return;
        }

        try {
            setUserStatus(active);
            setTogglingUserStatus(true);
            await toggleUserStatus(savedUser.external_id, active);
            dispatch(
                openNotification({
                    severity: 'success',
                    text: `You have successfully ${active ? 'activated' : 'deactivated'} ${savedUser.first_name} ${
                        savedUser.last_name
                    }.`,
                }),
            );
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
                    header: `Deactivate ${savedUser?.first_name} ${savedUser?.last_name}`,
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
                    header: `Activate ${savedUser?.first_name} ${savedUser?.last_name}`,
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
        <SecondaryButton
            data-testid="user-status-toggle"
            loading={togglingUserStatus}
            onClick={() => handleToggleUserStatus(!userStatus)}
            disabled={savedUser?.main_group === USER_GROUP.ADMIN.label}
        >
            {userStatus ? 'Deactivate User' : 'Activate User'}
        </SecondaryButton>
    );
};

export default UserStatusButton;
