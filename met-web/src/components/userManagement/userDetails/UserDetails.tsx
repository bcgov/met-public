import React, { useContext, useState, ChangeEvent } from 'react';
import { Grid, FormControlLabel, Switch, Stack } from '@mui/material';
import { useNavigate } from 'react-router';
import { MetLabel, MetParagraph, MetPageGridContainer, PrimaryButton } from 'components/common';
import MetTable from 'components/common/Table';
import { User } from 'models/user';
import { HeadCell, PaginationOptions } from 'components/common/Table/types';
import { ActionContext } from './UserActionProvider';

export const UserDetails = () => {
    const { savedUser, isUserLoading } = useContext(ActionContext);
    const [superUserAssigned, setSuperUser] = useState(false);
    const [deactivatedUser, setDeactivatedUser] = useState(false);
    const handleToggleChange = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setSuperUser(!superUserAssigned);
    };
    const handleUserDeactivated = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setDeactivatedUser(!deactivatedUser);
    };

    const headCells: HeadCell<User>[] = [
        {
            key: 'last_name',
            numeric: false,
            disablePadding: true,
            label: 'Engagement',
            allowSort: true,
            renderCell: (row: User) => row.last_name,
        },
        {
            key: 'first_name',
            numeric: false,
            disablePadding: true,
            label: 'Added By',
            allowSort: true,
            renderCell: (row: User) => {
                return row.first_name;
            },
        },
        {
            key: 'created_date',
            numeric: false,
            disablePadding: true,
            label: 'Date Added',
            allowSort: true,
            renderCell: (row: User) => row.created_date,
        },
    ];

    return (
        <MetPageGridContainer>
            <Grid container direction="row" item rowSpacing={1} sx={{ mb: 4 }}>
                <Grid container direction="row" item xs={6} spacing={1}>
                    <Grid item>
                        <MetLabel>User:</MetLabel>
                    </Grid>
                    <Grid item>
                        <MetParagraph sx={{ pl: 2 }}>{savedUser?.first_name}</MetParagraph>
                    </Grid>
                </Grid>

                <Grid container direction="row" item xs={6} spacing={1}>
                    <Grid item>
                        <MetLabel>Role:</MetLabel>
                    </Grid>
                    <Grid item>
                        <MetParagraph sx={{ pl: 2 }}>{savedUser?.roles[0]}</MetParagraph>
                    </Grid>
                </Grid>

                <Grid container direction="row" item xs={6} spacing={1}>
                    <Grid item>
                        <MetLabel>Status:</MetLabel>
                    </Grid>
                    <Grid item>
                        <MetParagraph sx={{ pl: 2 }}>{savedUser?.email_id}</MetParagraph>
                    </Grid>
                </Grid>

                <Grid container direction="row" item xs={6} spacing={1}>
                    <Stack direction="row">
                        <MetLabel>Assign SuperUser Role:</MetLabel>{' '}
                        <FormControlLabel
                            sx={{ border: '2px solid red', p: 0 }}
                            control={<Switch checked={superUserAssigned} onChange={handleToggleChange} />}
                            label=""
                        />
                    </Stack>
                </Grid>

                <Grid container direction="row" item xs={6} spacing={1}>
                    <Grid item>
                        <MetLabel>Date Added:</MetLabel>
                    </Grid>
                    <Grid item>
                        <MetParagraph sx={{ pl: 2 }}>{savedUser?.created_date}</MetParagraph>
                    </Grid>
                </Grid>
                <Grid container direction="row" item xs={6} spacing={1}>
                    <Stack direction="row">
                        <MetLabel>Deactivate User:</MetLabel>{' '}
                        <FormControlLabel
                            sx={{ border: '2px solid red', p: 0 }}
                            control={<Switch checked={superUserAssigned} onChange={handleUserDeactivated} />}
                            label=""
                        />
                    </Stack>
                </Grid>
            </Grid>
            <Grid item xs={6}></Grid>
            <Grid item xs={6}></Grid>
            <Grid item xs={6}>
                <PrimaryButton>+ Add an Engagement</PrimaryButton>
            </Grid>
            <Grid item xs={12} lg={10}>
                {/* <MetTable
                    headCells={headCells}
                    rows={users}
                    handleChangePagination={(paginationOptions: PaginationOptions<User>) =>
                        setPaginationOptions(paginationOptions)
                    }
                    paginationOptions={paginationOptions}
                    loading={usersLoading}
                    pageInfo={pageInfo}
                /> */}
            </Grid>
        </MetPageGridContainer>
    );
};

export default UserDetails;
