import React, { useContext, useState, useEffect } from 'react';
import { User } from 'models/user';
import { HeadCell, PaginationOptions } from 'components/common/Table/types';
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
    const { pageInfo, paginationOptions, setPaginationOptions, teamMembers, setTeamMembers } =
        useContext(EngagementTabsContext);
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
            key: 'id',
            numeric: false,
            disablePadding: true,
            label: 'Team Members',
            allowSort: true,
            getValue: (row: EngagementTeamMember) => (
                <MuiLink component={Link} to={``}>
                    {/* {row.last_name + ', ' + row.first_name} */}
                </MuiLink>
            ),
        },
    ];

    return (
        <MetTable
            headCells={headCells}
            rows={teamMembers}
            noRowBorder={true}
            handleChangePagination={(paginationOptions: PaginationOptions<EngagementTeamMember>) =>
                setPaginationOptions(paginationOptions)
            }
            paginationOptions={paginationOptions}
            loading={teamMembersLoading}
            pageInfo={pageInfo}
        />
    );
};

export default TeamMemberListing;
