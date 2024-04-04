import React, { createContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { User, createDefaultUser } from 'models/user';
import { getUser } from 'services/userService/api';
import { getMembershipsByUser } from 'services/membershipService';
import { EngagementTeamMember } from 'models/engagementTeamMember';

export interface UserViewContext {
    savedUser: User | undefined;
    isUserLoading: boolean;
    addUserModalOpen: boolean;
    isMembershipLoading: boolean;
    memberships: EngagementTeamMember[];
    setMemberships: React.Dispatch<React.SetStateAction<EngagementTeamMember[]>>;
    setAddUserModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    getUserMemberships: () => Promise<void>;
    getUserDetails: () => Promise<void>;
}

export type UserParams = {
    userId: string;
};

export const UserDetailsContext = createContext<UserViewContext>({
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
    getUserMemberships: () => {
        throw new Error('Not implemented');
    },
    getUserDetails: () => {
        throw new Error('Not implemented');
    },
    isMembershipLoading: true,
});

export const UserDetailsContextProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const { userId } = useParams<UserParams>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [savedUser, setSavedUser] = useState<User | undefined>(createDefaultUser);
    const [isUserLoading, setUserLoading] = useState(true);
    const [isMembershipLoading, setMembershipLoading] = useState(true);
    const [memberships, setMemberships] = useState<EngagementTeamMember[]>([]);
    const [addUserModalOpen, setAddUserModalOpen] = useState(false);

    useEffect(() => {
        fetchUser();
    }, [userId]);

    const fetchUser = async () => {
        if (isNaN(Number(userId))) {
            navigate('/404');
            return Promise.resolve();
        }
        try {
            await getUserDetails();
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while fetching User information',
                }),
            );
        }
    };

    const getUserDetails = async () => {
        setUserLoading(true);
        const fetchedUser = await getUser({ user_id: Number(userId), include_roles: true });
        setSavedUser(fetchedUser);
        setUserLoading(false);
    };

    useEffect(() => {
        getUserMemberships();
    }, [savedUser]);

    const getUserMemberships = async () => {
        if (!savedUser) {
            return;
        }
        const userMemberships = await getMembershipsByUser({
            user_external_id: savedUser.external_id,
            include_engagement_details: true,
            include_revoked: true,
        });

        setMemberships(userMemberships);
        setMembershipLoading(false);
    };

    return (
        <UserDetailsContext.Provider
            value={{
                savedUser,
                isUserLoading,
                addUserModalOpen,
                setAddUserModalOpen,
                memberships,
                setMemberships,
                getUserMemberships,
                getUserDetails,
                isMembershipLoading,
            }}
        >
            {children}
        </UserDetailsContext.Provider>
    );
};
