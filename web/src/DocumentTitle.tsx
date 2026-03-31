import React from 'react';
import { Helmet } from 'react-helmet-async';
import { TenantState } from 'reduxSlices/tenantSlice';
import { useAppSelector } from './hooks';
const DocumentTitle = () => {
    const tenant: TenantState = useAppSelector((state) => state.tenant);
    return (
        <Helmet>
            <title>{tenant.title}</title>
        </Helmet>
    );
};

export default DocumentTitle;
