import React, { useContext } from 'react';
import { Link as MuiLink } from '@mui/material';
import MetTable from 'components/common/Table';
import { Link } from 'react-router-dom';
import { HeadCell } from 'components/common/Table/types';
import { ENGAGEMENT_MEMBERSHIP_STATUS_NAME, EngagementTeamMember } from 'models/engagementTeamMember';
import { formatDate } from 'components/common/dateHelper';
import { UserDetailsContext } from './UserDetailsContext';
import { ActionsDropDown } from './ActionsDropDown';

export const AssignedEngagementsListing = () => {
    const { memberships, isUserLoading, isMembershipLoading } = useContext(UserDetailsContext);

    const headCells: HeadCell<EngagementTeamMember>[] = [
        {
            key: 'engagement',
            numeric: false,
            disablePadding: true,
            label: 'Engagement',
            allowSort: true,
            renderCell: (row: EngagementTeamMember) => (
                <MuiLink component={Link} to={`/engagements/${Number(row.id)}/view`}>
                    {row.engagement?.name}
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

    return (
        <MetTable
            headCells={headCells}
            rows={memberships}
            noPagination={true}
            loading={isUserLoading || isMembershipLoading}
        />
    );
};

export default AssignedEngagementsListing;
