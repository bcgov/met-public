import { Breadcrumbs } from '@mui/material';
import React from 'react';
import { BodyText, Link } from '../Typography';

type BreadcrumbProps = {
    name: string;
    link?: string;
};

export const BreadcrumbTrail: React.FC<{ crumbs: BreadcrumbProps[]; smallScreenOnly?: boolean }> = ({
    crumbs,
    smallScreenOnly,
}) => {
    return (
        <Breadcrumbs aria-label="breadcrumb" sx={smallScreenOnly ? { display: { xs: 'block', md: 'none' } } : {}}>
            {crumbs.map((crumb, index) =>
                crumb.link ? (
                    <Link small key={index} to={crumb.link}>
                        {crumb.name}
                    </Link>
                ) : (
                    <BodyText small bold={index == crumbs.length - 1} key={index} sx={{ lineHeight: '24px' }}>
                        {crumb.name}
                    </BodyText>
                ),
            )}
        </Breadcrumbs>
    );
};
