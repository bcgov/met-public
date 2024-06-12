import React from 'react';
import '@bcgov/design-tokens/css-prefixed/variables.css'; // Variables will be within scope within PublicLayout and its children
import { Outlet } from 'react-router-dom';
import PublicHeader from '../layout/Header/PublicHeader';
import { Notification } from 'components/common/notification';
import PageViewTracker from 'routes/PageViewTracker';
import { NotificationModal } from 'components/common/modal';
import { FeedbackModal } from 'components/feedback/FeedbackModal';
import Footer from 'components/layout/Footer';
import DocumentTitle from 'DocumentTitle';
import ScrollToTop from 'components/scrollToTop';
import { WidthLimiter } from 'components/common/Layout';

export const PublicLayout = () => {
    return (
        <WidthLimiter>
            <DocumentTitle />
            <PageViewTracker />
            <Notification />
            <NotificationModal />
            <PublicHeader />
            <ScrollToTop />
            <Outlet />
            <FeedbackModal />
            <Footer />
        </WidthLimiter>
    );
};
