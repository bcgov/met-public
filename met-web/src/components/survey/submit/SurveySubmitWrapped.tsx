import React, { useContext } from 'react';
import { Grid, Link as MuiLink } from '@mui/material';
import { SurveyBanner } from './SurveyBanner';
import { SurveyForm } from './SurveyForm';
import { ActionContext } from './ActionContext';
import { Link } from 'react-router-dom';
import { ConditionalComponent, MetPaper } from 'components/common';
import { InvalidTokenModal } from './InvalidTokenModal';
import { useNavigate } from 'react-router';

const SurveySubmitWrapped = () => {
    const { savedSurvey, isTokenValid } = useContext(ActionContext);
    const navigate = useNavigate();
    return (
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
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
                m={{ lg: '0 8em 1em 3em', md: '2em', xs: '1em' }}
                rowSpacing={2}
            >
                <Grid item container direction="row" justifyContent="flex-end">
                    <MuiLink component={Link} to={`/engagement/${savedSurvey.engagement.id}/view`}>
                        {`<< Return to ${savedSurvey.engagement.name} Engagement`}
                    </MuiLink>
                </Grid>
                <Grid item xs={12}>
                    <MetPaper elevation={2}>
                        <ConditionalComponent condition={isTokenValid}>
                            <SurveyForm
                                handleClose={() => {
                                    navigate(`/engagement/${savedSurvey.engagement.id}/view`);
                                }}
                            />
                        </ConditionalComponent>
                        <InvalidTokenModal
                            open={!isTokenValid}
                            handleClose={() => {
                                navigate(`/engagement/${savedSurvey.engagement.id}/view`);
                            }}
                        />
                    </MetPaper>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default SurveySubmitWrapped;
