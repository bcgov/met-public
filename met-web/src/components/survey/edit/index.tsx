import React, { Suspense } from 'react';
import SurveySubmitWrapped from './FormWrapped';
import { Await, useLoaderData } from 'react-router-dom';
import { Skeleton } from '@mui/material';
import { SurveyLoaderData } from '../building/SurveyLoader';

const SurveySubmit = () => {
    const { verification, slug, engagement, submission } = useLoaderData() as SurveyLoaderData;
    return (
        <Suspense fallback={<Skeleton variant="rectangular" width="100%" height="38em" />}>
            <Await resolve={Promise.all([verification, slug, engagement, submission])}>
                <SurveySubmitWrapped />
            </Await>
        </Suspense>
    );
};

export default SurveySubmit;
