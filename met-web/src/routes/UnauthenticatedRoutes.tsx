import React from 'react';
import withLanguageParam from './LanguageParam';
import { Navigate, Route } from 'react-router-dom';
import LazyRoute, { resolveLazyRouteTree } from './LazyRoute';

const UnauthenticatedRoutes = resolveLazyRouteTree(
    <LazyRoute
        path="/"
        ComponentLazy={() => import('components/appLayouts/PublicLayout')}
        ErrorBoundaryLazy={() => import('routes/NotFound')}
        id="public-root"
    >
        <LazyRoute index ComponentLazy={() => import('components/landing')} />
        <LazyRoute
            path="/surveys/submit/:surveyId/:token/:language"
            id="survey"
            ComponentLazy={() => import('components/survey/submit').then((module) => withLanguageParam(module.default))}
            loaderLazy={() =>
                import('components/survey/building/SurveyLoader').then((loaderModule) => loaderModule.SurveyLoader)
            }
        />
        <Route path="/new-look">
            <Route index element={<Navigate to="/" />} />
            <LazyRoute
                path=":slug/:language"
                ComponentLazy={() =>
                    import('engagements/public/view').then((module) => withLanguageParam(module.default))
                }
                loaderLazy={() => import('engagements/public/view/EngagementLoader')}
            />
            <LazyRoute
                path=":engagementId/view/:language"
                ComponentLazy={() => import('engagements/old-view').then((m) => withLanguageParam(m.default))}
                loaderLazy={() => import('engagements/public/view/EngagementLoader')}
            />
        </Route>
        <Route path="/engagements">
            <LazyRoute
                path="create/form/:language"
                ComponentLazy={() => import('routes/RedirectLogin').then((m) => withLanguageParam(m.default))}
            />
            <Route path=":engagementId">
                <LazyRoute
                    path="view/:language"
                    ComponentLazy={() => import('engagements/old-view').then((m) => withLanguageParam(m.default))}
                    loaderLazy={() => import('engagements/public/view/EngagementLoader')}
                />
                <LazyRoute
                    path="comments/:dashboardType/:language"
                    ComponentLazy={() =>
                        import('engagements/dashboard/comment').then((m) => withLanguageParam(m.default))
                    }
                />
                <LazyRoute
                    path="dashboard/:dashboardType/:language"
                    ComponentLazy={() => import('components/publicDashboard').then((m) => withLanguageParam(m.default))}
                />
                <LazyRoute
                    path="edit/:token/:language"
                    ComponentLazy={() =>
                        import('components/survey/edit').then((module) => withLanguageParam(module.default))
                    }
                    loaderLazy={() => import('components/survey/building/SurveyLoader')}
                />
                <LazyRoute
                    path=":subscriptionStatus/:scriptionKey/:language"
                    ComponentLazy={() =>
                        import('engagements/widgets/Subscribe/ManageSubscription').then((m) =>
                            withLanguageParam(m.default),
                        )
                    }
                />
                <LazyRoute
                    path="form/:language"
                    ComponentLazy={() => import('routes/RedirectLogin').then((m) => withLanguageParam(m.default))}
                />
                <LazyRoute
                    path="cacform/:widgetId/:language"
                    ComponentLazy={() => import('components/FormCAC').then((m) => withLanguageParam(m.default))}
                />
            </Route>
        </Route>
        <Route path=":slug">
            <LazyRoute
                path="dashboard/:dashboardType/:language"
                ComponentLazy={() => import('components/publicDashboard').then((m) => withLanguageParam(m.default))}
            />
            <LazyRoute
                path="comments/:dashboardType/:language"
                ComponentLazy={() => import('engagements/dashboard/comment').then((m) => withLanguageParam(m.default))}
            />
            <LazyRoute
                path="edit/:token/:language"
                ComponentLazy={() =>
                    import('components/survey/edit').then((module) => withLanguageParam(module.default))
                }
                loaderLazy={() => import('components/survey/building/SurveyLoader')}
            />
            <LazyRoute
                path="cacform/:widgetId/:language"
                ComponentLazy={() => import('components/FormCAC').then((m) => withLanguageParam(m.default))}
            />
            <LazyRoute
                path=":language"
                id="single-engagement"
                ComponentLazy={() => import('engagements/old-view').then((m) => withLanguageParam(m.default))}
                loaderLazy={() => import('engagements/public/view/EngagementLoader')}
            />
            <LazyRoute path="*" ComponentLazy={() => import('routes/NotFound')} />
        </Route>
        <LazyRoute path="/not-available" ComponentLazy={() => import('routes/NotAvailable')} />
        <LazyRoute path="/not-found" ComponentLazy={() => import('routes/NotFound')} />
        <LazyRoute path="*" ComponentLazy={() => import('routes/NotFound')} />
    </LazyRoute>,
);

export default UnauthenticatedRoutes;
