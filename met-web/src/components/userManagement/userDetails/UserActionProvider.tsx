import React, { createContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { User } from 'models/user';
import { createDefaultUser } from 'models/user';
import { getUserList } from 'services/userService/api';
import { createDefaultPageInfo, PageInfo, PaginationOptions } from 'components/common/Table/types';

export interface UserViewContext {
    savedUser: User | undefined;
    isUserLoading: boolean;
    addUserModalOpen: boolean;
    pageInfo: PageInfo;
    users: User[];
    setAddUserModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setPaginationOptions: React.Dispatch<React.SetStateAction<PaginationOptions<User>>>;
    paginationOptions: PaginationOptions<User>;
    loadUserListing: () => void;
}

export type UserParams = {
    userId: string;
};

export const ActionContext = createContext<UserViewContext>({
    savedUser: createDefaultUser,
    isUserLoading: true,
    addUserModalOpen: false,
    pageInfo: createDefaultPageInfo(),
    users: [],
    paginationOptions: {
        page: 0,
        size: 0,
    },
    setPaginationOptions: () => {
        throw new Error('Not implemented');
    },
    setAddUserModalOpen: () => {
        throw new Error('Not implemented');
    },
    loadUserListing: () => {
        throw new Error('Load user listing is not implemented');
    },
});

export const ActionProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const { userId } = useParams<UserParams>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [users, setUsers] = useState<User[]>([]);
    const [savedUser, setSavedUser] = useState<User | undefined>(createDefaultUser);
    const [isUserLoading, setUserLoading] = useState(true);
    const [usersLoading, setUsersLoading] = useState(true);
    const [addUserModalOpen, setAddUserModalOpen] = useState(false);
    const [paginationOptions, setPaginationOptions] = useState<PaginationOptions<User>>({
        page: 1,
        size: 10,
        sort_key: 'first_name',
        nested_sort_key: 'first_name',
        sort_order: 'asc',
    });
    const [pageInfo, setPageInfo] = useState<PageInfo>(createDefaultPageInfo());

    useEffect(() => {
        loadUserListing();
    }, [paginationOptions]);

    useEffect(() => {
        fetchUser();
    }, [userId]);

    const { page, size, sort_key, nested_sort_key, sort_order } = paginationOptions;

    const fetchUser = async () => {
        if (isNaN(Number(userId))) {
            navigate('/404');
            return;
        }
        try {
            const result = await getUserList();
            console.log(result.items);
            console.log('USER ID ' + userId);
            const currentUser = result.items.find((user) => user.id === parseInt(userId));
            console.log('CURRENT USER:::' + JSON.stringify(currentUser));
            setSavedUser(currentUser);
            setUserLoading(false);
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while fetching User information',
                }),
            );
        }
    };

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
        <ActionContext.Provider
            value={{
                savedUser,
                isUserLoading,
                addUserModalOpen,
                setAddUserModalOpen,
                paginationOptions,
                setPaginationOptions,
                pageInfo,
                users,
                loadUserListing,
            }}
        >
            {children}
        </ActionContext.Provider>
    );
};
