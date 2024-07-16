import { Autocomplete, Avatar, Box, Grid, IconButton, PaperProps, Popper, PopperProps, TextField } from '@mui/material';
import { textInputStyles } from 'components/common/Input/TextInput';
import { User, USER_COMPOSITE_ROLE } from 'models/user';
import React, { useEffect, useRef } from 'react';
import { useFetcher } from 'react-router-dom';
import { BodyText } from 'components/common/Typography';
import { When } from 'react-if';
import { Button } from 'components/common/Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faChevronDown, faPlus, faXmark } from '@fortawesome/pro-regular-svg-icons';
import { colors } from 'styles/Theme';
import { MetPaper } from 'components/common';
import { useFormContext } from 'react-hook-form';
import { useAppSelector } from 'hooks';
import { debounce } from 'lodash';

export const UserManager = () => {
    const currentUser = useAppSelector((state) => state.user);
    const fetcher = useFetcher();

    const engagementForm = useFormContext();
    const { setValue, watch } = engagementForm;
    const selectedUsers = watch('users') as User[];

    const [searchTerm, setSearchTerm] = React.useState('');
    const [resultUser, setResultUser] = React.useState<User | null>(null);

    const defaultSearchOptions = new URLSearchParams({
        searchTerm: '',
        includeRoles: 'true',
        sortKey: 'last_name',
        sortOrder: 'asc',
        page: '1',
        size: '100',
    });

    const debouncedSearch = useRef(
        debounce(
            (q) => {
                defaultSearchOptions.set('searchTerm', q);
                fetcher.load(`/usermanagement/search?${defaultSearchOptions.toString()}`);
            },
            500,
            { maxWait: 1000, leading: true, trailing: true },
        ),
    );

    useEffect(() => {
        debouncedSearch.current(searchTerm);
    }, [searchTerm]);

    const users = (fetcher.data?.users?.items as User[] | undefined)?.filter(
        (user) =>
            // Remove ourselves from the list
            user.id !== currentUser.userDetail.user?.id &&
            // Remove admins from the list - they can already see everything and will cause an error if specified
            user.main_role !== USER_COMPOSITE_ROLE.ADMIN.label,
    );

    const handleAddUser = () => {
        if (resultUser && !selectedUsers.filter((u) => u.id === resultUser.id).length) {
            setValue('users', [...selectedUsers, resultUser]);
        }
        setResultUser(null);
        setSearchTerm('');
    };

    const handleRemoveUser = (user: User) => {
        setValue(
            'users',
            selectedUsers.filter((u) => u !== user),
        );
    };

    return (
        <Box width="100%">
            <BodyText bold size="small">
                Add Team Members
            </BodyText>
            <Autocomplete
                openOnFocus
                value={resultUser}
                popupIcon={
                    <FontAwesomeIcon icon={faChevronDown} style={{ width: '16px', height: '16px', padding: '4px' }} />
                }
                PopperComponent={SearchPopper}
                PaperComponent={SearchPaper}
                onChange={(_, newValue) => setResultUser(newValue)}
                options={users ?? []}
                loading={fetcher.state === 'loading'}
                getOptionLabel={(option: User) => `${option.first_name} ${option.last_name}`}
                groupBy={(option: User) => option.last_name[0]}
                getOptionDisabled={(option) => selectedUsers.filter((u) => u.id === option.id).length > 0}
                sx={{ maxWidth: '320px' }}
                renderOption={(props, option, state) => {
                    return (
                        <li {...props}>
                            <Grid container direction="row" spacing={2} alignItems={'center'}>
                                <Grid item>
                                    <Avatar
                                        sx={{
                                            height: '30px',
                                            width: '30px',
                                            fontSize: '16px',
                                            backgroundColor: props['aria-disabled']
                                                ? colors.notification.success.shade
                                                : 'primary.light',
                                        }}
                                    >
                                        {props['aria-disabled'] ? (
                                            <FontAwesomeIcon icon={faCheck} />
                                        ) : (
                                            `${option.first_name[0]}${option.last_name[0]}`
                                        )}
                                    </Avatar>
                                </Grid>
                                <Grid item>{`${option.first_name} ${option.last_name}`}</Grid>
                            </Grid>
                        </li>
                    );
                }}
                renderInput={(params) => {
                    return (
                        <TextField
                            value={searchTerm}
                            onBlur={() => setSearchTerm('')}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            {...params}
                            InputProps={{
                                ...params.InputProps,
                                placeholder: 'Select Team Member',
                                sx: textInputStyles,
                            }}
                            inputProps={{
                                ...params.inputProps,
                                sx: {
                                    fontSize: '16px',
                                    lineHeight: '24px',
                                    color: colors.type.regular.primary,
                                    '&::placeholder': {
                                        color: colors.type.regular.secondary,
                                    },
                                    '&:disabled': {
                                        cursor: 'not-allowed',
                                    },
                                },
                            }}
                        />
                    );
                }}
            />
            <When condition={resultUser !== null}>
                <Button
                    sx={{ mt: 2 }}
                    variant="primary"
                    icon={<FontAwesomeIcon icon={faPlus} />}
                    onClick={handleAddUser}
                >
                    Add Team Member
                </Button>
            </When>
            <When condition={selectedUsers.length}>
                <Grid
                    container
                    spacing={2}
                    direction="column"
                    sx={{
                        mt: 2,
                        ml: 0,
                        pb: 2,
                        pr: 2,
                        border: '1px solid',
                        borderColor: 'primary.light',
                        borderRadius: '8px',
                        width: '300px',
                    }}
                >
                    <Grid item>
                        <BodyText bold color="primary.light">
                            Team Member{selectedUsers.length > 1 && 's'} Added
                        </BodyText>
                    </Grid>
                    {selectedUsers.map((user) => (
                        <Grid item container key={user.id} direction="row" spacing={2} alignItems={'center'}>
                            <Grid item>
                                <Avatar
                                    sx={{
                                        height: '30px',
                                        width: '30px',
                                        fontSize: '16px',
                                        backgroundColor: 'primary.light',
                                    }}
                                >
                                    {user.first_name[0]}
                                    {user.last_name[0]}
                                </Avatar>
                            </Grid>
                            <Grid item>{`${user.first_name} ${user.last_name}`}</Grid>
                            <Grid item alignSelf="flex-end" marginLeft="auto">
                                <IconButton
                                    sx={{ height: '16px', width: '16px' }}
                                    onClick={() => handleRemoveUser(user)}
                                >
                                    <FontAwesomeIcon fontSize={16} icon={faXmark} />
                                </IconButton>
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
            </When>
        </Box>
    );
};

const SearchPaper = (props: PaperProps) => <MetPaper {...props} children={props.children ?? []} />;
const SearchPopper = (props: PopperProps) => (
    <Popper
        {...props}
        keepMounted
        placement="bottom-end"
        disablePortal
        modifiers={[{ name: 'offset', options: { offset: [0, 8] } }]}
    />
);
