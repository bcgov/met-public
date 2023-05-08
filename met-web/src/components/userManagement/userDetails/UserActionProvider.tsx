import React, { createContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { User, createDefaultUser } from 'models/user';
import { getUserList } from 'services/userService/api';
import { createDefaultPageInfo, PageInfo, PaginationOptions } from 'components/common/Table/types';
import { getMembershipsByUser } from 'services/membershipService';
import { EngagementTeamMember } from 'models/engagementTeamMember';

export interface UserViewContext {
    savedUser: User | undefined;
    isUserLoading: boolean;
    addUserModalOpen: boolean;
    pageInfo: PageInfo;
    users: User[];
    memberships: EngagementTeamMember[];
    setMemberships: React.Dispatch<React.SetStateAction<EngagementTeamMember[]>>;
    setAddUserModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setPaginationOptions: React.Dispatch<React.SetStateAction<PaginationOptions<EngagementTeamMember>>>;
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
    memberships: [],
    setMemberships: () => {
        throw new Error('set memberships is not implemented');
    },
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
    const [memberships, setMemberships] = useState<EngagementTeamMember[]>([]);
    const [addUserModalOpen, setAddUserModalOpen] = useState(false);
    const [paginationOptions, setPaginationOptions] = useState<PaginationOptions<EngagementTeamMember>>({
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
        getUserEngagements();
    }, [userId]);

    const { page, size, sort_key, nested_sort_key, sort_order } = paginationOptions;

    const fetchUser = async () => {
        if (isNaN(Number(userId))) {
            navigate('/404');
            return;
        }
        try {
            const result = await getUserList();
            const currentUser = result.items.find((user) => user.id === parseInt(userId));
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

    const getUserEngagements = async () => {
        const user_memberships = await getMembershipsByUser({
            user_id: userId,
        });
        setMemberships(user_memberships);
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
                memberships,
                setMemberships,
            }}
        >
            {children}
        </ActionContext.Provider>
    );
};
