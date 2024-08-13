import React, { Suspense } from 'react';
import { Grid } from '@mui/material';
import { Banner } from 'components/banner/Banner';
import { EditForm } from './EditForm';
import { MetPaper } from 'components/common';
import { InvalidTokenModal } from '../submit/InvalidTokenModal';
import { When } from 'react-if';
import EngagementInfoSection from 'components/engagement/old-view/EngagementInfoSection';
import { Await, useAsyncValue, useNavigate } from 'react-router-dom';
import { EmailVerification } from 'models/emailVerification';
import { Engagement } from 'models/engagement';
import { SurveySubmission } from 'models/surveySubmission';

const FormWrapped = () => {
    const navigate = useNavigate();
    const languagePath = `/${sessionStorage.getItem('languageId')}`;
    const [verification, slug, engagement, submission] = useAsyncValue() as [
        EmailVerification | null,
        { slug: string },
        Engagement,
        SurveySubmission,
    ];
    const engagementPath = slug ? `${slug}/${languagePath}` : `engagements/${engagement?.id}/view/${languagePath}`;
    const isTokenValid = !!verification;

    return (
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
            <Grid item xs={12}>
                <Banner imageUrl={engagement.banner_url}>
                    <EngagementInfoSection savedEngagement={engagement} />
                </Banner>
            </Grid>
            <Grid
                container
                item
                xs={12}
                direction="row"
                justifyContent={'flex-start'}
                alignItems="flex-start"
                m={{ lg: '0 8em 1em 3em', md: '2em', xs: '1em' }}
            >
                <When condition={isTokenValid && !!submission}>
                    <Grid item xs={12}>
                        <MetPaper elevation={2}>
                            <EditForm
                                handleClose={() => {
                                    navigate(engagementPath);
                                }}
                            />
                        </MetPaper>
                    </Grid>
                </When>

                <Suspense>
                    <Await resolve={Promise.allSettled([verification, slug])}>
                        <InvalidTokenModal />
                    </Await>
                </Suspense>
            </Grid>
        </Grid>
    );
};

export default FormWrapped;
