import React from 'react';
import { Params, defer, Navigate, Route } from 'react-router-dom';
import NotFound from './NotFound';
import EngagementForm from '../components/engagement/form';
import EngagementListing from '../components/engagement/listing';
import { Engagement as OldEngagementView } from '../components/engagement/old-view';
import { AdminEngagementView } from 'components/engagement/admin/view';
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
import Dashboard from 'components/dashboard';
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
import { Engagement } from 'models/engagement';
import { getAllTenants, getTenant } from 'services/tenantService';
import { engagementLoader, engagementListLoader } from 'components/engagement/public/view';
import { SurveyLoader } from 'components/survey/building/SurveyLoader';
import { languageLoader } from 'components/engagement/admin/config/LanguageLoader';
import { userSearchLoader } from 'components/userManagement/userSearchLoader';
import EngagementCreationWizard from 'components/engagement/admin/config/wizard/CreationWizard';
import engagementCreateAction from 'components/engagement/admin/config/EngagementCreateAction';
import EngagementConfigurationWizard from 'components/engagement/admin/config/wizard/ConfigWizard';
import engagementUpdateAction from 'components/engagement/admin/config/EngagementUpdateAction';
import { ConfigSummary as ConfigTab } from 'components/engagement/admin/view/ConfigSummary';
import { AuthoringTab } from 'components/engagement/admin/view/AuthoringTab';
import AuthoringBanner from 'components/engagement/admin/create/authoring/AuthoringBanner';
import { engagementAuthoringUpdateAction } from 'components/engagement/admin/create/authoring/engagementAuthoringUpdateAction';
import { AuthoringContext } from 'components/engagement/admin/create/authoring/AuthoringContext';
import AuthoringTemplate from 'components/engagement/admin/create/authoring/AuthoringTemplate';
import AuthoringSummary from 'components/engagement/admin/create/authoring/AuthoringSummary';
import AuthoringDetails from 'components/engagement/admin/create/authoring/AuthoringDetails';
import AuthoringFeedback from 'components/engagement/admin/create/authoring/AuthoringFeedback';
import AuthoringResults from 'components/engagement/admin/create/authoring/AuthoringResults';
import AuthoringSubscribe from 'components/engagement/admin/create/authoring/AuthoringSubscribe';
import AuthoringMore from 'components/engagement/admin/create/authoring/AuthoringMore';
import { authoringLoader } from 'components/engagement/admin/create/authoring/authoringLoader';

const AuthenticatedRoutes = () => {
    return (
        <>
            <Route path="/home" element={<Dashboard />} />
            <Route path="/surveys">
                <Route index element={<SurveyListing />} />
                <Route path="create" element={<CreateSurvey />} />

                <Route path=":surveyId" errorElement={<NotFound />} id="survey" loader={SurveyLoader}>
                    <Route path="build" element={<SurveyFormBuilder />} />
                    <Route path="report" element={<ReportSettings />} />
                    <Route path="submit" element={<SurveySubmit />} />
                    <Route element={<AuthGate allowedRoles={[USER_ROLES.VIEW_APPROVED_COMMENTS]} />}>
                        <Route path="comments" element={<CommentReviewListing />} />
                        <Route path="comments/all" element={<CommentTextListing />} />
                    </Route>
                    <Route element={<AuthGate allowedRoles={[USER_ROLES.REVIEW_COMMENTS]} />}>
                        <Route path="submissions/:submissionId/review" element={<CommentReview />} />
                    </Route>
                </Route>
            </Route>
            <Route
                path="/engagements"
                id="engagement-listing"
                errorElement={<NotFound />}
                handle={{ crumb: () => ({ name: 'Engagements' }) }}
            >
                <Route index element={<EngagementListing />} />
                <Route path="search" element={<Navigate to="/engagements" />} loader={engagementListLoader} />
                <Route
                    path="create"
                    action={engagementCreateAction}
                    element={<AuthGate allowedRoles={[USER_ROLES.CREATE_ENGAGEMENT]} />}
                >
                    <Route index element={<Navigate to="wizard" />} />
                    <Route path="form" element={<EngagementForm />} />
                    <Route
                        path="wizard"
                        handle={{ crumb: () => ({ name: 'New Engagement' }) }}
                        element={<EngagementCreationWizard />}
                    />
                </Route>
                <Route
                    path=":engagementId"
                    id="single-engagement"
                    errorElement={<NotFound />}
                    loader={engagementLoader}
                    handle={{
                        crumb: async (data: { engagement: Promise<Engagement> }) => {
                            return data.engagement.then((engagement) => {
                                return {
                                    link: `/engagements/${engagement.id}/old-view`,
                                    name: engagement.name,
                                };
                            });
                        },
                    }}
                >
                    <Route element={<AuthGate allowedRoles={[USER_ROLES.EDIT_ENGAGEMENT]} />}>
                        <Route path="form" element={<EngagementForm />} />
                    </Route>
                    <Route path="old-view" element={<OldEngagementView />} />
                    <Route index element={<Navigate to="details/config" />} />
                    <Route path="details">
                        <Route index element={<Navigate to="config" />} />
                        {/* Wraps the tabs with the engagement title and TabContext */}
                        <Route element={<AdminEngagementView />}>
                            <Route path="config" element={<ConfigTab />} />
                            <Route path="authoring" element={<AuthoringTab />}></Route>
                            <Route path="*" element={<NotFound />} />
                        </Route>
                        <Route
                            path="authoring"
                            handle={{ crumb: () => ({ name: 'Authoring' }) }}
                            element={<AuthGate allowedRoles={[USER_ROLES.EDIT_ENGAGEMENT]} />}
                        >
                            <Route element={<AuthoringContext />}>
                                <Route element={<AuthoringTemplate />} loader={authoringLoader} id="authoring-loader">
                                    <Route
                                        path="banner"
                                        element={<AuthoringBanner />}
                                        action={engagementAuthoringUpdateAction}
                                        handle={{
                                            crumb: () => ({
                                                link: `banner`,
                                                name: 'Hero Banner',
                                            }),
                                        }}
                                    />
                                    <Route
                                        path="summary"
                                        action={engagementAuthoringUpdateAction}
                                        element={<AuthoringSummary />}
                                        handle={{
                                            crumb: () => ({
                                                link: `summary`,
                                                name: 'Summary',
                                            }),
                                        }}
                                    />
                                    <Route
                                        path="details"
                                        action={engagementAuthoringUpdateAction}
                                        element={<AuthoringDetails />}
                                        handle={{
                                            crumb: () => ({
                                                link: `details`,
                                                name: 'Details',
                                            }),
                                        }}
                                    />
                                    <Route
                                        path="feedback"
                                        action={engagementAuthoringUpdateAction}
                                        element={<AuthoringFeedback />}
                                        handle={{
                                            crumb: () => ({
                                                link: `feedback`,
                                                name: 'Provide Feedback',
                                            }),
                                        }}
                                    />
                                    <Route
                                        path="results"
                                        element={<AuthoringResults />}
                                        handle={{
                                            crumb: () => ({
                                                link: `results`,
                                                name: 'View Results',
                                            }),
                                        }}
                                    />
                                    <Route
                                        path="subscribe"
                                        element={<AuthoringSubscribe />}
                                        handle={{
                                            crumb: () => ({
                                                link: `subscribe`,
                                                name: 'Subscribe',
                                            }),
                                        }}
                                    />
                                    <Route
                                        path="more"
                                        element={<AuthoringMore />}
                                        handle={{
                                            crumb: () => ({
                                                link: `more`,
                                                name: 'More Engagements',
                                            }),
                                        }}
                                    />
                                </Route>
                            </Route>
                        </Route>
                        <Route path="*" element={<NotFound />} />
                        <Route
                            path="config/edit"
                            element={<EngagementConfigurationWizard />}
                            action={engagementUpdateAction}
                            handle={{
                                crumb: () => ({ name: 'Configure' }),
                            }}
                        />
                    </Route>
                    <Route element={<AuthGate allowedRoles={[USER_ROLES.EDIT_ENGAGEMENT]} />}>
                        <Route path="form" element={<EngagementForm />} />
                    </Route>
                    <Route path="comments/:dashboardType" element={<EngagementComments />} />
                    <Route path="dashboard/:dashboardType" element={<PublicDashboard />} />
                </Route>
                <Route path=":slug">
                    <Route index element={<OldEngagementView />} />
                    <Route path="comments/:dashboardType" element={<EngagementComments />} />
                    <Route path="dashboard/:dashboardType" element={<PublicDashboard />} />
                </Route>
            </Route>
            <Route path="/metadatamanagement" element={<MetadataManagement />} />
            <Route path="/languages" element={<Language />} loader={languageLoader} />
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
                <Route path="search" element={<Navigate to="/usermanagement" />} loader={userSearchLoader} />
                <Route path=":userId/details" element={<UserProfile />} />
            </Route>
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/not-found" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
        </>
    );
};

export default AuthenticatedRoutes;
