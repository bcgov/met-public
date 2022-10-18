import React, { useContext } from 'react';
import { Link as MuiLink, Skeleton } from '@mui/material';
import { Link } from 'react-router-dom';
import { ActionContext } from './ActionContext';

export const EngagementLink = () => {
    const { savedEngagement, isEngagementLoading } = useContext(ActionContext);

    if (isEngagementLoading) {
        return <Skeleton variant="rectangular" width="15em" height="1em" />;
    }

    if (!savedEngagement) {
        return null;
    }
    return (
        <MuiLink component={Link} to={`/engagements/${savedEngagement.id}/view`}>
            {`<< Return to ${savedEngagement.name} Engagement`}
        </MuiLink>
    );
};
