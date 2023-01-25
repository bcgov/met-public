import React, { useContext, useState, useEffect } from 'react';
import { HeadCell } from 'components/common/Table/types';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import MetTable from 'components/common/Table';
import { EngagementTabsContext } from './EngagementTabsContext';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { getTeamMembers } from 'services/engagementService/TeamMemberService';
import { ActionContext } from '../ActionContext';
import { EngagementTeamMember } from 'models/engagementTeamMember';

const TeamMemberListing = () => {
    const { teamMembers, setTeamMembers } = useContext(EngagementTabsContext);
    const { savedEngagement } = useContext(ActionContext);
    const dispatch = useAppDispatch();
    const [teamMembersLoading, setTeamMembersLoading] = useState(false);

    useEffect(() => {
        if (teamMembers.length === 0) {
            loadTeamMembers();
        }
    }, []);

    const loadTeamMembers = async () => {
        try {
            setTeamMembersLoading(true);
            const response = await getTeamMembers({ engagement_id: savedEngagement.id });
            setTeamMembers(response);
            setTeamMembersLoading(false);
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while trying to fetch users, please refresh the page or try again at a later time',
                }),
            );
            setTeamMembersLoading(false);
        }
    };

    const headCells: HeadCell<EngagementTeamMember>[] = [
        {
            key: 'user',
            numeric: false,
            disablePadding: true,
            label: 'Team Members',
            allowSort: false,
            getValue: (row: EngagementTeamMember) => (
                <MuiLink component={Link} to={``}>
                    {row.user?.last_name + ', ' + row.user?.first_name}
                </MuiLink>
            ),
        },
    ];

    return <MetTable headCells={headCells} rows={teamMembers} loading={teamMembersLoading} noPagination />;
};

export default TeamMemberListing;
