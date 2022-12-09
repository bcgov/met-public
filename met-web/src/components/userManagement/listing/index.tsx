import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import SearchIcon from '@mui/icons-material/Search';
import { User } from 'models/user';
import { createDefaultPageInfo, PageInfo, HeadCell, PaginationOptions } from 'components/common/Table/types';
import { MetPageGridContainer, PrimaryButton } from 'components/common';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import UserService from 'services/userService';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import MetTable from 'components/common/Table';
import { formatDate } from 'components/common/dateHelper';

const UserManagementListing = () => {
    const [users, setUsers] = useState<User[]>([]);

    const dispatch = useAppDispatch();

    const [pageInfo, setPageInfo] = useState<PageInfo>(createDefaultPageInfo());
    const [tableLoading, setTableLoading] = useState(true);

    const [paginationOptions, setPaginationOptions] = useState<PaginationOptions<User>>({
        page: 1,
        size: 10,
        sort_key: 'first_name',
        nested_sort_key: 'first_name',
        sort_order: 'desc',
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setTableLoading(true);
            const response = await UserService.getUserList();
            setUsers(JSON.parse(JSON.stringify(response)).data);
            setPageInfo({
                total: 0,
            });
            setTableLoading(false);
        } catch (error) {
            console.log(error);
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while trying to fetch engagements, please refresh the page or try again at a later time',
                }),
            );
            setTableLoading(false);
        }
    };

    const headCells: HeadCell<User>[] = [
        {
            key: 'first_name',
            numeric: false,
            disablePadding: true,
            label: 'User Name',
            allowSort: true,
            getValue: (row: User) => (
                <MuiLink component={Link} to={``}>
                    {row.first_name + ' ' + row.last_name}
                </MuiLink>
            ),
        },
        {
            key: 'groups',
            numeric: false,
            disablePadding: true,
            label: 'Role',
            allowSort: true,
            getValue: (row: User) => row.groups,
        },
        {
            key: 'created_date',
            numeric: false,
            disablePadding: true,
            label: 'Date Added',
            allowSort: true,
            getValue: (row: User) => formatDate(row.created_date),
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
                    <PrimaryButton component={Link} to="" data-testid="">
                        + Add User
                    </PrimaryButton>
                </Stack>
            </Grid>
            <Grid item xs={12} lg={10}>
                <MetTable
                    headCells={headCells}
                    rows={users}
                    noRowBorder={true}
                    handleChangePagination={(paginationOptions: PaginationOptions<User>) =>
                        setPaginationOptions(paginationOptions)
                    }
                    paginationOptions={paginationOptions}
                    loading={tableLoading}
                    pageInfo={pageInfo}
                />
            </Grid>
        </MetPageGridContainer>
    );
};

export default UserManagementListing;
