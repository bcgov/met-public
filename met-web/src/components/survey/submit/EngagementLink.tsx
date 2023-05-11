import React, { useContext } from 'react';
import { Link as MuiLink, Skeleton } from '@mui/material';
import { Link } from 'react-router-dom';
import { ActionContext } from './ActionContext';
import { When } from 'react-if';

export const EngagementLink = () => {
    const { savedEngagement, isEngagementLoading } = useContext(ActionContext);

    if (isEngagementLoading) {
        return <Skeleton variant="rectangular" width="15em" height="1em" />;
    }

    if (!savedEngagement) {
        return null;
    }

    return (
        <>
            <When condition={!!savedEngagement.id}>
                <MuiLink component={Link} to={`/engagements/${savedEngagement.id}/view`}>
                    {`<< Return to ${savedEngagement.name} Engagement`}
                </MuiLink>
            </When>
            <When condition={!savedEngagement.id}>
                <MuiLink component={Link} to={'/surveys'}>
                    {`<< Return to survey list`}
                </MuiLink>
            </When>
        </>
    );
};
