import React, { useContext } from 'react';
import { Grid } from '@mui/material';
import { SurveyBanner } from './SurveyBanner';
import { SurveyForm } from './SurveyForm';
import { ActionContext } from './ActionContext';
import { MetPaper } from 'components/common';
import { InvalidTokenModal } from './InvalidTokenModal';
import { useNavigate } from 'react-router';
import { EngagementLink } from './EngagementLink';
import { When } from 'react-if';
import { PreviewBanner } from './PreviewBanner';

const SurveySubmitWrapped = () => {
    const { savedSurvey, isTokenValid, slug } = useContext(ActionContext);
    const languagePath = `/${sessionStorage.getItem('languageId')}`;
    const navigate = useNavigate();
    return (
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
            <Grid item xs={12}>
                <PreviewBanner />
            </Grid>
            <Grid item xs={12}>
                <SurveyBanner />
            </Grid>
            <Grid
                container
                item
                xs={12}
                direction="row"
                justifyContent={'flex-start'}
                alignItems="flex-start"
                m={{ lg: '2em 8em 1em 3em', md: '2em', xs: '1em' }}
            >
                <Grid item container direction="row" justifyContent="flex-end">
                    <EngagementLink />
                </Grid>
                <Grid item xs={12}>
                    <MetPaper elevation={2}>
                        <When condition={isTokenValid}>
                            <SurveyForm
                                handleClose={() => {
                                    navigate(`${languagePath}/${slug}`);
                                }}
                            />
                        </When>
                        <InvalidTokenModal
                            open={!isTokenValid && Boolean(savedSurvey.engagement)}
                            handleClose={() => {
                                navigate(`${languagePath}/${slug}`);
                            }}
                        />
                    </MetPaper>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default SurveySubmitWrapped;
