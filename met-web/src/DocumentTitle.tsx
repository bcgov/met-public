import React from 'react';
import { Helmet } from 'react-helmet-async';

const DocumentTitle = ({ pageTitle }: { pageTitle: string }) => {
    return (
        <Helmet>
            <title>{pageTitle}</title>
        </Helmet>
    );
};

export default DocumentTitle;
