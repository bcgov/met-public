import React, { useState, useEffect } from 'react';
import AuthenticatedRoutes from './AuthenticatedRoutes';
import UnauthenticatedRoutes from './UnauthenticatedRoutes';
import { useAppSelector } from '../hooks';
import UserService from '../services/UserServices';

const BaseRouting = () => {
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);

    if (!isLoggedIn) {
        return <UnauthenticatedRoutes />;
    }
    return <AuthenticatedRoutes />;
};

export default BaseRouting;
