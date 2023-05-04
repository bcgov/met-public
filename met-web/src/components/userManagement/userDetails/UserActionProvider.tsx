import React, { createContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { User } from 'models/user';
import { createDefaultUser } from 'models/user';
import { getUserList } from 'services/userService/api';

export interface UserViewContext {
    savedUser: User | undefined;
    isUserLoading: boolean;
}

export type UserParams = {
    userId: string;
};

export const ActionContext = createContext<UserViewContext>({
    savedUser: createDefaultUser,
    isUserLoading: true,
});

export const ActionProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const { userId } = useParams<UserParams>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [savedUser, setSavedUser] = useState<User | undefined>(createDefaultUser);
    const [isUserLoading, setUserLoading] = useState(true);

    useEffect(() => {
        fetchUser();
    }, [userId]);

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

    return (
        <ActionContext.Provider
            value={{
                savedUser,
                isUserLoading,
            }}
        >
            {children}
        </ActionContext.Provider>
    );
};
