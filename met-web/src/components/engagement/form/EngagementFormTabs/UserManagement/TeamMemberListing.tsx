import React, { useContext } from 'react';
import { HeadCell } from 'components/common/Table/types';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import MetTable from 'components/common/Table';
import { EngagementTabsContext } from '../EngagementTabsContext';
import { ENGAGEMENT_MEMBERSHIP_STATUS_NAME, EngagementTeamMember } from 'models/engagementTeamMember';
import { formatDate } from 'components/common/dateHelper';
import { ActionsDropDown } from './ActionsDropDown';

const TeamMemberListing = () => {
    const { teamMembers, teamMembersLoading } = useContext(EngagementTabsContext);

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
        {
            key: 'status',
            numeric: false,
            disablePadding: true,
            label: 'Status',
            allowSort: false,
            renderCell: (row: EngagementTeamMember) => ENGAGEMENT_MEMBERSHIP_STATUS_NAME[row.status],
        },
        {
            key: 'created_date',
            numeric: false,
            disablePadding: true,
            label: 'Date Added',
            allowSort: false,
            renderCell: (row: EngagementTeamMember) => formatDate(row.created_date),
        },
        {
            key: 'revoked_date',
            numeric: false,
            disablePadding: true,
            label: 'Date Revoked',
            allowSort: false,
            renderCell: (row: EngagementTeamMember) => (row.revoked_date ? formatDate(row.revoked_date) : null),
        },
        {
            key: 'id',
            numeric: false,
            disablePadding: true,
            label: 'Actions',
            allowSort: false,
            customStyle: { width: '170px' },
            renderCell: (row: EngagementTeamMember) => {
                return <ActionsDropDown membership={row} />;
            },
        },
    ];

    return <MetTable headCells={headCells} rows={teamMembers} loading={teamMembersLoading} noPagination={true} />;
};

export default TeamMemberListing;
