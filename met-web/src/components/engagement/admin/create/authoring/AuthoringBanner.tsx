import React from 'react';
import { useOutletContext, Form, useLocation } from 'react-router-dom';
import AuthoringBottomNav from './AuthoringBottomNav';
import { EngagementUpdateData } from './AuthoringContext';
import { useFormContext } from 'react-hook-form';
import UnsavedWorkConfirmation from 'components/common/Navigation/UnsavedWorkConfirmation';
import { Box } from '@mui/material';
import { AuthoringContextType } from './types';

const AuthoringBanner = () => {
    const { onSubmit }: AuthoringContextType = useOutletContext();
    const locationArray = useLocation().pathname.split('/');
    const engagementId = locationArray[2];

    const {
        handleSubmit,
        formState: { isDirty, isValid, isSubmitting },
    } = useFormContext<EngagementUpdateData>();

    return (
        <Box>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" name="id" value={engagementId} />
                <AuthoringBottomNav isDirty={isDirty} isValid={isValid} isSubmitting={isSubmitting} />
                <UnsavedWorkConfirmation blockNavigationWhen={isDirty && !isSubmitting} />
            </Form>
        </Box>
    );
};

export default AuthoringBanner;
