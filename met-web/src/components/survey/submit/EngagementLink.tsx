import React, { useContext, useCallback } from 'react';
import { Link as MuiLink, Skeleton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from 'hooks';
import { ActionContext } from './ActionContext';
import { When } from 'react-if';
import { useDispatch } from 'react-redux';
import { openNotificationModal } from 'services/notificationModalService/notificationModalSlice';

export const EngagementLink = () => {
    const dispatch = useDispatch();
    const { savedEngagement, isEngagementLoading, slug } = useContext(ActionContext);
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
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

    if (isEngagementLoading) {
        return <Skeleton variant="rectangular" width="15em" height="1em" />;
    }

    if (!savedEngagement) {
        return null;
    }

    return (
        <>
            <When condition={!!savedEngagement.id}>
                <MuiLink component={Link} to={slug ? `/${slug}` : `/engagements/${savedEngagement.id}/view`}>
                    {`<< Return to ${savedEngagement.name} Engagement`}
                </MuiLink>
            </When>
            <When condition={!savedEngagement.id}>
                <MuiLink
                    component={Link}
                    to={`/surveys`}
                    onClick={(e) => {
                        e.preventDefault();
                        handleNavigate('/surveys');
                    }}
                >
                    {`<< Return to survey list`}
                </MuiLink>
            </When>
        </>
    );
};
