import React from 'react';
import { useAppSelector } from 'hooks';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { USER_COMPOSITE_ROLE } from 'models/user';

const AuthGate = ({ allowedRoles }: { allowedRoles: string[] }) => {
    const permissions = useAppSelector((state) => state.user.roles);
    const location = useLocation();

    const scopesMap: { [scope: string]: boolean } = {};
    allowedRoles.forEach((scope) => {
        scopesMap[scope] = true;
    });

    return permissions.some((permission) => scopesMap[permission]) ||
        permissions?.includes('/' + USER_COMPOSITE_ROLE.TEAM_MEMBER.value) ? (
        <Outlet />
    ) : (
        <Navigate to="/unauthorized" state={{ from: location }} replace />
    );
};

export default AuthGate;
