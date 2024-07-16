import React from 'react';
import { Params, defer, Navigate, Route } from 'react-router-dom';
import NotFound from './NotFound';
import EngagementForm from '../components/engagement/form'; // TODO: Convert tenant calls to route loader
import EngagementListing from '../components/engagement/listing'; // TODO: Convert tenant calls to route loader
import EngagementView from '../components/engagement/view'; // TODO: Convert tenant calls to route loader
import SurveyListing from 'components/survey/listing';
import CreateSurvey from 'components/survey/create';
import SurveyFormBuilder from 'components/survey/building';
import SurveySubmit from 'components/survey/submit';
import MetadataManagement from 'components/metadataManagement';
import CommentReview from 'components/comments/admin/review/CommentReview';
import CommentReviewListing from 'components/comments/admin/reviewListing';
import CommentTextListing from 'components/comments/admin/textListing';
import PublicDashboard from 'components/publicDashboard';
import EngagementComments from '../components/engagement/dashboard/comment';
import UnderConstruction from './UnderConstruction';
import FeedbackListing from 'components/feedback/listing';
import UserManagementListing from 'components/userManagement/listing';
import Dashboard from 'components/dashboard'; // TODO: Convert tenant calls to route loader
import Unauthorized from './Unauthorized';
import AuthGate from './AuthGate';
import { USER_ROLES } from 'services/userService/constants';
import UserProfile from 'components/userManagement/userDetails';
import ReportSettings from 'components/survey/report';
import TenantListingPage from 'components/tenantManagement/Listing';
import TenantCreationPage from 'components/tenantManagement/Create';
import TenantEditPage from 'components/tenantManagement/Edit';
import TenantDetail from 'components/tenantManagement/Detail';
import Language from 'components/language';
import { Tenant } from 'models/tenant';
import { getAllTenants, getTenant } from 'services/tenantService';
import { engagementLoader, engagementListLoader } from 'components/engagement/new/view';

const AuthenticatedRoutes = () => {
    return (
        <>
            <Route path="/home" element={<Dashboard />} />
            <Route path="/surveys">
                <Route index element={<SurveyListing />} />
                <Route path="create" element={<CreateSurvey />} />
                <Route path=":surveyId/build" element={<SurveyFormBuilder />} />
                <Route path=":surveyId/submit" element={<SurveySubmit />} />
                <Route path=":surveyId/report" element={<ReportSettings />} />
                <Route element={<AuthGate allowedRoles={[USER_ROLES.VIEW_APPROVED_COMMENTS]} />}>
                    <Route path=":surveyId/comments" element={<CommentReviewListing />} />
                    <Route path=":surveyId/comments/all" element={<CommentTextListing />} />
                </Route>
                <Route element={<AuthGate allowedRoles={[USER_ROLES.REVIEW_COMMENTS]} />}>
                    <Route path=":surveyId/submissions/:submissionId/review" element={<CommentReview />} />
                </Route>
            </Route>
            <Route element={<AuthGate allowedRoles={[USER_ROLES.CREATE_ENGAGEMENT]} />}>
                <Route path="engagements/create/form" id="create-engagement" element={<EngagementForm />} />
            </Route>
            <Route
                path="/engagements"
                id="engagement-listing"
                errorElement={<NotFound />}
                loader={engagementListLoader}
                handle={{
                    crumb: () => ({ name: 'Engagements' }),
                }}
            >
                <Route index element={<EngagementListing />} />
                <Route
                    path=":engagementId"
                    id="single-engagement"
                    errorElement={<NotFound />}
                    loader={engagementLoader}
                >
                    <Route element={<AuthGate allowedRoles={[USER_ROLES.EDIT_ENGAGEMENT]} />}>
                        <Route path="form" element={<EngagementForm />} />
                    </Route>
                    <Route path="view" element={<EngagementView />} />
                    <Route path=":slug" element={<EngagementView />} />
                </Route>
            </Route>
            <Route path=":engagementId/comments/:dashboardType" element={<EngagementComments />} />
            <Route path=":slug/dashboard/:dashboardType" element={<PublicDashboard />} />
            <Route path=":engagementId/dashboard/:dashboardType" element={<PublicDashboard />} />
            <Route path=":slug/comments/:dashboardType" element={<EngagementComments />} />
            <Route path="/metadatamanagement" element={<MetadataManagement />} />
            <Route path="/languages" element={<Language />} />
            <Route
                id="tenant-admin"
                path="/tenantadmin"
                errorElement={<NotFound />}
                loader={async () => {
                    return defer({ tenants: getAllTenants() });
                }}
                handle={{
                    crumb: () => ({ name: 'Tenant Admin' }),
                }}
            >
                <Route index element={<TenantListingPage />} />
                <Route
                    path="create"
                    element={<TenantCreationPage />}
                    handle={{
                        crumb: () => ({ name: 'Create Tenant Instance' }),
                    }}
                />
                <Route
                    id="tenant"
                    path=":tenantShortName"
                    loader={async ({ params }: { params: Params<string> }) => {
                        const tenant = getTenant(params.tenantShortName ?? '');
                        return defer({ tenant: tenant });
                    }}
                    handle={{
                        crumb: async (data: { tenant: Promise<Tenant> }) => {
                            return data.tenant.then((tenant) => {
                                return {
                                    link: `/tenantadmin/${tenant.short_name}/detail`,
                                    name: tenant.name,
                                };
                            });
                        },
                    }}
                    errorElement={<NotFound />}
                >
                    <Route index element={<Navigate to="detail" />} />
                    <Route path="detail" element={<TenantDetail />} />
                    <Route
                        path="edit"
                        element={<TenantEditPage />}
                        handle={{
                            crumb: () => ({ name: 'Edit Instance' }),
                        }}
                    />
                </Route>
            </Route>
            <Route path="/feedback" element={<FeedbackListing />} />
            <Route path="/calendar" element={<UnderConstruction />} />
            <Route path="/reporting" element={<UnderConstruction />} />
            <Route path="/usermanagement">
                <Route index element={<UserManagementListing />} />
                <Route path=":userId/details" element={<UserProfile />} />
            </Route>
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/not-found" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
        </>
    );
};

export default AuthenticatedRoutes;
