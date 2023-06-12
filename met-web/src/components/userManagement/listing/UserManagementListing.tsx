import React, { useContext, useCallback } from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import SearchIcon from '@mui/icons-material/Search';
import { User } from 'models/user';
import { HeadCell, PaginationOptions } from 'components/common/Table/types';
import { MetPageGridContainer, PrimaryButton } from 'components/common';
import { Link, useNavigate } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import { useDispatch } from 'react-redux';
import MetTable from 'components/common/Table';
import { formatDate } from 'components/common/dateHelper';
import { UserManagementContext } from './UserManagementContext';
import { openNotification } from 'services/notificationService/notificationSlice';

const UserManagementListing = () => {
    const { pageInfo, paginationOptions, setPaginationOptions, users, usersLoading, setassignRoleModalOpen } =
        useContext(UserManagementContext);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleNavigate = useCallback(
        (link: string, row: User) => {
            if (!row.main_role) {
                dispatch(
                    openNotification({
                        severity: 'error',
                        text: `Please assign a role to the user ${row.last_name}, ${row.first_name} before proceeding`,
                    }),
                );
            } else {
                navigate(link);
            }
        },
        [dispatch, navigate],
    );

    const headCells: HeadCell<User>[] = [
        {
            key: 'first_name',
            numeric: false,
            disablePadding: true,
            label: 'User Name',
            allowSort: true,
            renderCell: (row: User) => (
                <MuiLink
                    to={`/usermanagement/${row.id}/details`}
                    component={Link}
                    onClick={(e) => {
                        e.preventDefault();
                        handleNavigate(`/usermanagement/${row.id}/details`, row);
                    }}
                >
                    {row.last_name + ', ' + row.first_name}
                </MuiLink>
            ),
        },
        {
            key: 'main_group',
            numeric: false,
            disablePadding: true,
            label: 'Role',
            allowSort: true,
            renderCell: (row: User) => {
                return row.main_group;
            },
        },
        {
            key: 'created_date',
            numeric: false,
            disablePadding: true,
            label: 'Date Added',
            allowSort: true,
            renderCell: (row: User) => formatDate(row.created_date),
        },
        {
            key: 'status',
            numeric: false,
            disablePadding: true,
            label: 'Status',
            allowSort: true,
            /* TODO Hardcoded value since currently we have all users as active. 
            Need to change once we have different user status */
            renderCell: () => 'Active',
        },
    ];

    return (
        <MetPageGridContainer
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            container
            columnSpacing={2}
            rowSpacing={1}
        >
            <Grid item xs={12} lg={10}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} width="100%" justifyContent="space-between">
                    <Stack direction="row" spacing={1} alignItems="center">
                        <TextField
                            id="user-name"
                            variant="outlined"
                            label="Search Users by name"
                            fullWidth
                            name="searchText"
                            size="small"
                        />
                        <PrimaryButton>
                            <SearchIcon />
                        </PrimaryButton>
                    </Stack>
                    <PrimaryButton onClick={() => setassignRoleModalOpen(true)}>+ Assign Role</PrimaryButton>
                </Stack>
            </Grid>
            <Grid item xs={12} lg={10}>
                <MetTable
                    headCells={headCells}
                    rows={users}
                    handleChangePagination={(paginationOptions: PaginationOptions<User>) =>
                        setPaginationOptions(paginationOptions)
                    }
                    paginationOptions={paginationOptions}
                    loading={usersLoading}
                    pageInfo={pageInfo}
                />
            </Grid>
        </MetPageGridContainer>
    );
};

export default UserManagementListing;
