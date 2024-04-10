import React, { createContext, useState, useEffect } from 'react';
import { useAppDispatch } from 'hooks';
import UserService from '../../services/userService';
import { _kc } from 'constants/tenantConstants';
const KeycloakData = _kc;

export interface AuthKeyCloakContextProps {
    isAuthenticated: boolean;
    isAuthenticating: boolean; // Add a flag to indicate ongoing authentication process
    keycloakInstance: Keycloak.default | null;
}

export const AuthKeyCloakContext = createContext<AuthKeyCloakContextProps>({
    isAuthenticated: false,
    isAuthenticating: true, // Initially, authentication is in progress
    keycloakInstance: null, // Initial value
});

export const AuthKeyCloakContextProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const dispatch = useAppDispatch();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(true); // State to manage authentication loading status

    useEffect(() => {
        const initAuth = async () => {
            try {
                const authenticated = await KeycloakData.init({
                    onLoad: 'check-sso',
                    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
                    pkceMethod: 'S256',
                    checkLoginIframe: false,
                });
                setIsAuthenticated(authenticated); // Update authentication state
                UserService.setKeycloakInstance(KeycloakData);
                UserService.setAuthData(dispatch);
            } catch (error) {
                console.error('Authentication initialization failed:', error);
            } finally {
                setIsAuthenticating(false); // Indicate that authentication process is complete
            }
        };
        initAuth();
    }, [dispatch]);

    // Render children only after the authentication status is determined
    return (
        <AuthKeyCloakContext.Provider
            value={{
                isAuthenticated,
                isAuthenticating,
                keycloakInstance: KeycloakData,
            }}
        >
            {!isAuthenticating && children}
        </AuthKeyCloakContext.Provider>
    );
};
