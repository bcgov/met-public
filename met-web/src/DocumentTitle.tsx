import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useAppTranslation } from 'hooks';
const DocumentTitle = () => {
    const { t: translate } = useAppTranslation();
    return (
        <Helmet>
            <title>{translate('header.title')}</title>
        </Helmet>
    );
};

export default DocumentTitle;
