import React, { useContext, useEffect } from 'react';
import { HeadCell } from 'components/common/Table/types';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import MetTable from 'components/common/Table';
import { EngagementTabsContext } from './EngagementTabsContext';
import { EngagementTeamMember } from 'models/engagementTeamMember';

const TeamMemberListing = () => {
    const { teamMembers, loadTeamMembers, teamMembersLoading } = useContext(EngagementTabsContext);

    useEffect(() => {
        if (teamMembers.length === 0) {
            loadTeamMembers();
        }
    }, []);

    const headCells: HeadCell<EngagementTeamMember>[] = [
        {
            key: 'user',
            numeric: false,
            disablePadding: true,
            label: 'Team Members',
            allowSort: false,
            renderCell: (row: EngagementTeamMember) => (
                <MuiLink component={Link} to={`/usermanagement/${row.user_id}/details`}>
                    {row.user?.last_name + ', ' + row.user?.first_name}
                </MuiLink>
            ),
        },
    ];

    return <MetTable headCells={headCells} rows={teamMembers} loading={teamMembersLoading} noPagination={true} />;
};

export default TeamMemberListing;
