import React, { useContext } from 'react';
import { Skeleton } from '@mui/material';
import { Banner } from 'components/engagement/banner/Banner';
import { ActionContext } from './ActionContext';

export const SurveyBanner = () => {
    const { isLoading, savedSurvey } = useContext(ActionContext);
    if (isLoading) {
        return <Skeleton variant="rectangular" width="100%" height="20em" />;
    }

    return <Banner savedEngagement={savedSurvey.engagement} />;
};
