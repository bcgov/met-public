import React, { createContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { User, createDefaultUser } from 'models/user';
import { getUserList } from 'services/userService/api';
import { getMembershipsByUser } from 'services/membershipService';
import { UserEngagementsTable } from 'models/engagementTeamMember';
import { getEngagement } from 'services/engagementService';

export interface UserViewContext {
    savedUser: User | undefined;
    isUserLoading: boolean;
    addUserModalOpen: boolean;
    memberships: UserEngagementsTable[];
    setMemberships: React.Dispatch<React.SetStateAction<UserEngagementsTable[]>>;
    setAddUserModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export type UserParams = {
    userId: string;
};

export const ActionContext = createContext<UserViewContext>({
    savedUser: createDefaultUser,
    isUserLoading: true,
    addUserModalOpen: false,
    memberships: [],
    setMemberships: () => {
        throw new Error('set memberships is not implemented');
    },
    setAddUserModalOpen: () => {
        throw new Error('Not implemented');
    },
});

export const ActionProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const { userId } = useParams<UserParams>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [userList, setUserList] = useState<User[]>([]);
    const [savedUser, setSavedUser] = useState<User | undefined>(createDefaultUser);
    const [isUserLoading, setUserLoading] = useState(true);
    const [memberships, setMemberships] = useState<UserEngagementsTable[]>([]);
    const [addUserModalOpen, setAddUserModalOpen] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                await fetchUser();
                await getUserEngagements();
            } catch (error) {
                console.error(error);
            }
        };
        loadData();
    }, [userId]);

    const fetchUser = async () => {
        if (isNaN(Number(userId))) {
            navigate('/404');
            return;
        }
        try {
            const result = await getUserList();
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            const currentUser = result.items.find((user) => user.id === parseInt(userId));
            setUserList(result.items);
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
        const membership_table: UserEngagementsTable[] = [];

        user_memberships.forEach((membership) => {
            getEngagement(membership.engagement_id)
                .then((engagement) => {
                    const added_by_user = userList.find((user) => user.id === membership.user_id);
                    const created_date = membership.created_date;
                    const user = savedUser;
                    if (added_by_user && created_date && user)
                        membership_table.push({ engagement, added_by_user, created_date, user });
                })
                .catch((error) => console.error(error));
        });
        setMemberships(membership_table);
    };

    return (
        <ActionContext.Provider
            value={{
                savedUser,
                isUserLoading,
                addUserModalOpen,
                setAddUserModalOpen,
                memberships,
                setMemberships,
            }}
        >
            {children}
        </ActionContext.Provider>
    );
};
