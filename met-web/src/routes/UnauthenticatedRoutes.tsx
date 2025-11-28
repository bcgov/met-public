import React from 'react';
import withLanguageParam from './LanguageParam';
import { Navigate, Route } from 'react-router-dom';
import NotFound from './NotFound';
import { engagementLoader } from 'engagements/public/view';
import { SurveyLoader } from 'components/survey/building/SurveyLoader';
import NotAvailable from './NotAvailable';
import { PublicLayout } from 'components/appLayouts/PublicLayout';

// Deferred import helper function to grab default export from lazily imported module
// and optionally wrap it with the language parameter HOC.
const df = function <T extends React.ComponentType<unknown>>(
    importFn: () => Promise<{ default: T }>,
    useLanguage?: boolean,
): () => Promise<{ Component: React.ComponentType<unknown> }> {
    return () =>
        importFn().then((m) =>
            useLanguage
                ? { Component: withLanguageParam(m.default) as React.ComponentType<unknown> }
                : { Component: m.default },
        );
};

const UnauthenticatedRoutes = (
    <Route path="/" element={<PublicLayout />} errorElement={<NotFound />} id="home">
        <Route index lazy={df(() => import('components/landing'))} />
        <Route
            path="/surveys/submit/:surveyId/:token/:language"
            loader={SurveyLoader}
            id="survey"
            lazy={df(() => import('components/survey/submit'), true)}
        />
        <Route path="/new-look">
            <Route index element={<Navigate to="/" />} />
            <Route
                path=":slug/:language"
                loader={engagementLoader}
                lazy={df(() => import('engagements/public/view'), true)}
            />
            <Route
                path=":engagementId/view/:language"
                loader={engagementLoader}
                lazy={df(() => import('engagements/old-view'), true)}
            />
        </Route>
        <Route path="/engagements">
            <Route path="create/form/:language" lazy={df(() => import('routes/RedirectLogin'), true)} />
            <Route path=":engagementId">
                <Route
                    path="view/:language"
                    loader={engagementLoader}
                    lazy={df(() => import('engagements/old-view'), true)}
                />
                <Route
                    path="comments/:dashboardType/:language"
                    lazy={df(() => import('engagements/dashboard/comment'), true)}
                />
                <Route
                    path="dashboard/:dashboardType/:language"
                    lazy={df(() => import('components/publicDashboard'), true)}
                />
                <Route
                    path="edit/:token/:language"
                    loader={SurveyLoader}
                    lazy={df(() => import('components/survey/edit'), true)}
                />
                <Route
                    path=":subscriptionStatus/:scriptionKey/:language"
                    lazy={df(() => import('engagements/widgets/Subscribe/ManageSubscription'), true)}
                />
                <Route path="form/:language" lazy={df(() => import('routes/RedirectLogin'), true)} />
                <Route path="cacform/:widgetId/:language" lazy={df(() => import('components/FormCAC'), true)} />
            </Route>
        </Route>
        <Route path=":slug">
            <Route
                path="dashboard/:dashboardType/:language"
                lazy={df(() => import('components/publicDashboard'), true)}
            />
            <Route
                path="comments/:dashboardType/:language"
                lazy={df(() => import('engagements/dashboard/comment'), true)}
            />
            <Route
                path="edit/:token/:language"
                loader={SurveyLoader}
                lazy={df(() => import('components/survey/edit'), true)}
            />
            <Route path="cacform/:widgetId/:language" lazy={df(() => import('components/FormCAC'), true)} />
            <Route path=":language" loader={engagementLoader} lazy={df(() => import('engagements/old-view'), true)} />
        </Route>
        <Route path="/not-available" element={<NotAvailable />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
    </Route>
);

export default UnauthenticatedRoutes;
