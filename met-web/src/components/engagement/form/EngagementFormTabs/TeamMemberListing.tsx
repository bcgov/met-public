import React, { useContext, useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import SearchIcon from '@mui/icons-material/Search';
import { User } from 'models/user';
import { HeadCell, PaginationOptions } from 'components/common/Table/types';
import { MetPageGridContainer, PrimaryButton } from 'components/common';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import MetTable from 'components/common/Table';
import { formatDate } from 'components/common/dateHelper';
import { EngagementTabsContext } from './EngagementTabsContext';
import { getUserList } from 'services/userService/api';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';

const TeamMemberListing = () => {
    const { pageInfo, setPageInfo, paginationOptions, setPaginationOptions, users, setUsers } =
        useContext(EngagementTabsContext);
    const dispatch = useAppDispatch();
    const [usersLoading, setUsersLoading] = useState(false);

    useEffect(() => {
        if (users.length === 0) {
            loadUsers();
        }
    }, [users]);

    const { page, size, sort_key, nested_sort_key, sort_order } = paginationOptions;

    const loadUsers = async () => {
        try {
            setUsersLoading(true);
            const response = await getUserList({
                page,
                size,
                sort_key: nested_sort_key || sort_key,
                sort_order,
            });
            setUsers(response.items);
            setPageInfo({
                total: response.total,
            });
            setUsersLoading(false);
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while trying to fetch users, please refresh the page or try again at a later time',
                }),
            );
            setUsersLoading(false);
        }
    };

    const headCells: HeadCell<User>[] = [
        {
            key: 'first_name',
            numeric: false,
            disablePadding: true,
            label: 'Team Members',
            allowSort: true,
            getValue: (row: User) => (
                <MuiLink component={Link} to={``}>
                    {row.last_name + ', ' + row.first_name}
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
            loading={usersLoading}
            pageInfo={pageInfo}
        />
    );
};

export default TeamMemberListing;
