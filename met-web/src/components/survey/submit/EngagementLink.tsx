import React, { useCallback } from 'react';
import { Link as MuiLink } from '@mui/material';
import { Link, useAsyncValue, useNavigate } from 'react-router-dom';
import { useAppSelector } from 'hooks';
import { When } from 'react-if';
import { useDispatch } from 'react-redux';
import { openNotificationModal } from 'services/notificationModalService/notificationModalSlice';
import { Engagement } from 'models/engagement';

export const EngagementLink = () => {
    const dispatch = useDispatch();
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const engagement = useAsyncValue() as Engagement | null;
    const navigate = useNavigate();

    const handleNavigate = useCallback(
        (link: string) => {
            if (!isLoggedIn) {
                dispatch(
                    openNotificationModal({
                        open: true,
                        data: {
                            header: 'Please Confirm',
                            subText: [
                                {
                                    text: 'Are you sure you want to leave this survey? If you return to the main page, all your progress will be lost.',
                                },
                                {
                                    text: 'You will have to start over by re-entering your email address and obtaining a new link.',
                                },
                            ],
                            confirmButtonText: 'Leave page',
                            cancelButtonText: 'Stay on this page',
                            handleConfirm: () => {
                                navigate(link); // Perform the navigation here
                            },
                        },
                        type: 'confirm',
                    }),
                );
            } else {
                navigate(link);
            }
        },
        [dispatch, navigate],
    );

    return (
        <>
            <When condition={!engagement}>
                <MuiLink
                    component={Link}
                    to={`/surveys`}
                    onClick={(e) => {
                        e.preventDefault();
                        handleNavigate('/surveys');
                    }}
                >
                    &lt;&lt; Return to survey list
                </MuiLink>
            </When>
        </>
    );
};
