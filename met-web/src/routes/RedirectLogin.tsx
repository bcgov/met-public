import React, { useEffect } from 'react';
import { MidScreenLoader } from 'components/common';
import UserService from 'services/userService';

export const RedirectLogin = () => {
    const fullUrl = window.location.href;

    useEffect(() => {
        UserService.doLogin(fullUrl);
    }, []);
    return <MidScreenLoader />;
};
