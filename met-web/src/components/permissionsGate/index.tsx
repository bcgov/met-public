import React, { cloneElement } from 'react';
import { useAppSelector } from 'hooks';

interface HasPermissionProps {
    permissions: string[];
    scopes: string[];
}
const hasPermission = ({ permissions, scopes }: HasPermissionProps) => {
    const scopesMap: { [scope: string]: boolean } = {};

    scopes.forEach((scope) => {
        scopesMap[scope] = true;
    });

    return permissions.some((permission) => scopesMap[permission]);
};

/* eslint-disable @typescript-eslint/no-explicit-any */
interface PermissionsGateProps {
    children: React.ReactElement<any, any>;
    RenderError?: () => React.ReactElement<any, any>;
    errorProps?: any;
    scopes: string[];
}
export function PermissionsGate({
    children,
    RenderError,
    errorProps,
    scopes = [],
}: PermissionsGateProps): React.ReactElement<any, any> {
    const permissions = useAppSelector((state) => state.user.roles);

    const permissionGranted = hasPermission({ permissions, scopes });

    if (!permissionGranted && !errorProps && RenderError) return <RenderError />;

    if (!permissionGranted && errorProps) return cloneElement(children, { ...errorProps });

    if (!permissionGranted) return <></>;

    return <>{children}</>;
}
/* eslint-enable */
