import React, { createContext, useState, useEffect } from 'react';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { createDefaultPageInfo, PageInfo, PaginationOptions } from 'components/common/Table/types';
import { User, createDefaultUser } from 'models/user';
import { getUserList } from 'services/userService/api';
import { useLocation } from 'react-router-dom';
import { updateURLWithPagination } from 'components/common/Table/utils';

export interface UserManagementContextProps {
    usersLoading: boolean;
    pageInfo: PageInfo;
    users: User[];
    paginationOptions: PaginationOptions<User>;
    setPaginationOptions: React.Dispatch<React.SetStateAction<PaginationOptions<User>>>;
    addUserModalOpen: boolean;
    setAddUserModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    assignRoleModalOpen: boolean;
    setassignRoleModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
    loadUserListing: () => void;
}

export type EngagementParams = {
    engagementId: string;
};

export const UserManagementContext = createContext<UserManagementContextProps>({
    usersLoading: true,
    pageInfo: createDefaultPageInfo(),
    users: [],
    paginationOptions: {
        page: 0,
        size: 0,
    },
    setPaginationOptions: () => {
        throw new Error('Not implemented');
    },
    addUserModalOpen: false,
    setAddUserModalOpen: () => {
        throw new Error('Not implemented');
    },
    assignRoleModalOpen: false,
    setassignRoleModalOpen: () => {
        throw new Error('Not implemented');
    },
    user: createDefaultUser,
    setUser: () => {
        throw new Error('Not implemented');
    },
    loadUserListing: () => {
        throw new Error('Load user listing is not implemented');
    },
});

export const UserManagementContextProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const pageFromURL = searchParams.get('page');
    const sizeFromURL = searchParams.get('size');
    const dispatch = useAppDispatch();
    const [users, setUsers] = useState<User[]>([]);
    const [user, setUser] = useState<User>(createDefaultUser);
    const [pageInfo, setPageInfo] = useState<PageInfo>(createDefaultPageInfo());
    const [usersLoading, setUsersLoading] = useState(true);
    const [addUserModalOpen, setAddUserModalOpen] = useState(false);
    const [assignRoleModalOpen, setassignRoleModalOpen] = useState(false);

    const [paginationOptions, setPaginationOptions] = useState<PaginationOptions<User>>({
        page: Number(pageFromURL) || 1,
        size: Number(sizeFromURL) || 10,
        sort_key: 'first_name',
        nested_sort_key: 'first_name',
        sort_order: 'asc',
    });

    useEffect(() => {
        updateURLWithPagination(paginationOptions);
        loadUserListing();
    }, [paginationOptions]);

    const { page, size, sort_key, nested_sort_key, sort_order } = paginationOptions;

    const loadUserListing = async () => {
        try {
            setUsersLoading(true);
            const response = await getUserList({
                page,
                size,
                sort_key: nested_sort_key || sort_key,
                sort_order,
                include_groups: true,
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

    return (
        <UserManagementContext.Provider
            value={{
                users,
                pageInfo,
                usersLoading,
                paginationOptions,
                setPaginationOptions,
                addUserModalOpen,
                setAddUserModalOpen,
                assignRoleModalOpen,
                setassignRoleModalOpen,
                user,
                setUser,
                loadUserListing,
            }}
        >
            {children}
        </UserManagementContext.Provider>
    );
};
