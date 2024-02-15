import React, { useContext, useEffect, useState } from 'react';
import { PrimaryButton, SecondaryButton } from 'components/common';
import { useAppSelector, useAppDispatch } from 'hooks';
import { UserDetailsContext } from './UserDetailsContext';
import { openNotificationModal } from 'services/notificationModalService/notificationModalSlice';
import { openNotification } from 'services/notificationService/notificationSlice';
import { toggleUserStatus } from 'services/userService/api';
import { USER_ROLES } from 'services/userService/constants';
import { USER_COMPOSITE_ROLE } from 'models/user';

const UserStatusButton = () => {
    const { roles, userDetail } = useAppSelector((state) => state.user);
    const { savedUser, getUserDetails } = useContext(UserDetailsContext);
    const [userStatus, setUserStatus] = useState(false);
    const [togglingUserStatus, setTogglingUserStatus] = useState(false);
    const dispatch = useAppDispatch();

    const isActive = savedUser?.status_id === 1;

    const disabled = savedUser?.main_role === USER_COMPOSITE_ROLE.ADMIN.label || savedUser?.id === userDetail?.user?.id;

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
            getUserDetails();
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
                            text: `You will be deactivating this user from the system. This user will lose all access to the system.`,
                        },
                        {
                            text: 'Do you want to deactivate this user?',
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
                    header: `Reactivate ${savedUser?.first_name} ${savedUser?.last_name}`,
                    subText: [
                        {
                            text:
                                'You will be Reactivating this user in the system. ' +
                                'This user will regain access to the system. Once reactivated, ' +
                                'the user will be reassigned to their role and you will have to add them ' +
                                'back to engagements if Team Member/Reviewer.',
                        },
                        {
                            text: 'Do you want to Reactivate this user?',
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

    return disabled ? (
        <PrimaryButton data-testid="user-status-toggle" disabled>
            {userStatus ? 'Deactivate User' : 'Reactivate User'}
        </PrimaryButton>
    ) : (
        <SecondaryButton
            data-testid="user-status-toggle"
            loading={togglingUserStatus}
            onClick={() => handleToggleUserStatus(!userStatus)}
        >
            {userStatus ? 'Deactivate User' : 'Reactivate User'}
        </SecondaryButton>
    );
};

export default UserStatusButton;
