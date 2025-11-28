import React from 'react';
import { Params, Navigate, Route } from 'react-router-dom';
import { Engagement } from 'models/engagement';
import { Tenant } from 'models/tenant';
import { AuthenticatedLayout } from 'components/appLayouts/AuthenticatedLayout';
import { authenticatedRootLoader } from 'routes/AuthenticatedRootRouteLoader';
import { getAllTenants, getTenant } from 'services/tenantService';
import { engagementLoader, engagementListLoader } from 'engagements/public/view';
import { SurveyLoader } from 'components/survey/building/SurveyLoader';
import { languageLoader } from 'engagements/admin/config/LanguageLoader';
import { userSearchLoader } from 'components/userManagement/userSearchLoader';
import engagementCreateAction from 'engagements/admin/config/EngagementCreateAction';
import engagementUpdateAction from 'engagements/admin/config/EngagementUpdateAction';
import { engagementAuthoringUpdateAction } from 'engagements/admin/create/authoring/engagementAuthoringUpdateAction';
import { USER_ROLES } from 'services/userService/constants';

// Load these synchronously because they may be needed right away
import NotFound from './NotFound';
import AuthGate from './AuthGate';
import Unauthorized from './Unauthorized';
import UnderConstruction from './UnderConstruction';

// Deferred import helper function to grab default export from lazily imported module
const df = function <T = React.ComponentType<unknown>>(
    importFn: () => Promise<{ default: T }>,
): () => Promise<{ Component: T }> {
    return () => importFn().then((m) => ({ Component: m.default }));
};

const AuthenticatedRoutes = (
    <Route
        path="/"
        element={<AuthenticatedLayout />}
        id="authenticated-root"
        loader={authenticatedRootLoader}
        errorElement={<NotFound />}
        handle={{
            crumb: () => ({ name: 'Dashboard', link: '/home' }),
        }}
        shouldRevalidate={() => false} // Cache the root loader data for the authenticated area
    >
        <Route path="/home" lazy={df(() => import('components/dashboard'))} />
        <Route path="/surveys">
            <Route index lazy={df(() => import('components/survey/listing'))} />
            <Route path="create" lazy={df(() => import('components/survey/create'))} />
            <Route path=":surveyId" errorElement={<NotFound />} id="survey" loader={SurveyLoader}>
                <Route path="build" lazy={df(() => import('components/survey/building'))} />
                <Route path="report" lazy={df(() => import('components/survey/report'))} />
                <Route path="submit" lazy={df(() => import('components/survey/submit'))} />
                <Route element={<AuthGate allowedRoles={[USER_ROLES.VIEW_APPROVED_COMMENTS]} />}>
                    <Route path="comments" lazy={df(() => import('components/comments/admin/reviewListing'))} />
                    <Route path="comments/all" lazy={df(() => import('components/comments/admin/textListing'))} />
                </Route>
                <Route element={<AuthGate allowedRoles={[USER_ROLES.REVIEW_COMMENTS]} />}>
                    <Route
                        path="submissions/:submissionId/review"
                        lazy={df(() => import('components/comments/admin/review/CommentReview'))}
                    />
                </Route>
            </Route>
        </Route>
        <Route
            path="/engagements"
            id="engagement-listing"
            errorElement={<NotFound />}
            handle={{ crumb: () => ({ name: 'Engagements' }) }}
        >
            <Route index lazy={df(() => import('engagements/listing'))} />
            <Route path="search" element={<Navigate to="/engagements" />} loader={engagementListLoader} />
            <Route
                path="create"
                action={engagementCreateAction}
                element={<AuthGate allowedRoles={[USER_ROLES.CREATE_ENGAGEMENT]} />}
            >
                <Route index element={<Navigate to="wizard" />} />
                <Route path="form" lazy={df(() => import('engagements/form'))} />
                <Route
                    path="wizard"
                    handle={{ crumb: () => ({ name: 'New Engagement' }) }}
                    lazy={df(() => import('engagements/admin/config/wizard/CreationWizard'))}
                />
            </Route>
            <Route
                path=":engagementId"
                id="single-engagement"
                errorElement={<NotFound />}
                loader={engagementLoader}
                handle={{
                    crumb: async (data: { engagement: Promise<Engagement> }) =>
                        data.engagement.then((engagement) => ({
                            name: engagement.name,
                            link: `/engagements/${engagement.id}/details/authoring`,
                        })),
                }}
                shouldRevalidate={({ currentParams, nextParams }) => {
                    return currentParams.engagementId !== nextParams.engagementId;
                }}
            >
                <Route element={<AuthGate allowedRoles={[USER_ROLES.EDIT_ENGAGEMENT]} />}>
                    <Route path="form" lazy={df(() => import('engagements/form'))} />
                </Route>
                <Route path="old-view" lazy={df(() => import('engagements/old-view'))} />
                <Route index element={<Navigate to="details/config" />} />
                <Route path="details">
                    <Route index element={<Navigate to="config" />} />
                    {/* Wraps the tabs with the engagement title and TabContext */}
                    <Route lazy={df(() => import('engagements/admin/view'))} shouldRevalidate={() => false}>
                        <Route path="config" lazy={df(() => import('engagements/admin/view/ConfigSummary'))} />
                        <Route path="authoring" lazy={df(() => import('engagements/admin/view/AuthoringTab'))} />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                    <Route
                        path="authoring"
                        handle={{ crumb: () => ({ name: 'Authoring' }) }}
                        element={<AuthGate allowedRoles={[USER_ROLES.EDIT_ENGAGEMENT]} />}
                    >
                        <Route lazy={df(() => import('engagements/admin/create/authoring/AuthoringContext'))}>
                            <Route
                                lazy={df(() => import('engagements/admin/create/authoring/AuthoringTemplate'))}
                                id="authoring-loader"
                            >
                                <Route
                                    path="banner"
                                    lazy={df(() => import('engagements/admin/create/authoring/AuthoringBanner'))}
                                    action={engagementAuthoringUpdateAction}
                                    handle={{ crumb: () => ({ name: 'Hero Banner' }) }}
                                />
                                <Route
                                    path="summary"
                                    action={engagementAuthoringUpdateAction}
                                    loader={engagementLoader}
                                    lazy={df(() => import('engagements/admin/create/authoring/AuthoringSummary'))}
                                    handle={{ crumb: () => ({ name: 'Summary' }) }}
                                />
                                <Route
                                    path="details"
                                    action={engagementAuthoringUpdateAction}
                                    lazy={df(() => import('engagements/admin/create/authoring/AuthoringDetails'))}
                                    handle={{ crumb: () => ({ name: 'Details' }) }}
                                />
                                <Route
                                    path="feedback"
                                    action={engagementAuthoringUpdateAction}
                                    lazy={df(() => import('engagements/admin/create/authoring/AuthoringFeedback'))}
                                    handle={{ crumb: () => ({ name: 'Provide Feedback' }) }}
                                />
                                <Route
                                    path="results"
                                    lazy={df(() => import('engagements/admin/create/authoring/AuthoringResults'))}
                                    handle={{ crumb: () => ({ name: 'View Results' }) }}
                                />
                                <Route
                                    path="subscribe"
                                    lazy={df(() => import('engagements/admin/create/authoring/AuthoringSubscribe'))}
                                    handle={{ crumb: () => ({ name: 'Subscribe' }) }}
                                />
                                <Route
                                    path="more"
                                    lazy={df(() => import('engagements/admin/create/authoring/AuthoringMore'))}
                                    handle={{ crumb: () => ({ name: 'More Engagements' }) }}
                                />
                            </Route>
                        </Route>
                    </Route>
                    <Route path="*" element={<NotFound />} />
                    <Route
                        path="config/edit"
                        lazy={df(() => import('engagements/admin/config/wizard/ConfigWizard'))}
                        action={engagementUpdateAction}
                        handle={{ crumb: () => ({ name: 'Configure' }) }}
                    />
                </Route>
                <Route element={<AuthGate allowedRoles={[USER_ROLES.EDIT_ENGAGEMENT]} />}>
                    <Route path="form" lazy={df(() => import('engagements/form'))} />
                </Route>
                <Route path="comments/:dashboardType" lazy={df(() => import('engagements/dashboard/comment'))} />
                <Route path="dashboard/:dashboardType" lazy={df(() => import('components/publicDashboard'))} />
            </Route>
            <Route path=":slug">
                <Route index lazy={df(() => import('engagements/old-view'))} />
                <Route path="comments/:dashboardType" lazy={df(() => import('engagements/dashboard/comment'))} />
                <Route path="dashboard/:dashboardType" lazy={df(() => import('components/publicDashboard'))} />
            </Route>
        </Route>
        <Route path="/metadatamanagement" lazy={df(() => import('components/metadataManagement'))} />
        <Route path="/languages" loader={languageLoader} lazy={df(() => import('components/language'))} />
        <Route
            id="tenant-admin"
            path="/tenantadmin"
            errorElement={<NotFound />}
            loader={async () => ({ tenants: getAllTenants() })}
            handle={{ crumb: () => ({ name: 'Tenant Admin' }) }}
        >
            <Route index lazy={df(() => import('components/tenantManagement/Listing'))} />
            <Route
                path="create"
                lazy={df(() => import('components/tenantManagement/Create'))}
                handle={{ crumb: () => ({ name: 'Create Tenant Instance' }) }}
            />
            <Route
                id="tenant"
                path=":tenantShortName"
                loader={({ params }: { params: Params<string> }) => ({
                    tenant: getTenant(params.tenantShortName ?? ''),
                })}
                handle={{
                    crumb: async (data: { tenant: Promise<Tenant> }) =>
                        data.tenant.then((tenant) => ({
                            link: `/tenantadmin/${tenant.short_name}/detail`,
                            name: tenant.name,
                        })),
                }}
                errorElement={<NotFound />}
            >
                <Route index element={<Navigate to="detail" />} />
                <Route path="detail" lazy={df(() => import('components/tenantManagement/Detail'))} />
                <Route
                    path="edit"
                    lazy={df(() => import('components/tenantManagement/Edit'))}
                    handle={{ crumb: () => ({ name: 'Edit Instance' }) }}
                />
            </Route>
        </Route>
        <Route path="/feedback" lazy={df(() => import('components/feedback/listing'))} />
        <Route path="/calendar" element={<UnderConstruction />} />
        <Route path="/reporting" element={<UnderConstruction />} />
        <Route path="/usermanagement">
            <Route index lazy={df(() => import('components/userManagement/listing'))} />
            <Route path="search" element={<Navigate to="/usermanagement" />} loader={userSearchLoader} />
            <Route path=":userId/details" lazy={df(() => import('components/userManagement/userDetails'))} />
        </Route>
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
    </Route>
);

export default AuthenticatedRoutes;
