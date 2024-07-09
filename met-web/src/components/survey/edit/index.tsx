import React, { Suspense } from 'react';
import SurveySubmitWrapped from './FormWrapped';
import { Await, useLoaderData } from 'react-router-dom';
import { Survey } from 'models/survey';
import { EmailVerification } from 'models/emailVerification';
import { Skeleton } from '@mui/material';
import { Engagement } from 'models/engagement';
import { SurveySubmission } from 'models/surveySubmission';

const SurveySubmit = () => {
    const { verification, slug, engagement, submission } = useLoaderData() as {
        verification: Promise<EmailVerification>;
        slug: Promise<{ slug: string }>;
        engagement: Engagement;
        submission: SurveySubmission;
    };
    return (
        <Suspense fallback={<Skeleton variant="rectangular" width="100%" height="38em" />}>
            <Await resolve={Promise.all([verification, slug, engagement, submission])}>
                <SurveySubmitWrapped />
            </Await>
        </Suspense>
    );
};

export default SurveySubmit;
