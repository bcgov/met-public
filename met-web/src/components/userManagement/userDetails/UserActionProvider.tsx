import React, { createContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { User, createDefaultUser } from 'models/user';
import { getUserList, fetchUserEngagements } from 'services/userService/api';
import { Engagement } from 'models/engagement';

export interface UserViewContext {
    savedUser: User | undefined;
    isUserLoading: boolean;
    addUserModalOpen: boolean;
    memberships: Engagement[];
    setMemberships: React.Dispatch<React.SetStateAction<Engagement[]>>;
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
    const [savedUser, setSavedUser] = useState<User | undefined>(createDefaultUser);
    const [isUserLoading, setUserLoading] = useState(true);
    const [memberships, setMemberships] = useState<Engagement[]>([]);
    const [addUserModalOpen, setAddUserModalOpen] = useState(false);

    useEffect(() => {
        const loadData = () => {
            fetchUser()
                .then(() => getUserEngagements())
                .catch((error) => console.error(error));
        };
        loadData();
    }, [userId]);

    const fetchUser = async () => {
        if (isNaN(Number(userId))) {
            navigate('/404');
            return Promise.resolve();
        }
        try {
            const result = await getUserList({ include_groups: true });
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
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
        const user_engagements = await fetchUserEngagements({ user_id: userId });

        setMemberships(user_engagements);
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
