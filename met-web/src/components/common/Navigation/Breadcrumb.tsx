import { Breadcrumbs } from '@mui/material';
import React from 'react';
import { BodyText } from '../Typography';
import { Link } from '../Navigation';

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
                    <Link size="small" key={crumb.name} to={crumb.link}>
                        {crumb.name}
                    </Link>
                ) : (
                    <BodyText
                        size="small"
                        bold={index == crumbs.length - 1}
                        key={crumb.name}
                        sx={{ lineHeight: '24px' }}
                    >
                        {crumb.name}
                    </BodyText>
                ),
            )}
        </Breadcrumbs>
    );
};
