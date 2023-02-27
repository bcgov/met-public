import React, { useContext } from 'react';
import { Grid, Link as MuiLink, Skeleton } from '@mui/material';
import { Link } from 'react-router-dom';
import { Banner } from 'components/engagement/banner/Banner';
import { EditForm } from './EditForm';
import { ActionContext } from './ActionContext';
import { MetPaper } from 'components/common';
import { InvalidTokenModal } from './InvalidTokenModal';
import { useNavigate } from 'react-router';
import { When } from 'react-if';
import EngagementInfoSection from 'components/engagement/banner/EngagementInfoSection';

const FormWrapped = () => {
    const { isTokenValid, isLoading, savedEngagement, submission } = useContext(ActionContext);
    const navigate = useNavigate();

    if (isLoading || !savedEngagement) {
        return <Skeleton variant="rectangular" width="100%" height="38em" />;
    }

    return (
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
            <Grid item xs={12}>
                <Banner imageUrl={savedEngagement.banner_url}>
                    <EngagementInfoSection savedEngagement={savedEngagement} />
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
                <Grid item container direction="row" justifyContent="flex-end">
                    <MuiLink component={Link} to={`/engagements/${savedEngagement.id}/view`}>
                        {`<< Return to ${savedEngagement.name} Engagement`}
                    </MuiLink>
                </Grid>
                <When condition={isTokenValid && !!submission}>
                    <Grid item xs={12}>
                        <MetPaper elevation={2}>
                            <EditForm
                                handleClose={() => {
                                    navigate(`/engagements/${savedEngagement.id}/view`);
                                }}
                            />
                        </MetPaper>
                    </Grid>
                </When>
                <InvalidTokenModal
                    open={!isTokenValid}
                    handleClose={() => {
                        navigate(`/engagements/${savedEngagement.id}/view`);
                    }}
                />
            </Grid>
        </Grid>
    );
};

export default FormWrapped;
