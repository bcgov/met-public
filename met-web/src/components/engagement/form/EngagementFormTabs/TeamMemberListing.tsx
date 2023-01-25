import React, { useContext, useState, useEffect } from 'react';
import { User } from 'models/user';
import { HeadCell, PaginationOptions } from 'components/common/Table/types';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import MetTable from 'components/common/Table';
import { EngagementTabsContext } from './EngagementTabsContext';
import { getUserList } from 'services/userService/api';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { getTeamMembers } from 'services/engagementService/TeamMemberService';
import { ActionContext } from '../ActionContext';
import { EngagementTeamMember } from 'models/engagementTeamMember';

const TeamMemberListing = () => {
    const {
        pageInfo,
        setPageInfo,
        paginationOptions,
        setPaginationOptions,
        users,
        setUsers,
        teamMembers,
        setTeamMembers,
    } = useContext(EngagementTabsContext);
    const { savedEngagement } = useContext(ActionContext);
    const dispatch = useAppDispatch();
    const [teamMembersLoading, setTeamMembersLoading] = useState(false);

    useEffect(() => {
        if (users.length === 0) {
            loadUsers();
        }
    }, []);

    const loadUsers = async () => {
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
            rows={users}
            noRowBorder={true}
            handleChangePagination={(paginationOptions: PaginationOptions<User>) =>
                setPaginationOptions(paginationOptions)
            }
            paginationOptions={paginationOptions}
            loading={teamMembersLoading}
            pageInfo={pageInfo}
        />
    );
};

export default TeamMemberListing;
