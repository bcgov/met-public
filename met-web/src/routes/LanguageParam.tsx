import React, { useEffect, ComponentType } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks';
import { LanguageState } from 'reduxSlices/languageSlice';

interface RouteParams {
    [key: string]: string | undefined;
    engagementId?: string;
    slug?: string;
    subscriptionStatus?: string;
    scriptionKey?: string;
    dashboardType?: string;
    token?: string;
    widgetId?: string;
}

const withLanguageParam = <P extends object>(Component: ComponentType<P>) => {
    return (props: P) => {
        const languageState: LanguageState = useAppSelector((state) => state.language);
        const languageCode = languageState.id;
        const params = useParams<RouteParams>();
        const navigate = useNavigate();

        useEffect(() => {
            const currentUrl = window.location.pathname;
            if (languageCode && !currentUrl.includes(languageCode)) {
                let newUrl = currentUrl;

                for (const param in params) {
                    if (params[param as keyof RouteParams]) {
                        newUrl = newUrl.replace(`:${param}`, params[param as keyof RouteParams] as string);
                    }
                }

                newUrl = newUrl.replace(':language', languageCode);

                navigate(newUrl, { replace: true });
            }
        }, [languageCode, navigate, params]);

        return <Component {...props} />;
    };
};

export default withLanguageParam;
