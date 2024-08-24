import React from 'react';
import { useOutletContext, Form, useParams } from 'react-router-dom';
import AuthoringBottomNav from './AuthoringBottomNav';
import { EngagementUpdateData } from './AuthoringContext';
import { useFormContext } from 'react-hook-form';
import UnsavedWorkConfirmation from 'components/common/Navigation/UnsavedWorkConfirmation';
import { Box } from '@mui/material';
import { AuthoringContextType } from './types';

const AuthoringBanner = () => {
    const { onSubmit }: AuthoringContextType = useOutletContext();
    const { engagementId } = useParams() as { engagementId: string };

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
