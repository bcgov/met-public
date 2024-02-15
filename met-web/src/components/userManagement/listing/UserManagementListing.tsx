import React, { useContext, useState } from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import SearchIcon from '@mui/icons-material/Search';
import { USER_STATUS, User } from 'models/user';
import { HeadCell, PaginationOptions } from 'components/common/Table/types';
import { MetPageGridContainer, PrimaryButton } from 'components/common';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import MetTable from 'components/common/Table';
import { formatDate } from 'components/common/dateHelper';
import { UserManagementContext } from './UserManagementContext';
import { ActionsDropDown } from './ActionsDropDown';

const UserManagementListing = () => {
    const { pageInfo, paginationOptions, setPaginationOptions, users, usersLoading, setSearchText } =
        useContext(UserManagementContext);

    const [searchBarText, setSearchBarText] = useState('');

    const handleSearchClick = () => {
        setSearchText(searchBarText);
    };

    const headCells: HeadCell<User>[] = [
        {
            key: 'first_name',
            numeric: false,
            disablePadding: true,
            label: 'User Name',
            allowSort: true,
            renderCell: (row: User) => (
                <MuiLink to={`/usermanagement/${row.id}/details`} component={Link}>
                    {row.last_name + ', ' + row.first_name}
                </MuiLink>
            ),
        },
        {
            key: 'main_role',
            numeric: false,
            disablePadding: true,
            label: 'Role',
            allowSort: false,
            renderCell: (row: User) => {
                return row.main_role;
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
            key: 'status_id',
            numeric: false,
            disablePadding: true,
            label: 'Status',
            allowSort: true,
            renderCell: (row: User) =>
                Object.values(USER_STATUS).find((status) => status.value === row.status_id)?.label ?? '',
        },
        {
            key: 'id',
            numeric: true,
            disablePadding: false,
            label: 'Actions',
            allowSort: false,
            renderCell: (row: User) => {
                return <ActionsDropDown selectedUser={row} />;
            },
            customStyle: {
                minWidth: '200px',
            },
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
                            name="searchBarText"
                            value={searchBarText}
                            onChange={(e) => setSearchBarText(e.target.value)}
                            size="small"
                        />
                        <PrimaryButton onClick={handleSearchClick}>
                            <SearchIcon />
                        </PrimaryButton>
                    </Stack>
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
