import React from 'react';
import '@bcgov/design-tokens/css-prefixed/variables.css'; // Will be available to use in all component
import { Outlet } from 'react-router-dom';
import PublicHeader from '../layout/Header/PublicHeader';
import { Notification } from 'components/common/notification';
import PageViewTracker from 'routes/PageViewTracker';
import { NotificationModal } from 'components/common/modal';
import { FeedbackModal } from 'components/feedback/FeedbackModal';
import Footer from 'components/layout/Footer';
import DocumentTitle from 'DocumentTitle';
import ScrollToTop from 'components/scrollToTop';

export const PublicLayout = () => {
    return (
        <>
            <DocumentTitle />
            <PageViewTracker />
            <Notification />
            <NotificationModal />
            <PublicHeader />
            <ScrollToTop />
            <Outlet />
            <FeedbackModal />
            <Footer />
        </>
    );
};
